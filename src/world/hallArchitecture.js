import * as THREE from 'three';

const stone = new THREE.MeshStandardMaterial({ color: '#777e91', roughness: 0.68, metalness: 0.08 });
const paleStone = new THREE.MeshStandardMaterial({ color: '#b7b4b0', roughness: 0.62, metalness: 0.08 });
const shadowStone = new THREE.MeshStandardMaterial({ color: '#343a4c', roughness: 0.82 });
const bronze = new THREE.MeshStandardMaterial({ color: '#b58b56', roughness: 0.34, metalness: 0.72 });
const inlayMaterial = new THREE.MeshStandardMaterial({ color: '#c79b64', roughness: 0.3, metalness: 0.72, emissive: '#4e2c1d', emissiveIntensity: 0.22 });
const glassMaterial = new THREE.MeshStandardMaterial({ color: '#6fb7ce', roughness: 0.23, metalness: 0.25, emissive: '#24789d', emissiveIntensity: 0.72 });

function addBox(parent, size, position, material, castShadow = true) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
  mesh.position.set(...position);
  mesh.castShadow = castShadow;
  mesh.receiveShadow = true;
  parent.add(mesh);
  return mesh;
}

function createFloor(scene) {
  const columns = 14;
  const rows = 18;
  const tiles = new THREE.InstancedMesh(new THREE.BoxGeometry(1.96, 0.2, 1.96), new THREE.MeshStandardMaterial({ color: '#b0b5c2', roughness: 0.49, metalness: 0.12, vertexColors: true }), columns * rows);
  const transform = new THREE.Object3D();
  const palette = ['#c6c7c9', '#aeb5c2', '#b9b4ae', '#9ea8b8'].map((color) => new THREE.Color(color));
  let index = 0;

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      transform.position.set((column - (columns - 1) / 2) * 2, -0.1, 12 - row * 2);
      transform.updateMatrix();
      tiles.setMatrixAt(index, transform.matrix);
      tiles.setColorAt(index, palette[(column * 3 + row) % palette.length]);
      index += 1;
    }
  }
  tiles.castShadow = false;
  tiles.receiveShadow = true;
  scene.add(tiles);

  // Paired brass inlays draw the eye toward the apse and break up the broad floor plane.
  for (const x of [-2.45, 2.45]) addBox(scene, [0.045, 0.025, 33], [x, 0.012, -5], inlayMaterial, false);
  const compass = new THREE.Mesh(new THREE.RingGeometry(2.5, 2.56, 96), inlayMaterial);
  compass.rotation.x = -Math.PI / 2;
  compass.position.set(0, 0.015, -3.5);
  scene.add(compass);
}

function createPillar(scene, x, z, height = 8.1) {
  const group = new THREE.Group();
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.68, height, 12, 1), stone);
  shaft.position.y = height / 2;
  shaft.castShadow = true;
  shaft.receiveShadow = true;
  group.add(shaft);
  addBox(group, [1.52, 0.35, 1.52], [0, 0.2, 0], paleStone);
  addBox(group, [1.27, 0.22, 1.27], [0, 0.5, 0], bronze, false);
  addBox(group, [1.28, 0.32, 1.28], [0, height - 0.02, 0], bronze, false);
  addBox(group, [1.68, 0.44, 1.68], [0, height + 0.35, 0], paleStone);
  group.position.set(x, 0, z);
  scene.add(group);
}

function createVaults(scene) {
  const ribGeometry = new THREE.TorusGeometry(7.55, 0.25, 10, 72, Math.PI);
  const trimGeometry = new THREE.TorusGeometry(7.22, 0.055, 8, 72, Math.PI);
  for (const z of [7, 0, -7, -14, -21]) {
    const rib = new THREE.Mesh(ribGeometry, paleStone);
    rib.position.set(0, 8.55, z);
    rib.castShadow = true;
    rib.receiveShadow = true;
    scene.add(rib);
    const trim = new THREE.Mesh(trimGeometry, bronze);
    trim.position.set(0, 8.6, z);
    trim.castShadow = false;
    scene.add(trim);
  }
}

function createSideWalls(scene) {
  for (const side of [-1, 1]) {
    addBox(scene, [0.7, 14, 37], [-side * 10.4, 6.6, -4], shadowStone);
    for (const z of [10, 2, -6, -14, -21]) {
      addBox(scene, [0.09, 7, 2.35], [-side * 10.02, 6.6, z], glassMaterial, false);
      addBox(scene, [0.18, 0.11, 2.75], [-side * 9.94, 3.05, z], bronze, false);
      addBox(scene, [0.18, 0.11, 2.75], [-side * 9.94, 10.15, z], bronze, false);
      addBox(scene, [0.18, 7.2, 0.11], [-side * 9.94, 6.6, z - 1.23], bronze, false);
      addBox(scene, [0.18, 7.2, 0.11], [-side * 9.94, 6.6, z + 1.23], bronze, false);
    }
  }
}

function createApse(scene) {
  addBox(scene, [20.2, 15.2, 0.8], [0, 7.15, -23.5], shadowStone);
  addBox(scene, [13.5, 0.28, 1.15], [0, 0.04, -16.8], paleStone);
  addBox(scene, [10.8, 0.28, 0.92], [0, 0.32, -16.8], bronze, false);
  addBox(scene, [8.2, 0.28, 0.72], [0, 0.6, -16.8], paleStone);

  const outerArch = new THREE.Mesh(new THREE.TorusGeometry(4.45, 0.34, 12, 72, Math.PI), bronze);
  outerArch.position.set(0, 4.8, -20.9);
  outerArch.castShadow = true;
  scene.add(outerArch);
  const innerArch = new THREE.Mesh(new THREE.TorusGeometry(4.02, 0.09, 8, 72, Math.PI), paleStone);
  innerArch.position.set(0, 4.8, -20.82);
  scene.add(innerArch);
}

export function createHallArchitecture(scene) {
  createFloor(scene);
  createSideWalls(scene);
  for (const x of [-7.55, 7.55]) {
    for (const z of [9, 2, -5, -12, -19]) createPillar(scene, x, z);
  }
  createVaults(scene);
  createApse(scene);
}

export { addBox };
