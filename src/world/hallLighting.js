import * as THREE from 'three';
import { addBox } from './hallArchitecture.js';

const lanternFrameMaterial = new THREE.MeshStandardMaterial({ color: '#936f43', roughness: 0.34, metalness: 0.78 });
const lanternCageMaterial = new THREE.MeshStandardMaterial({ color: '#936f43', roughness: 0.34, metalness: 0.78, wireframe: true });
const lanternGlassMaterial = new THREE.MeshStandardMaterial({ color: '#f3c17e', roughness: 0.18, emissive: '#ed9c54', emissiveIntensity: 2.6 });

function createLantern(scene, x, z, intensity) {
  const lantern = new THREE.Group();
  const glass = new THREE.Mesh(new THREE.OctahedronGeometry(0.26, 1), lanternGlassMaterial);
  glass.position.y = 0.96;
  lantern.add(glass);
  const cage = new THREE.Mesh(new THREE.OctahedronGeometry(0.37, 0), lanternCageMaterial);
  cage.position.y = 0.96;
  cage.scale.y = 1.28;
  lantern.add(cage);
  addBox(lantern, [0.11, 0.34, 0.11], [0, 1.39, 0], lanternFrameMaterial, false);

  const light = new THREE.PointLight('#ffc77f', intensity, 10, 1.7);
  light.position.y = 1.03;
  lantern.add(light);
  lantern.position.set(x, 6.25, z);
  scene.add(lantern);
  return { lantern, light };
}

export function createHallLighting(scene) {
  scene.add(new THREE.HemisphereLight('#d8e6f4', '#24273a', 1.22));
  const keyLight = new THREE.DirectionalLight('#ffdfb2', 2.65);
  keyLight.position.set(-8, 16, 9);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.set(1024, 1024);
  keyLight.shadow.camera.left = -22;
  keyLight.shadow.camera.right = 22;
  keyLight.shadow.camera.top = 24;
  keyLight.shadow.camera.bottom = -24;
  keyLight.shadow.camera.near = 1;
  keyLight.shadow.camera.far = 48;
  keyLight.shadow.bias = -0.00025;
  scene.add(keyLight);

  const apseLight = new THREE.PointLight('#81d2ef', 34, 18, 1.8);
  apseLight.position.set(0, 5.2, -17.7);
  scene.add(apseLight);
  const lanterns = [];
  for (const z of [6.5, -1.5, -9.5, -17]) {
    for (const side of [-1, 1]) lanterns.push(createLantern(scene, side * 7.55, z, 11));
  }

  return {
    update(elapsed) {
      for (let index = 0; index < lanterns.length; index += 1) {
        lanterns[index].light.intensity = 10.5 + Math.sin(elapsed * 1.6 + index * 0.9) * 0.55;
        lanterns[index].lantern.rotation.y = Math.sin(elapsed * 0.35 + index) * 0.04;
      }
      apseLight.intensity = 32 + Math.sin(elapsed * 0.7) * 2;
    },
  };
}
