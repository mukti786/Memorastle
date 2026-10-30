import * as THREE from 'three';
import { addPedestal, registerMemoryObject } from './memoryObjectBase.js';

export function createMemoryLantern() {
  const root = new THREE.Group();
  const top = addPedestal(root, { radius: 0.88, height: 0.78 });
  const lantern = new THREE.Group();
  lantern.position.y = top + 0.15;

  const frameMaterial = new THREE.MeshStandardMaterial({ color: '#b18a56', roughness: 0.3, metalness: 0.78 });
  const glassMaterial = new THREE.MeshPhysicalMaterial({ color: '#82d4e7', emissive: '#2782a0', emissiveIntensity: 1.8, roughness: 0.18, metalness: 0.12, clearcoat: 1, clearcoatRoughness: 0.1 });

  const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.4, 1), glassMaterial);
  core.castShadow = true;
  lantern.add(core);
  const cage = new THREE.Mesh(new THREE.OctahedronGeometry(0.63, 0), new THREE.MeshStandardMaterial({ color: '#c49a60', metalness: 0.8, roughness: 0.3, wireframe: true }));
  cage.scale.y = 1.24;
  lantern.add(cage);

  for (const y of [-0.69, 0.69]) {
    const cap = new THREE.Mesh(new THREE.ConeGeometry(0.5, 0.2, 8), frameMaterial);
    cap.position.y = y;
    if (y < 0) cap.rotation.z = Math.PI;
    lantern.add(cap);
  }
  const finial = new THREE.Mesh(new THREE.SphereGeometry(0.09, 12, 8), frameMaterial);
  finial.position.y = 0.84;
  lantern.add(finial);
  root.add(lantern);

  const light = new THREE.PointLight('#92dff1', 18, 9, 1.8);
  light.position.y = top + 0.15;
  root.add(light);

  const registered = registerMemoryObject(root, { id: 'lumen-lantern', name: 'The Lumen Lantern', ringRadius: 1.23, ringHeight: 0.055 });
  return {
    ...registered,
    update(elapsed) {
      registered.update(elapsed);
      lantern.rotation.y = Math.sin(elapsed * 0.42) * 0.11;
      core.rotation.y = elapsed * 0.24;
      light.intensity = 17 + Math.sin(elapsed * 1.5) * 1.1;
    },
  };
}
