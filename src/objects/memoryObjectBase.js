import * as THREE from 'three';

const gold = new THREE.MeshStandardMaterial({ color: '#d7b479', roughness: 0.28, metalness: 0.78 });
const highlightMaterial = new THREE.MeshBasicMaterial({ color: '#f0ca88', transparent: true, opacity: 0.78, depthWrite: false, side: THREE.DoubleSide });

export function registerMemoryObject(root, { id, name, ringRadius, ringHeight = 0.055 }) {
  root.userData.memoryObjectId = id;
  root.userData.memoryObjectName = name;

  const ring = new THREE.Mesh(new THREE.TorusGeometry(ringRadius, 0.026, 8, 72), highlightMaterial.clone());
  ring.rotation.x = Math.PI / 2;
  ring.position.y = ringHeight;
  ring.visible = false;
  root.add(ring);

  let hovered = false;
  let selected = false;
  let highlightStrength = 0;

  return {
    id,
    name,
    root,
    setHovered(value) { hovered = value; },
    setSelected(value) { selected = value; },
    update(elapsed) {
      const active = hovered || selected;
      highlightStrength = THREE.MathUtils.damp(highlightStrength, active ? 1 : 0, 7, 1 / 60);
      ring.visible = highlightStrength > 0.02;
      ring.material.opacity = highlightStrength * (selected ? 0.92 : 0.64);
      const pulse = 1 + Math.sin(elapsed * 1.8) * 0.018 * highlightStrength;
      ring.scale.setScalar(pulse);
      root.scale.setScalar(1 + highlightStrength * 0.025);
    },
    dispose() { ring.geometry.dispose(); ring.material.dispose(); },
  };
}

export function addPedestal(parent, { radius = 1.05, height = 1.15 } = {}) {
  const foot = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.92, radius, 0.18, 12), gold);
  foot.position.y = 0.09;
  foot.castShadow = true;
  foot.receiveShadow = true;
  parent.add(foot);

  const stone = new THREE.Mesh(new THREE.CylinderGeometry(radius * 0.76, radius * 0.82, height, 12), new THREE.MeshStandardMaterial({ color: '#6c7182', roughness: 0.62, metalness: 0.12 }));
  stone.position.y = height / 2 + 0.18;
  stone.castShadow = true;
  stone.receiveShadow = true;
  parent.add(stone);

  const capital = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius * 0.76, 0.18, 12), gold);
  capital.position.y = height + 0.27;
  capital.castShadow = true;
  parent.add(capital);
  return height + 0.36;
}
