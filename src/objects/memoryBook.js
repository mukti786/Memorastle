import * as THREE from 'three';
import { addPedestal, registerMemoryObject } from './memoryObjectBase.js';

export function createMemoryBook() {
  const root = new THREE.Group();
  const top = addPedestal(root, { radius: 0.92, height: 1.08 });
  const book = new THREE.Group();
  book.position.set(0, top + 0.1, 0);

  const coverMaterial = new THREE.MeshStandardMaterial({ color: '#4e3548', roughness: 0.48, metalness: 0.24 });
  const pageMaterial = new THREE.MeshStandardMaterial({ color: '#e5d7b6', roughness: 0.88 });
  const goldMaterial = new THREE.MeshStandardMaterial({ color: '#e1bd7e', roughness: 0.26, metalness: 0.72, emissive: '#634225', emissiveIntensity: 0.2 });

  const pages = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.19, 0.84), pageMaterial);
  pages.position.y = 0.13;
  pages.castShadow = true;
  pages.receiveShadow = true;
  book.add(pages);

  const lowerCover = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.11, 0.94), coverMaterial);
  lowerCover.position.y = 0.015;
  lowerCover.castShadow = true;
  book.add(lowerCover);
  const upperCover = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.11, 0.94), coverMaterial);
  upperCover.position.set(0, 0.265, 0);
  upperCover.rotation.x = -0.055;
  upperCover.castShadow = true;
  book.add(upperCover);

  const spine = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.95), goldMaterial);
  spine.position.set(-0.55, 0.14, 0);
  book.add(spine);

  const seal = new THREE.Mesh(new THREE.OctahedronGeometry(0.16, 0), new THREE.MeshStandardMaterial({ color: '#9bd7e8', emissive: '#287b99', emissiveIntensity: 1, roughness: 0.24, metalness: 0.24 }));
  seal.position.set(0.12, 0.34, -0.02);
  book.add(seal);
  root.add(book);

  const registered = registerMemoryObject(root, { id: 'memory-book', name: 'The Remembering Book', ringRadius: 1.35, ringHeight: 0.055 });
  return {
    ...registered,
    update(elapsed) {
      registered.update(elapsed);
      book.rotation.z = Math.sin(elapsed * 0.55) * 0.018;
      seal.rotation.y = elapsed * 0.35;
    },
  };
}
