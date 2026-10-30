import * as THREE from 'three';

export function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // The architecture is static, so render its shadow map once instead of rebuilding it every frame.
  renderer.shadowMap.autoUpdate = false;
  renderer.shadowMap.needsUpdate = true;
  renderer.domElement.setAttribute('aria-label', 'Interactive 3D memory palace. Use arrow keys to look around, 1 to select the crystal, 2 for the book, 3 for the lantern, and R to return to the entrance.');
  renderer.domElement.tabIndex = 0;
  container.appendChild(renderer.domElement);
  return renderer;
}
