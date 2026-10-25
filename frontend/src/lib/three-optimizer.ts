import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";

let sharedDracoLoader: DRACOLoader | null = null;

/**
 * 1. Set up the GLTF loader to use Draco compression.
 * Uses official Google Draco CDN decoders by default, preloaded for zero-lag decompression.
 */
export function getDracoLoader(
  decoderPath = "https://www.gstatic.com/draco/versioned/decoders/1.5.7/"
): DRACOLoader {
  if (!sharedDracoLoader) {
    sharedDracoLoader = new DRACOLoader();
    sharedDracoLoader.setDecoderPath(decoderPath);
    if (typeof window !== "undefined" && typeof (globalThis as any).ProgressEvent !== "undefined") {
      sharedDracoLoader.preload();
    }
  }
  return sharedDracoLoader;
}

export function createOptimizedGLTFLoader(customDecoderPath?: string): GLTFLoader {
  const loader = new GLTFLoader();
  const draco = getDracoLoader(customDecoderPath);
  loader.setDRACOLoader(draco);
  return loader;
}

/**
 * 2. Cap the renderer's pixel ratio to Math.min(window.devicePixelRatio, 1.5).
 * Disables real-time shadow maps to prevent multi-pass rendering overhead on low-end GPUs.
 */
export function configureOptimizedRenderer(
  renderer: THREE.WebGLRenderer,
  options: {
    maxPixelRatio?: number;
  } = {}
): THREE.WebGLRenderer {
  const maxDpr = options.maxPixelRatio ?? 1.5;
  const dpr = typeof window !== "undefined" ? Math.min(window.devicePixelRatio || 1, maxDpr) : 1;
  renderer.setPixelRatio(dpr);

  // Disable shadow maps to save GPU passes & memory on low-end devices
  renderer.shadowMap.enabled = false;
  renderer.shadowMap.autoUpdate = false;

  return renderer;
}

/**
 * 3. Convert heavily repeated geometries into an InstancedMesh to reduce GPU draw calls.
 * Scans object hierarchy, groups duplicate geometry/material pairs, and merges them into
 * single draw-call InstancedMeshes with instanced transform matrices.
 */
export function convertRepeatedGeometriesToInstancedMesh(
  root: THREE.Object3D,
  minDuplicates = 2
): {
  instancedMeshes: THREE.InstancedMesh[];
  originalMeshCount: number;
} {
  // Collect all meshes grouped by geometry UUID + material UUID
  const groups = new Map<string, THREE.Mesh[]>();
  const collectedMeshes: THREE.Mesh[] = [];

  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh && !(obj instanceof THREE.InstancedMesh)) {
      const mesh = obj as THREE.Mesh;
      collectedMeshes.push(mesh);
      const matId = Array.isArray(mesh.material)
        ? mesh.material.map((m) => m.uuid).join(":")
        : mesh.material?.uuid || "default";
      const key = `${mesh.geometry.uuid}_${matId}`;

      let list = groups.get(key);
      if (!list) {
        list = [];
        groups.set(key, list);
      }
      list.push(mesh);
    }
  });

  const createdInstancedMeshes: THREE.InstancedMesh[] = [];
  const matrix = new THREE.Matrix4();

  for (const [, meshes] of groups) {
    if (meshes.length >= minDuplicates) {
      const count = meshes.length;
      const ref = meshes[0]!;
      const instancedMesh = new THREE.InstancedMesh(ref.geometry, ref.material, count);
      instancedMesh.frustumCulled = true;

      meshes.forEach((mesh, index) => {
        mesh.updateMatrixWorld(true);
        matrix.copy(mesh.matrixWorld);
        instancedMesh.setMatrixAt(index, matrix);
      });

      instancedMesh.instanceMatrix.needsUpdate = true;
      if (instancedMesh.geometry) {
        instancedMesh.geometry.computeBoundingBox();
        instancedMesh.geometry.computeBoundingSphere();
      }

      // Add instanced mesh to the parent of the first instance and remove originals
      const parent = ref.parent || root;
      parent.add(instancedMesh);

      meshes.forEach((mesh) => {
        mesh.parent?.remove(mesh);
      });

      createdInstancedMeshes.push(instancedMesh);
    }
  }

  return {
    instancedMeshes: createdInstancedMeshes,
    originalMeshCount: collectedMeshes.length,
  };
}

/**
 * 4. Disable real-time shadows and dynamic lights, and swap out complex materials
 * for unlit/basic materials to support baked lighting.
 */
