import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { createScene } from './core/scene.js';
import { createDragLook } from './interactions/dragLook.js';
import { createMemoryGarden } from './world/memoryGarden.js';
import { showAppError } from './ui/errors.js';
import './styles/main.css';

const root = document.querySelector('#scene-root');
const loadingState = document.querySelector('#loading-state');

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

  const animate = () => {
    frameId = window.requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();
    garden.update(elapsed);
    dragLook.update(elapsed);
    renderer.render(scene, camera);
    loadingState?.classList.add('loading-state--ready');
  };

  animate();
  return () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    dragLook.dispose();
    garden.dispose();
    renderer.dispose();
  };
}

try {
  startExperience();
} catch (error) {
  console.error('Memorastle could not start:', error);
  showAppError('This browser could not start the 3D garden. Try a modern browser with WebGL enabled.');
}
