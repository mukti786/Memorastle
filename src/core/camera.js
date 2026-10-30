import * as THREE from 'three';

export function createCamera(aspect = window.innerWidth / window.innerHeight) {
  const camera = new THREE.PerspectiveCamera(48, aspect, 0.1, 140);
  camera.position.set(7.6, 8.2, 23.8);
  camera.lookAt(0, 4.2, -5);
  return camera;
}
