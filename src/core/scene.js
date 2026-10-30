import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#121a2a');
  // Keep the far end of the hall soft without hiding the architecture.
  scene.fog = new THREE.FogExp2('#121a2a', 0.012);
  return scene;
}
