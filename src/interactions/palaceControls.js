import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

export function createPalaceControls(camera, element) {
  const controls = new OrbitControls(camera, element);
  controls.target.set(0, 4.15, -5.2);
  controls.enableDamping = true;
  controls.dampingFactor = 0.075;
  controls.enablePan = false;
  controls.enableZoom = true;
  controls.zoomSpeed = 0.72;
  controls.rotateSpeed = 0.52;
  controls.minDistance = 17;
  controls.maxDistance = 27;
  controls.minPolarAngle = 1.17;
  controls.maxPolarAngle = 1.47;
  controls.minAzimuthAngle = -0.36;
  controls.maxAzimuthAngle = 0.36;
  controls.update();
  controls.saveState();

  const onKeyDown = (event) => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    const tag = event.target?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;

    const step = event.shiftKey ? 0.12 : 0.06;
    if (event.key === 'ArrowLeft') controls.rotateLeft(step);
    else if (event.key === 'ArrowRight') controls.rotateLeft(-step);
    else if (event.key === 'ArrowUp') controls.rotateUp(step);
    else if (event.key === 'ArrowDown') controls.rotateUp(-step);
    else if (event.key.toLowerCase() === 'r') controls.reset();
    else return;

    event.preventDefault();
    controls.update();
  };
  window.addEventListener('keydown', onKeyDown);

  return {
    controls,
    reset() { controls.reset(); },
    update() { controls.update(); },
    dispose() {
      window.removeEventListener('keydown', onKeyDown);
      controls.dispose();
    },
  };
}
