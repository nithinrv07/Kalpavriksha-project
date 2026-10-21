"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";

/** Words as rendered and as highlighted: both sides must split the same way. */
export const splitWords = (line: string) => line.split(/\s+/).filter(Boolean);

type ReadState = { readonly id: string | null; readonly line: number; readonly word: number; readonly silent: boolean };
const IDLE: ReadState = { id: null, line: -1, word: -1, silent: false };

/** Rough reading pace; long Tamil/Devanagari words get proportionally more time. */
const wordMs = (word: string, rate: number) => (Math.min(1.8, Math.max(0.7, word.length / 5)) * 520) / rate;

function findVoice(voices: readonly SpeechSynthesisVoice[], lang: Locale) {
  return voices.find((v) => v.lang.toLowerCase().replace("_", "-").startsWith(lang));
}

/**
 * Read lines aloud with the device's own voice (Web Speech API) and report the
 * current line and word for karaoke highlighting. With no voice for the language,
 * it still steps through the words on a timer ("silent" sing-along mode).
 */
export function useReadAloud() {
  const [state, setState] = useState<ReadState>(IDLE);
  const run = useRef(0);
  const timer = useRef<number | undefined>(undefined);
  const voices = useRef<readonly SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
    if (!synth) return;
    const load = () => (voices.current = synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => {
      synth.removeEventListener("voiceschanged", load);
      run.current += 1;
      window.clearTimeout(timer.current);
      synth.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    run.current += 1;
    window.clearTimeout(timer.current);
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setState(IDLE);
  }, []);

  const play = useCallback(
    (id: string, lines: readonly string[], lang: Locale, opts: { rate?: number; onDone?: () => void } = {}) => {
      const rate = opts.rate ?? 1;
      const token = ++run.current;
      window.clearTimeout(timer.current);
      const synth = "speechSynthesis" in window ? window.speechSynthesis : null;
      synth?.cancel();
      const voice = synth ? findVoice(voices.current, lang) : undefined;
      const silent = !voice;
      const live = () => token === run.current;

      const playLine = (li: number) => {
        if (!live()) return;
        const text = lines[li];
        if (text === undefined) {
          setState(IDLE);
          opts.onDone?.();
          return;
        }
        const words = splitWords(text);
        const starts: number[] = [];
        let pos = 0;
        for (const w of words) {
          const at = text.indexOf(w, pos);
          starts.push(at);
          pos = at + w.length;
        }

        let w = 0;
        let boundaries = false;
        setState({ id, line: li, word: 0, silent });

        // Estimated stepping; real word-boundary events take over when the voice sends them.
        const tick = () => {
          if (!live() || boundaries) return;
          if (w < words.length - 1) {
            w += 1;
            setState({ id, line: li, word: w, silent });
            timer.current = window.setTimeout(tick, wordMs(words[w] ?? "", rate));
          } else if (silent) {
            timer.current = window.setTimeout(() => playLine(li + 1), wordMs(words[w] ?? "", rate) + 250);
          }
        };
        timer.current = window.setTimeout(tick, wordMs(words[0] ?? "", rate));

        if (!synth || !voice) return;
        const u = new SpeechSynthesisUtterance(text);
        u.voice = voice;
        u.lang = voice.lang;
        u.rate = rate;
        u.onboundary = (e) => {
          if (!live() || (e.name && e.name !== "word")) return;
          boundaries = true;
          window.clearTimeout(timer.current);
          let idx = 0;
          for (let i = 0; i < starts.length; i++) if ((starts[i] ?? 0) <= e.charIndex) idx = i;
          setState({ id, line: li, word: idx, silent });
        };
        const next = () => {
          window.clearTimeout(timer.current);
          if (live()) timer.current = window.setTimeout(() => playLine(li + 1), 250);
        };
        u.onend = next;
        u.onerror = next;
        synth.speak(u);
      };

      playLine(0);
    },
    [],
  );

  return { state, play, stop };
}

/** Lines with per-word karaoke states driven by `useReadAloud`. */
export function KaraokeLines({
  lines,
  lang,
  activeLine,
  activeWord,
  className = "",
}: {
  lines: readonly string[];
  lang: Locale;
  activeLine: number;
  activeWord: number;
  className?: string;
}) {
  const playing = activeLine >= 0;
  return (
    <div lang={lang} className={className}>
      {lines.map((line, li) => (
        <p key={li} className="text-balance">
          {splitWords(line).map((word, wi) => {
            const state = !playing
              ? undefined
              : li < activeLine || (li === activeLine && wi < activeWord)
                ? "done"
                : li === activeLine && wi === activeWord
                  ? "now"
                  : "next";
            return (
              <span key={wi} className="karaoke-word" data-state={state}>
                {word}{" "}
              </span>
            );
          })}
        </p>
      ))}
    </div>
  );
}
