import { describe, expect, it } from "vitest";
import * as THREE from "three";
import {
  createOptimizedGLTFLoader,
  configureOptimizedRenderer,
  convertRepeatedGeometriesToInstancedMesh,
  convertToUnlitMaterials,
  verifyAndEnforceFrustumCulling,
  optimize3DScene,
} from "./three-optimizer";

describe("three-optimizer", () => {
  it("1. sets up GLTF loader with Draco compression loader", () => {
    const loader = createOptimizedGLTFLoader();
    expect(loader).toBeDefined();
    // Verify draco loader is attached
    expect((loader as any).dracoLoader).toBeDefined();
  });

  it("2. caps the renderer pixel ratio to Math.min(dpr, 1.5) and disables shadow maps", () => {
    // Mock minimal WebGLRenderer
    let setPixelRatioCalledWith = 0;
    const mockRenderer = {
      setPixelRatio: (dpr: number) => {
        setPixelRatioCalledWith = dpr;
      },
      shadowMap: {
        enabled: true,
        autoUpdate: true,
      },
    } as unknown as THREE.WebGLRenderer;

    configureOptimizedRenderer(mockRenderer, { maxPixelRatio: 1.5 });
    expect(setPixelRatioCalledWith).toBeLessThanOrEqual(1.5);
    expect(mockRenderer.shadowMap.enabled).toBe(false);
  });

  it("3. converts heavily repeated geometries into an InstancedMesh", () => {
    const scene = new THREE.Scene();
    const geom = new THREE.BoxGeometry(1, 1, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0xff0000 });

    // Create 5 identical meshes
    for (let i = 0; i < 5; i++) {
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(i * 2, 0, 0);
      scene.add(mesh);
    }

    expect(scene.children.length).toBe(5);

    const result = convertRepeatedGeometriesToInstancedMesh(scene, 2);
    expect(result.instancedMeshes.length).toBe(1);
    expect(result.originalMeshCount).toBe(5);

    // The 5 individual meshes are replaced by 1 InstancedMesh with count 5
    expect(scene.children.length).toBe(1);
    const instanced = scene.children[0] as THREE.InstancedMesh;
    expect(instanced.isInstancedMesh).toBe(true);
    expect(instanced.count).toBe(5);
    expect(instanced.frustumCulled).toBe(true);
  });

  it("4. disables real-time shadows, removes dynamic lights, and swaps complex materials to unlit", () => {
    const scene = new THREE.Scene();
    const light = new THREE.PointLight(0xffffff, 1, 100);
    scene.add(light);

    const pbrMat = new THREE.MeshStandardMaterial({
      color: 0x00ff00,
      roughness: 0.5,
      metalness: 0.8,
    });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(1), pbrMat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);

    const { convertedCount, lightsRemoved } = convertToUnlitMaterials(scene, {
      removeDynamicLights: true,
    });

    expect(lightsRemoved).toBe(1);
    expect(scene.children.includes(light)).toBe(false);
    expect(convertedCount).toBe(1);
    expect(mesh.castShadow).toBe(false);
    expect(mesh.receiveShadow).toBe(false);
    expect(mesh.material instanceof THREE.MeshBasicMaterial).toBe(true);
    expect((mesh.material as unknown as THREE.MeshBasicMaterial).color.getHex()).toBe(0x00ff00);
  });

  it("5. verifies that frustum culling is enabled and bounding volumes computed", () => {
    const scene = new THREE.Scene();
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), new THREE.MeshBasicMaterial());
    mesh.frustumCulled = false;
    scene.add(mesh);

    const result = verifyAndEnforceFrustumCulling(scene);
    expect(result.verifiedCount).toBe(1);
    expect(mesh.frustumCulled).toBe(true);
    expect(mesh.geometry.boundingSphere).toBeDefined();
    expect(mesh.geometry.boundingBox).toBeDefined();
  });

  it("executes the master optimize3DScene pipeline smoothly", () => {
    const scene = new THREE.Scene();
    const geom = new THREE.CylinderGeometry(1, 1, 2);
    const mat = new THREE.MeshStandardMaterial({ color: 0x0000ff });

    for (let i = 0; i < 4; i++) {
      scene.add(new THREE.Mesh(geom, mat));
    }

    optimize3DScene(scene);
    expect(scene.children.length).toBe(1);
    expect((scene.children[0] as THREE.InstancedMesh).isInstancedMesh).toBe(true);
  });
});
