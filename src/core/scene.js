import * as THREE from 'three';

export function createScene() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#172334');
  scene.fog = new THREE.FogExp2('#172334', 0.035);
  return scene;
}
