import * as THREE from 'three';

export function createDragLook(container, camera) {
  const pointer = { down: false, x: 0, y: 0, yaw: 0.67, pitch: 0 };
  const onPointerDown = (event) => {
    pointer.down = true;
    pointer.x = event.clientX;
    pointer.y = event.clientY;
    container.setPointerCapture?.(event.pointerId);
  };
  const onPointerMove = (event) => {
    if (!pointer.down) return;
    pointer.yaw += (event.clientX - pointer.x) * 0.002;
    pointer.pitch = THREE.MathUtils.clamp(pointer.pitch + (event.clientY - pointer.y) * 0.0012, -0.2, 0.2);
    pointer.x = event.clientX;
    pointer.y = event.clientY;
  };
  const onPointerUp = () => { pointer.down = false; };

  container.addEventListener('pointerdown', onPointerDown);
  container.addEventListener('pointermove', onPointerMove);
  container.addEventListener('pointerup', onPointerUp);
  container.addEventListener('pointercancel', onPointerUp);

  return {
    update(elapsed) {
      const angle = elapsed * 0.025 + pointer.yaw;
      camera.position.set(Math.sin(angle) * 13, 5.1 - pointer.pitch * 5, Math.cos(angle) * 13);
      camera.lookAt(0, 1.65, 0);
    },
    dispose() {
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);
    },
  };
}
