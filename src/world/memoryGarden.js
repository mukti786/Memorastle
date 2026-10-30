import * as THREE from 'three';
import { createMemoryRelic } from '../objects/memoryRelic.js';

const stone = new THREE.MeshStandardMaterial({ color: '#657389', roughness: 0.82 });
const paleStone = new THREE.MeshStandardMaterial({ color: '#c5bda8', roughness: 0.76 });
const brass = new THREE.MeshStandardMaterial({ color: '#c49b62', metalness: 0.58, roughness: 0.34 });

function addBox(parent, size, position, material, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

export function createMemoryGarden(scene) {
  scene.add(new THREE.HemisphereLight('#c5d4e6', '#343443', 1.7));

  const moonlight = new THREE.DirectionalLight('#ffe1b3', 3.2);
  moonlight.position.set(-5, 9, 4);
  moonlight.castShadow = true;
  moonlight.shadow.mapSize.set(1024, 1024);
  scene.add(moonlight);

  const glow = new THREE.PointLight('#efa969', 24, 13, 2);
  glow.position.set(0, 2.8, 0);
  scene.add(glow);

  const ground = new THREE.Mesh(new THREE.CircleGeometry(22, 64), new THREE.MeshStandardMaterial({ color: '#273444', roughness: 0.96 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.16;
  ground.receiveShadow = true;
  scene.add(ground);

  const dais = new THREE.Group();
  addBox(dais, [5.5, 0.36, 5.5], [0, 0.05, 0], stone);
  addBox(dais, [4.7, 0.14, 4.7], [0, 0.3, 0], paleStone);
  addBox(dais, [3.65, 0.12, 3.65], [0, 0.43, 0], stone);
  scene.add(dais);

  for (const [x, z, height] of [[-3.4, -2.8, 4.1], [3.4, -2.8, 4.1], [-3.4, 2.8, 3.5], [3.4, 2.8, 3.5]]) {
    addBox(scene, [0.58, height, 0.58], [x, height / 2, z], stone);
    addBox(scene, [0.82, 0.18, 0.82], [x, height + 0.08, z], brass, false);
    addBox(scene, [0.78, 0.2, 0.78], [x, -0.02, z], brass, false);
  }

  const arch = new THREE.Group();
  addBox(arch, [0.48, 4.2, 0.55], [-2.4, 2.55, -3.2], paleStone);
  addBox(arch, [0.48, 4.2, 0.55], [2.4, 2.55, -3.2], paleStone);
  addBox(arch, [5.25, 0.5, 0.65], [0, 4.9, -3.2], paleStone);
  addBox(arch, [5.7, 0.16, 0.88], [0, 5.22, -3.2], brass, false);
  scene.add(arch);

  const memory = createMemoryRelic();
  scene.add(memory);

  for (let i = 0; i < 18; i += 1) {
    const angle = (i / 18) * Math.PI * 2;
    const radius = 4.2 + (i % 3) * 0.38;
    const mote = new THREE.Mesh(new THREE.SphereGeometry(0.025 + (i % 3) * 0.009, 8, 8), new THREE.MeshBasicMaterial({ color: i % 2 ? '#f2c98f' : '#a9c7d8', transparent: true, opacity: 0.72 }));
    mote.position.set(Math.cos(angle) * radius, 0.65 + (i % 4) * 0.24, Math.sin(angle) * radius);
    scene.add(mote);
  }

  return { memory, glow };
}
