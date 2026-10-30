import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { createScene } from './core/scene.js';
import { createDragLook } from './interactions/dragLook.js';
import { createMemoryGarden } from './world/memoryGarden.js';
import { showAppError } from './ui/errors.js';
import './styles/main.css';

const root = document.querySelector('#scene-root');
const exploreButton = document.querySelector('#explore-button');

function startExperience() {
  if (!root) throw new Error('The 3D scene container was not found.');

  const scene = createScene();
  const camera = createCamera(root.clientWidth / root.clientHeight);
  const renderer = createRenderer(root);
  const garden = createMemoryGarden(scene);
  const dragLook = createDragLook(root, camera);
  const clock = new THREE.Clock();
  let frameId = 0;

  const resize = () => {
    const width = root.clientWidth;
    const height = root.clientHeight;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  };
  window.addEventListener('resize', resize);

  exploreButton?.addEventListener('click', () => {
    document.querySelector('.welcome-card')?.classList.add('welcome-card--hidden');
  });

  const animate = () => {
    frameId = window.requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    garden.memory.position.y = 1.56 + Math.sin(elapsed * 1.1) * 0.13;
    garden.memory.rotation.y = elapsed * 0.3;
    garden.glow.intensity = 21 + Math.sin(elapsed * 1.8) * 3;
    dragLook.update(elapsed);
    renderer.render(scene, camera);
  };

  animate();
  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    dragLook.dispose();
    renderer.dispose();
  };
}

try {
  startExperience();
} catch (error) {
  console.error('Memorastle could not start:', error);
  showAppError('This browser could not start the 3D garden. Try a modern browser with WebGL enabled.');
}
