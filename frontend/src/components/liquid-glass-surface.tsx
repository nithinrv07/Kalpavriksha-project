"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Liquid glass surface.
 *
 * The refraction shader is adapted from dashersw/liquid-glass-js (MIT,
 * © 2025 Armagan Amcalar) — https://github.com/dashersw/liquid-glass-js
 *
 * That library renders a WebGL pass that samples a snapshot of the page and
 * bends it near the shape's rim, which is what gives the thick, wet glass
 * edge. Three changes here:
 *
 *  - the slab's body is a live `backdrop-filter` blur of what is really behind
 *    the panel, so the animated backdrop keeps moving inside the glass; a
 *    one-off page snapshot can never do that (it freezes composited CSS
 *    animations at the state html2canvas can read);
 *  - the WebGL pass therefore only paints the refracted, colour-fringed rim,
 *    which is where the distortion actually reads;
 *  - the rim texture is captured from the animated backdrop layer
 *    (`[data-glass-backdrop]`) in *viewport* space with html2canvas-pro,
 *    because the original html2canvas cannot parse the oklch/oklab colours
 *    that Tailwind v4 emits from `color-mix()`.
 */

type Snapshot = {
  readonly key: string;
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  /** `viewport`: fixed backdrop, sample with the panel's viewport rect. */
  readonly space: "viewport" | "page";
};

const BACKDROP_SELECTOR = "[data-glass-backdrop]";

const VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_uv;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
  v_uv = a_texcoord;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying vec2 v_uv;

uniform sampler2D u_image;
uniform vec2 u_size;       // panel size, css px
uniform vec2 u_origin;     // panel top-left, css px (viewport or page space)
uniform vec2 u_page;       // captured backdrop size, css px
uniform float u_radius;    // css px
uniform float u_blur;      // css px
uniform float u_edge;      // rim displacement, css px
uniform float u_rim;       // inner displacement, css px
uniform float u_corner;    // corner displacement, css px
uniform float u_ripple;    // surface ripple, css px
uniform float u_band;      // rim band depth, css px
uniform float u_tint;      // 0..1
uniform vec3 u_tint_color;
uniform float u_darken;    // interior absorption multiplier

float sdRoundBox(vec2 p, vec2 b, float r) {
  vec2 q = abs(p) - b + r;
  return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
}

vec3 glassSample(vec2 uv) {
  // Clamp just inside the texture so sampling never wraps the page.
  return texture2D(u_image, clamp(uv, vec2(0.002), vec2(0.998))).rgb;
}

