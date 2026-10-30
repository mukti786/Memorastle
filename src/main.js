import * as THREE from 'three';
import { createCamera } from './core/camera.js';
import { createRenderer } from './core/renderer.js';
import { createScene } from './core/scene.js';
import { createObjectPicker } from './interactions/objectPicker.js';
import { createPalaceControls } from './interactions/palaceControls.js';
import { createMemoryGarden } from './world/memoryGarden.js';
import { getMemoryCount, readMemories } from './memory/memoryStore.js';
import { showAppError } from './ui/errors.js';
import { createMemoryPanel } from './ui/memoryPanel.js';
import { createPalaceInterface } from './ui/palaceInterface.js';
import './styles/main.css';

const root = document.querySelector('#scene-root');
const loadingState = document.querySelector('#loading-state');

function startExperience() {
  if (!root) throw new Error('The 3D scene container was not found.');

  const scene = createScene();
  const camera = createCamera(root.clientWidth / root.clientHeight);
  const renderer = createRenderer(root);
  const garden = createMemoryGarden(scene);
  const palaceControls = createPalaceControls(camera, renderer.domElement);
  const palaceInterface = createPalaceInterface({ controls: palaceControls });
  const memoryPanel = createMemoryPanel({
    onMemoryCountChange: (count) => palaceInterface.setCount(count),
    onToast: (message) => palaceInterface.showToast(message),
  });
  const objectPicker = createObjectPicker(renderer.domElement, camera, garden.objects, {
    onSelect: (object) => {
      palaceInterface.closeHelp();
      if (object) memoryPanel.open(object);
      else memoryPanel.close();
    },
  });
  const clock = new THREE.Clock();
  let frameId = 0;
  let firstFrame = true;
  palaceInterface.setCount(getMemoryCount(readMemories()));

  const resize = () => {
    const width = root.clientWidth;
    const height = root.clientHeight;
    if (!width || !height) return;
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
    palaceControls.update();
    renderer.render(scene, camera);
    if (firstFrame) {
      firstFrame = false;
      loadingState?.classList.add('loading-state--ready');
    }
  };

  const cleanup = () => {
    window.cancelAnimationFrame(frameId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('pagehide', cleanup);
    objectPicker.dispose();
    memoryPanel.dispose();
    palaceInterface.dispose();
    palaceControls.dispose();
    garden.dispose();
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (Array.isArray(object.material)) object.material.forEach((material) => materials.add(material));
      else if (object.material) materials.add(object.material);
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.domElement.remove();
    renderer.dispose();
  };
  animate();
  return cleanup;
}

let experienceCleanup = null;
const mountExperience = () => {
  try {
    experienceCleanup = startExperience();
  } catch (error) {
    console.error('Memorastle could not start:', error);
    showAppError('This browser could not start the memory palace. Try a modern browser with WebGL enabled.');
  }
};
window.addEventListener('pagehide', () => {
  experienceCleanup?.();
  experienceCleanup = null;
});
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !experienceCleanup) mountExperience();
});
mountExperience();