export function convertToUnlitMaterials(
  root: THREE.Object3D,
  options: { removeDynamicLights?: boolean } = { removeDynamicLights: true }
): { convertedCount: number; lightsRemoved: number } {
  let lightsRemoved = 0;
  let convertedCount = 0;

  // Remove dynamic lights (PointLight, SpotLight, DirectionalLight)
  if (options.removeDynamicLights) {
    const toRemove: THREE.Object3D[] = [];
    root.traverse((obj) => {
      if (
        obj instanceof THREE.PointLight ||
        obj instanceof THREE.SpotLight ||
        obj instanceof THREE.DirectionalLight
      ) {
        toRemove.push(obj);
      }
    });
    toRemove.forEach((light) => {
      light.parent?.remove(light);
      lightsRemoved++;
    });
  }

  // Cache converted materials to reuse identical basic materials across meshes
  const materialCache = new Map<string, THREE.MeshBasicMaterial>();

  // Disable shadows and convert complex PBR materials (MeshStandard, MeshPhysical) to unlit MeshBasicMaterial
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.castShadow = false;
      mesh.receiveShadow = false;

      if (mesh.material) {
        const convertMat = (mat: THREE.Material): THREE.Material => {
          if (mat instanceof THREE.MeshBasicMaterial) return mat;

          const cached = materialCache.get(mat.uuid);
          if (cached) return cached;

          const anyMat = mat as any;
          const basic = new THREE.MeshBasicMaterial({
            color: anyMat.color ? anyMat.color.clone() : new THREE.Color(0xffffff),
            map: anyMat.map || null,
            lightMap: anyMat.lightMap || null,
            lightMapIntensity: anyMat.lightMapIntensity ?? 1,
            aoMap: anyMat.aoMap || null,
            aoMapIntensity: anyMat.aoMapIntensity ?? 1,
            alphaMap: anyMat.alphaMap || null,
            transparent: anyMat.transparent ?? false,
            opacity: anyMat.opacity ?? 1,
            side: anyMat.side ?? THREE.FrontSide,
            depthWrite: anyMat.depthWrite ?? true,
            depthTest: anyMat.depthTest ?? true,
            wireframe: anyMat.wireframe ?? false,
          });

          materialCache.set(mat.uuid, basic);
          mat.dispose();
          convertedCount++;
          return basic;
        };

        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map(convertMat);
        } else {
          mesh.material = convertMat(mesh.material);
        }
      }
    }
  });

  return { convertedCount, lightsRemoved };
}

/**
 * 5. Verify that frustum culling is enabled for the entire scene.
 * Ensures every mesh and geometry computes valid bounding volumes so offscreen
 * geometry is never submitted to the GPU.
 */
export function verifyAndEnforceFrustumCulling(root: THREE.Object3D): {
  verifiedCount: number;
} {
  let count = 0;
  root.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh) {
      const mesh = obj as THREE.Mesh;
      mesh.frustumCulled = true;

      if (mesh.geometry) {
        if (!mesh.geometry.boundingSphere) {
          mesh.geometry.computeBoundingSphere();
        }
        if (!mesh.geometry.boundingBox) {
          mesh.geometry.computeBoundingBox();
        }
      }
      count++;
    }
  });
  return { verifiedCount: count };
}

/**
 * Master 3D Optimization Pipeline.
 * Executes all 5 performance optimizations on an existing scene and renderer.
 */
export function optimize3DScene(
  scene: THREE.Object3D,
  renderer?: THREE.WebGLRenderer,
  options: {
    capPixelRatio?: boolean;
    maxPixelRatio?: number;
    convertRepeatedGeometries?: boolean;
    useUnlitMaterials?: boolean;
    removeDynamicLights?: boolean;
    enforceFrustumCulling?: boolean;
  } = {}
) {
  if (renderer && options.capPixelRatio !== false) {
    configureOptimizedRenderer(renderer, { maxPixelRatio: options.maxPixelRatio ?? 1.5 });
  }

  if (options.useUnlitMaterials !== false) {
    convertToUnlitMaterials(scene, { removeDynamicLights: options.removeDynamicLights !== false });
  }

  if (options.convertRepeatedGeometries !== false) {
    convertRepeatedGeometriesToInstancedMesh(scene);
  }

  if (options.enforceFrustumCulling !== false) {
    verifyAndEnforceFrustumCulling(scene);
  }
}
