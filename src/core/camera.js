import * as THREE from 'three';

export function createCamera(aspect = window.innerWidth / window.innerHeight) {
  const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 100);
  camera.position.set(8, 5.4, 10);
  camera.lookAt(0, 1.3, 0);
  return camera;
}
