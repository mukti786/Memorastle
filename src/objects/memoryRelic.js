import * as THREE from 'three';

export function createMemoryRelic() {
  const group = new THREE.Group();
  const coreMaterial = new THREE.MeshPhysicalMaterial({ color: '#b7e8f3', emissive: '#2c9fc2', emissiveIntensity: 1.25, roughness: 0.2, metalness: 0.18, clearcoat: 1, clearcoatRoughness: 0.14 });
  const core = new THREE.Mesh(new THREE.OctahedronGeometry(0.82, 1), coreMaterial);
  // The crystal floats and turns, so leave it out of the static shadow map.
  core.castShadow = false;
  group.add(core);

  const goldHalo = new THREE.Mesh(new THREE.TorusGeometry(1.35, 0.035, 10, 96), new THREE.MeshStandardMaterial({ color: '#e4c28a', emissive: '#8b5a30', emissiveIntensity: 0.35, metalness: 0.82, roughness: 0.26 }));
  goldHalo.rotation.x = Math.PI / 2.45;
  group.add(goldHalo);

  const cyanHalo = new THREE.Mesh(new THREE.TorusGeometry(1.72, 0.018, 8, 96), new THREE.MeshStandardMaterial({ color: '#8bd3e8', emissive: '#2582a0', emissiveIntensity: 0.82, metalness: 0.52, roughness: 0.24 }));
  cyanHalo.rotation.set(Math.PI / 2, 0.38, 0);
  group.add(cyanHalo);

  for (let index = 0; index < 3; index += 1) {
    const shard = new THREE.Mesh(new THREE.OctahedronGeometry(0.18, 0), coreMaterial);
    const angle = (index / 3) * Math.PI * 2;
    shard.position.set(Math.cos(angle) * 1.12, Math.sin(angle * 2) * 0.34, Math.sin(angle) * 1.12);
    group.add(shard);
  }

  group.position.set(0, 5.6, -17.4);
  return group;
}