void main() {
  vec2 halfSize = u_size * 0.5;
  vec2 p = (v_uv - 0.5) * u_size;

  float d = sdRoundBox(p, halfSize, u_radius);
  float inside = max(-d, 0.0);

  // Surface normal of the rounded box, nudged outward at the corners.
  float e = 0.75;
  vec2 grad = vec2(
    sdRoundBox(p + vec2(e, 0.0), halfSize, u_radius) - sdRoundBox(p - vec2(e, 0.0), halfSize, u_radius),
    sdRoundBox(p + vec2(0.0, e), halfSize, u_radius) - sdRoundBox(p - vec2(0.0, e), halfSize, u_radius)
  );
  vec2 n = normalize(grad + vec2(0.0001));
  vec2 tangent = vec2(-n.y, n.x);

  // Three falloffs: a tight rim, a broad lens band, and the corner bulge.
  float edgeFalloff = exp(-inside / 55.0);
  float rimFalloff = exp(-inside / 190.0);
  float cornerGap = min(halfSize.x - abs(p.x), halfSize.y - abs(p.y));
  float cornerFalloff = exp(-cornerGap / 72.0);

  float lift = edgeFalloff * u_edge + rimFalloff * u_rim + cornerFalloff * u_corner;
  // The header sits right above the panel, so keep the top edge from mirroring
  // the nav pills into the glass.
  float topTaper = mix(0.22, 1.0, smoothstep(-halfSize.y, -halfSize.y + 170.0, p.y));
  lift *= topTaper;
  float ripple = sin(inside * 0.32) * u_ripple * rimFalloff;

  vec2 base = (u_origin + v_uv * u_size) / u_page;
  vec2 shift = (n * lift + tangent * ripple) / u_page;

  // Gaussian blur of the refracted backdrop.
  float sigma = max(u_blur * 0.5, 0.0001);
  float stepPx = max(u_blur / 3.0, 0.0001);
  vec3 sum = vec3(0.0);
  float total = 0.0;

  for (int i = -6; i <= 6; i++) {
    for (int j = -6; j <= 6; j++) {
      vec2 o = vec2(float(i), float(j));
      float dist = length(o);
      if (dist > 6.0) continue;
      float w = exp(-(dist * dist) / (2.0 * sigma * sigma));
      sum += glassSample(base + shift + (o * stepPx) / u_page) * w;
      total += w;
    }
  }

  vec3 color = sum / total;

  // The rim is a lens, not a frost: keep a crisp, colour-fringed slice of the
  // backdrop there and let it melt into the blurred body further in.
  vec2 rimUv = base + shift;
  vec2 fringe = n * (2.2 * edgeFalloff) / u_page;
  vec3 sharp;
  sharp.r = glassSample(rimUv + fringe).r;
  sharp.g = glassSample(rimUv).g;
  sharp.b = glassSample(rimUv - fringe).b;
  color = mix(color, sharp, clamp(edgeFalloff * 0.95 * mix(0.18, 1.0, topTaper), 0.0, 1.0));

  // Thick glass: a touch darker where the body meets the edge, and a polished
  // bevel that catches the room light.
  color *= mix(0.86, 1.0, smoothstep(0.0, 30.0, inside));
  color *= u_darken;
  color += vec3(1.0) * exp(-inside / 70.0) * (u_tint * 0.22);

  // Tint, denser at the rim so the slab reads as a solid volume.
  vec3 tint = mix(u_tint_color, u_tint_color * 1.04, v_uv.y);
  float tintAmount = u_tint * (0.42 + 0.58 * edgeFalloff);
  color = mix(color, tint, clamp(tintAmount, 0.0, 1.0));

  // Specular rim: the bright line that sells the glass edge.
  float rimLine = smoothstep(2.0, 0.0, abs(d + 0.7));
  float topBias = smoothstep(-0.4, 0.9, -n.y);
  float lightBias = smoothstep(-0.8, 0.8, dot(n, normalize(vec2(-0.45, -0.9))));
  color += vec3(1.0) * rimLine * (0.07 + 0.30 * topBias + 0.12 * lightBias);

  // Only the rim is painted here. The slab's body is a live backdrop blur
  // sitting behind this canvas, so the glass never shows a frozen page image;
  // this pass adds the refracted, colour-fringed lens band at the edge.
  float band = 1.0 - smoothstep(u_band * 0.55, u_band, inside);
  float alpha = band * (1.0 - smoothstep(-1.0, 1.0, d));
  gl_FragColor = vec4(color * alpha, alpha);
}`;
/** Last backdrop texture, plus the capture every glass surface shares. */
let backdrop: { key: string; snapshot: Snapshot } | null = null;
let backdropPending: { key: string; promise: Promise<Snapshot | null> } | null = null;

/**
 * Capture the animated backdrop layer in viewport space.
 *
 * The backdrop is `position: fixed`, so it never scrolls with the page: the
 * panel is a moving window onto it. Sampling it in viewport coordinates keeps
 * the refraction aligned at every scroll position.
 *
 * The texture only feeds the rim, so it is captured once per theme and viewport
 * size and shared by every surface on the page (the landing page mounts three).
 */
async function captureBackdrop(theme: string): Promise<Snapshot | null> {
  const element = document.querySelector<HTMLElement>(BACKDROP_SELECTOR);
  if (!element) return null;

  const width = Math.max(1, window.innerWidth);
  const height = Math.max(1, window.innerHeight);
  const key = `${theme}:${width}x${height}`;

  if (backdrop?.key === key) return backdrop.snapshot;
  if (backdropPending?.key === key) return backdropPending.promise;

  const promise = (async () => {
    const { default: html2canvas } = await import("html2canvas-pro");

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      scale: 0.5,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (node) => (node as HTMLElement).dataset?.glassIgnore === "true",
    });

    const snapshot: Snapshot = { key, canvas, width, height, space: "viewport" };
    backdrop = { key, snapshot };
    return snapshot;
  })();

  backdropPending = { key, promise };
  try {
    return await promise;
  } finally {
    if (backdropPending?.promise === promise) backdropPending = null;
  }
}

/** Fallback: photograph the whole page, anchored in page coordinates. */
let cached: Snapshot | null = null;
let inflight: Promise<Snapshot | null> | null = null;

async function capturePage(key: string): Promise<Snapshot | null> {
  const live = await captureBackdrop(key).catch(() => null);
  if (live) return live;

  if (cached?.key === key) return cached;
  if (inflight) {
    const running = await inflight;
    if (running?.key === key) return running;
  }

  const run = (async () => {
    const { default: html2canvas } = await import("html2canvas-pro");
    const width = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
    const height = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);

    const canvas = await html2canvas(document.body, {
      backgroundColor: null,
      scale: 0.65,
      logging: false,
      useCORS: true,
      allowTaint: true,
      width,
      height,
      windowWidth: width,
      windowHeight: height,
      scrollX: 0,
      scrollY: 0,
      // The panel must not photograph itself.
      ignoreElements: (element) => (element as HTMLElement).dataset?.glassIgnore === "true",
    });

    const snapshot: Snapshot = { key, canvas, width, height, space: "page" };
    cached = snapshot;
    return snapshot;
  })();

  inflight = run
    .catch((error) => {
      console.warn("[liquid-glass] page capture failed", error);
      return null;
    })
    .finally(() => {
      inflight = null;
    });

  return inflight;
}

function compile(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("[liquid-glass]", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function buildProgram(gl: WebGLRenderingContext) {
  const vs = compile(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const fs = compile(gl, gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("[liquid-glass]", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

type LiquidGlassSurfaceProps = {
  readonly children: React.ReactNode;
  readonly radius?: number;
  /** Wrapper classes: border, shadow, padding. */
  readonly className?: string;
  /** Extra classes for the live backdrop layer (usually a tint). */
  readonly fallbackClassName?: string;
};

export function LiquidGlassSurface({
  children,
  radius = 28,
  className = "",
  fallbackClassName = "",
}: LiquidGlassSurfaceProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      preserveDrawingBuffer: true,
    });
    if (!gl) return;

    const program = buildProgram(gl);
    if (!program) return;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );

    const texcoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
      gl.STATIC_DRAW,
    );

    const positionLoc = gl.getAttribLocation(program, "a_position");
    const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");
    const u = (name: string) => gl.getUniformLocation(program, name);

    const uniforms = {
      size: u("u_size"),
      origin: u("u_origin"),
      page: u("u_page"),
      radius: u("u_radius"),
      blur: u("u_blur"),
      edge: u("u_edge"),
      rim: u("u_rim"),
      corner: u("u_corner"),
      ripple: u("u_ripple"),
      band: u("u_band"),
      tint: u("u_tint"),
      tintColor: u("u_tint_color"),
      darken: u("u_darken"),
      image: u("u_image"),
    };

    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    let alive = true;
    let hasTexture = false;
    /** Size/space of the texture currently uploaded. */
    let sampling: { width: number; height: number; space: Snapshot["space"] } | null = null;

    const themeKey = () => document.documentElement.dataset.theme || "dark";

    const draw = () => {
      if (!alive || !hasTexture || !sampling) return;

      const rect = wrap.getBoundingClientRect();
      const cssWidth = wrap.clientWidth;
      const cssHeight = wrap.clientHeight;
      if (cssWidth < 4 || cssHeight < 4) return;

      // Keep the drawing buffer honest but bounded: only the rim band is
      // painted here, so a lower buffer simply reads as frosted glass.
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      let bufferWidth = Math.round(cssWidth * dpr);
      let bufferHeight = Math.round(cssHeight * dpr);
      const maxPixels = 2_400_000;
      const shrink = Math.min(1, Math.sqrt(maxPixels / Math.max(1, bufferWidth * bufferHeight)));
      bufferWidth = Math.max(2, Math.round(bufferWidth * shrink));
      bufferHeight = Math.max(2, Math.round(bufferHeight * shrink));

      if (canvas.width !== bufferWidth || canvas.height !== bufferHeight) {
        canvas.width = bufferWidth;
        canvas.height = bufferHeight;
      }

      const light = themeKey() === "light";
      // Lens params are pixel sizes, so scale them with the slab: a 400px-tall
      // card would otherwise be almost entirely rim.
      const lens = Math.min(1, Math.max(0.42, Math.min(cssWidth, cssHeight) / 1000));

      gl.viewport(0, 0, bufferWidth, bufferHeight);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.enableVertexAttribArray(texcoordLoc);
      gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.image, 0);

      gl.uniform2f(uniforms.size, cssWidth, cssHeight);
      // Fixed backdrops live in viewport space; a page snapshot in page space.
      gl.uniform2f(
        uniforms.origin,
        rect.left + (sampling.space === "page" ? window.scrollX : 0),
        rect.top + (sampling.space === "page" ? window.scrollY : 0),
      );
      gl.uniform2f(uniforms.page, sampling.width, sampling.height);
      gl.uniform1f(uniforms.radius, radius);
      gl.uniform1f(uniforms.blur, light ? 8 : 9);
      gl.uniform1f(uniforms.edge, 52 * lens);
      gl.uniform1f(uniforms.rim, 10 * lens);
      gl.uniform1f(uniforms.corner, 22 * lens);
      gl.uniform1f(uniforms.ripple, 0.5 * lens);
      gl.uniform1f(uniforms.band, 150 * lens);
      if (light) {
        gl.uniform1f(uniforms.tint, 0.26);
        gl.uniform1f(uniforms.darken, 1.0);
        gl.uniform3f(uniforms.tintColor, 0.99, 0.972, 1.0);
      } else {
        gl.uniform1f(uniforms.tint, 0.2);
        gl.uniform1f(uniforms.darken, 0.78);
        gl.uniform3f(uniforms.tintColor, 0.3, 0.24, 0.52);
      }

      gl.drawArrays(gl.TRIANGLES, 0, 6);
      setReady(true);
    };

    const upload = (snapshot: Snapshot) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, snapshot.canvas);
      sampling = { width: snapshot.width, height: snapshot.height, space: snapshot.space };
      hasTexture = true;
    };

    // The rim samples a still of the backdrop, so only refresh it when the
    // page behind actually re-colours (theme flip) or the panel is resized.
    const load = async () => {
      const snapshot = await capturePage(themeKey());
      if (!alive || !snapshot) return;
      upload(snapshot);
      draw();
    };

    void load();

    // Scrolling moves the panel over the fixed backdrop, so re-sample the
    // mapping every frame; the texture itself stays put.
    let scrollFrame = 0;
    const onScroll = () => {
      if (scrollFrame) return;
      scrollFrame = window.requestAnimationFrame(() => {
        scrollFrame = 0;
        draw();
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Re-snapshot when the theme flips, since the page behind changes colour.
    // The theme toggle runs a view transition, so wait for it to finish before
    // photographing the page.
    let themeTimer: number | undefined;
    let lastTheme = themeKey();
    const observer = new MutationObserver(() => {
      if (themeKey() === lastTheme) return;
      lastTheme = themeKey();
      window.clearTimeout(themeTimer);
      themeTimer = window.setTimeout(() => {
        cached = null;
        hasTexture = false;
        setReady(false);
        void load();
      }, 900);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme", "class"],
    });

    let frame = 0;
    const resizeObserver = new ResizeObserver(() => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(draw);
    });
    resizeObserver.observe(wrap);

    // Fonts land after mount and can shift the panel by a few pixels.
    void document.fonts?.ready.then(() => {
      window.setTimeout(draw, 300);
    });

    return () => {
      alive = false;
      observer.disconnect();
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(scrollFrame);
      window.clearTimeout(themeTimer);
      gl.deleteTexture(texture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteBuffer(texcoordBuffer);
      gl.deleteProgram(program);
    };
  }, [radius]);

  return (
    <div
      ref={wrapRef}
      data-glass-ignore="true"
      className={`relative isolate overflow-hidden ${className}`}
      style={{ borderRadius: radius }}
    >
      {/* Live body: the browser blurs what is really behind the panel, so the
          glass keeps moving with the animated backdrop instead of showing a
          frozen page image. */}
      <div
        aria-hidden
        className={`liquid-glass-body pointer-events-none absolute inset-0 z-0 ${fallbackClassName}`}
        style={{ borderRadius: radius }}
      />
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0 size-full transition-opacity duration-500"
        style={{ borderRadius: radius, opacity: ready ? 1 : 0 }}
      />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
