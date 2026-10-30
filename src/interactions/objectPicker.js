import * as THREE from 'three';

export function createObjectPicker(canvas, camera, objects, { onSelect, onHover } = {}) {
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let hovered = null;
  let selected = null;
  let start = null;

  const getObjectAt = (event) => {
    const bounds = canvas.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
    pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    const intersections = raycaster.intersectObjects(objects.map((entry) => entry.root), true);
    for (const hit of intersections) {
      let current = hit.object;
      while (current && !current.userData.memoryObjectId) current = current.parent;
      if (current) return objects.find((entry) => entry.id === current.userData.memoryObjectId) ?? null;
    }
    return null;
  };

  const setHovered = (entry) => {
    if (hovered === entry) return;
    hovered?.setHovered(false);
    hovered = entry;
    hovered?.setHovered(true);
    canvas.style.cursor = hovered ? 'pointer' : 'grab';
    onHover?.(hovered ?? null);
  };
  const selectObject = (entry) => {
    if (selected !== entry) {
      selected?.setSelected(false);
      selected = entry;
      selected?.setSelected(true);
    }
    onSelect?.(selected ?? null);
  };

  const onPointerDown = (event) => {
    if (event.button !== 0 || event.isPrimary === false) return;
    start = { x: event.clientX, y: event.clientY, pointerId: event.pointerId };
  };
  const onPointerMove = (event) => {
    if (start && Math.hypot(event.clientX - start.x, event.clientY - start.y) > 7) {
      setHovered(null);
      return;
    }
    setHovered(getObjectAt(event));
  };
  const onPointerUp = (event) => {
    if (!start || event.pointerId !== start.pointerId) return;
    const moved = start ? Math.hypot(event.clientX - start.x, event.clientY - start.y) : Infinity;
    start = null;
    if (moved > 7) return;
    selectObject(getObjectAt(event));
  };
  const onPointerLeave = () => {
    if (!start) setHovered(null);
  };
  const onPointerCancel = () => { start = null; setHovered(null); };
  const onKeyDown = (event) => {
    if (event.target !== canvas || !['1', '2', '3'].includes(event.key)) return;
    event.preventDefault();
    selectObject(objects[Number(event.key) - 1] ?? null);
  };

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerCancel);
  canvas.addEventListener('pointerleave', onPointerLeave);
  window.addEventListener('keydown', onKeyDown);

  return {
    clearSelection() {
      selected?.setSelected(false);
      selected = null;
      onSelect?.(null);
    },
    dispose() {
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerCancel);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('keydown', onKeyDown);
      hovered?.setHovered(false);
      selected?.setSelected(false);
    },
  };
}
