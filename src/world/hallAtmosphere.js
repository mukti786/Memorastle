import * as THREE from 'three';

export function createDustMotes(scene, count = 42) {
  const positions = new Float32Array(count * 3);
  const phases = new Float32Array(count);
  const baseY = new Float32Array(count);

  for (let i = 0; i < count; i += 1) {
    const angle = i * 2.399963;
    const radius = 1.5 + ((i * 13) % 100) / 100 * 7.8;
    const y = 0.35 + ((i * 37) % 100) / 100 * 10.5;
    positions[i * 3] = Math.cos(angle) * radius;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = 5 - ((i * 23) % 100) / 100 * 24;
    phases[i] = angle;
    baseY[i] = y;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
  const material = new THREE.PointsMaterial({ color: '#c6ddf3', size: 0.055, sizeAttenuation: true, transparent: true, opacity: 0.58, depthWrite: false });
  const motes = new THREE.Points(geometry, material);
  motes.frustumCulled = false;
  scene.add(motes);

  return {
    update(elapsed) {
      for (let i = 0; i < count; i += 1) positions[i * 3 + 1] = baseY[i] + Math.sin(elapsed * 0.45 + phases[i]) * 0.13;
      geometry.attributes.position.needsUpdate = true;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
