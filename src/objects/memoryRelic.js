import * as THREE from 'three';

export function createMemoryRelic() {
  const group = new THREE.Group();
  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.54, 1), new THREE.MeshStandardMaterial({ color: '#f5d39e', emissive: '#e88f4d', emissiveIntensity: 1.2, roughness: 0.25, metalness: 0.2 }));
  core.castShadow = true;
  group.add(core);
  const halo = new THREE.Mesh(new THREE.TorusGeometry(0.86, 0.025, 8, 80), new THREE.MeshStandardMaterial({ color: '#e8bd7a', emissive: '#a96835', emissiveIntensity: 0.42, metalness: 0.65, roughness: 0.32 }));
  halo.rotation.x = Math.PI / 2.4;
  group.add(halo);
  group.position.set(0, 1.56, 0);
  return group;
}
