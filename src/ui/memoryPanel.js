import { deleteMemory, getMemoryCount, MEMORY_LIMITS, readMemories, saveMemory } from '../memory/memoryStore.js';

export function createMemoryPanel({ onMemoryCountChange, onToast } = {}) {
  const panel = document.querySelector('#memory-panel');
  const objectName = document.querySelector('#memory-object-name');
  const objectGlyph = document.querySelector('#memory-object-glyph');
  const emptyState = document.querySelector('#memory-empty');
  const savedState = document.querySelector('#memory-saved');
  const savedTitle = document.querySelector('#saved-memory-title');
  const savedDescription = document.querySelector('#saved-memory-description');
  const form = document.querySelector('#memory-form');
  const titleInput = document.querySelector('#memory-title');
  const descriptionInput = document.querySelector('#memory-description');
  const titleCount = document.querySelector('#title-count');
  const descriptionCount = document.querySelector('#description-count');
  const message = document.querySelector('#panel-message');
  const addButton = document.querySelector('#add-memory');
  const editButton = document.querySelector('#edit-memory');
  const deleteButton = document.querySelector('#delete-memory');
  const confirmDelete = document.querySelector('#confirm-delete');
  const keepMemory = document.querySelector('#keep-memory');
  const cancelEdit = document.querySelector('#cancel-edit');
  const closeButton = document.querySelector('#close-memory-panel');
  let currentObject = null;
  let isEditing = false;
  let deletePending = false;
  let closeTimer = 0;

  if (!panel || !form || !titleInput || !descriptionInput) return { open() {}, close() {}, dispose() {} };

  titleInput.maxLength = MEMORY_LIMITS.title;
  descriptionInput.maxLength = MEMORY_LIMITS.description;

  const setMessage = (text = '', isError = false) => {
    message.textContent = text;
    message.classList.toggle('is-error', isError);
  };
  const currentMemories = () => readMemories();

  const render = () => {
    if (!currentObject) return;
    const memory = currentMemories()[currentObject.id];
    emptyState.hidden = Boolean(memory) || isEditing;
    savedState.hidden = !memory || isEditing;
    form.hidden = !isEditing;
    addButton.hidden = Boolean(memory) || isEditing;
    editButton.hidden = !memory || isEditing;
    deleteButton.hidden = !memory || isEditing || deletePending;
    confirmDelete.hidden = !memory || isEditing || !deletePending;
    keepMemory.hidden = !memory || isEditing || !deletePending;
    if (memory) {
      savedTitle.textContent = memory.title;
      savedDescription.textContent = memory.description;
    }
    titleCount.textContent = `${titleInput.value.length}/${MEMORY_LIMITS.title}`;
    descriptionCount.textContent = `${descriptionInput.value.length}/${MEMORY_LIMITS.description}`;
  };

  const open = (object) => {
    if (!object) return close();
    window.clearTimeout(closeTimer);
    currentObject = object;
    isEditing = false;
    deletePending = false;
    setMessage();
    objectName.textContent = object.name;
    objectGlyph.textContent = object.id === 'archive-crystal' ? '✦' : object.id === 'memory-book' ? '⌑' : '✧';
    render();
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
    requestAnimationFrame(() => panel.classList.add('is-open'));
    closeButton?.focus({ preventScroll: true });
  };

  const close = () => {
    if (panel.hidden) return;
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    closeTimer = window.setTimeout(() => { panel.hidden = true; }, 280);
    currentObject = null;
    isEditing = false;
    deletePending = false;
    requestAnimationFrame(() => document.querySelector('#scene-root canvas')?.focus({ preventScroll: true }));
  };

  const beginEdit = (memory = null) => {
    if (!currentObject) return;
    isEditing = true;
    deletePending = false;
    titleInput.value = memory?.title ?? '';
    descriptionInput.value = memory?.description ?? '';
    setMessage();
    render();
    requestAnimationFrame(() => titleInput.focus({ preventScroll: true }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!currentObject) return;
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    if (!title || !description) {
      setMessage('Give this memory both a title and a description.', true);
      (!title ? titleInput : descriptionInput).focus();
      return;
    }
    try {
      const memories = saveMemory(currentObject.id, { title, description });
      isEditing = false;
      deletePending = false;
      render();
      onMemoryCountChange?.(getMemoryCount(memories));
      onToast?.('Memory placed in the palace.');
      requestAnimationFrame(() => editButton.focus({ preventScroll: true }));
    } catch {
      setMessage('Your memory could not be saved in this browser. Check storage availability and try again.', true);
    }
  };

  const onDelete = () => {
    if (!currentObject) return;
    if (!deletePending) {
      deletePending = true;
      render();
      requestAnimationFrame(() => confirmDelete.focus({ preventScroll: true }));
      return;
    }
    try {
      const memories = deleteMemory(currentObject.id);
      deletePending = false;
      render();
      onMemoryCountChange?.(getMemoryCount(memories));
      onToast?.('Memory removed from the palace.');
      requestAnimationFrame(() => addButton.focus({ preventScroll: true }));
    } catch {
      setMessage('This memory could not be removed from this browser.', true);
    }
  };

  const onKeyDown = (event) => { if (event.key === 'Escape' && !panel.hidden) close(); };
  const updateTitleCount = () => { titleCount.textContent = `${titleInput.value.length}/${MEMORY_LIMITS.title}`; };
  const updateDescriptionCount = () => { descriptionCount.textContent = `${descriptionInput.value.length}/${MEMORY_LIMITS.description}`; };
  const onAdd = () => beginEdit();
  const onEdit = () => beginEdit(currentMemories()[currentObject?.id]);
  const onKeepMemory = () => { deletePending = false; render(); deleteButton.focus({ preventScroll: true }); };
  const onCancelEdit = () => { isEditing = false; setMessage(); render(); (currentMemories()[currentObject?.id] ? editButton : addButton).focus({ preventScroll: true }); };

  form.addEventListener('submit', onSubmit);
  titleInput.addEventListener('input', updateTitleCount);
  descriptionInput.addEventListener('input', updateDescriptionCount);
  addButton.addEventListener('click', onAdd);
  editButton.addEventListener('click', onEdit);
  deleteButton.addEventListener('click', onDelete);
  confirmDelete.addEventListener('click', onDelete);
  keepMemory.addEventListener('click', onKeepMemory);
  cancelEdit.addEventListener('click', onCancelEdit);
  closeButton.addEventListener('click', close);
  window.addEventListener('keydown', onKeyDown);

  return {
    open,
    close,
    getMemoryCount() { return getMemoryCount(currentMemories()); },
    dispose() {
      window.clearTimeout(closeTimer);
      panel.hidden = true;
      panel.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      window.removeEventListener('keydown', onKeyDown);
      form.removeEventListener('submit', onSubmit);
      titleInput.removeEventListener('input', updateTitleCount);
      descriptionInput.removeEventListener('input', updateDescriptionCount);
      addButton.removeEventListener('click', onAdd);
      editButton.removeEventListener('click', onEdit);
      deleteButton.removeEventListener('click', onDelete);
      confirmDelete.removeEventListener('click', onDelete);
      keepMemory.removeEventListener('click', onKeepMemory);
      cancelEdit.removeEventListener('click', onCancelEdit);
      closeButton.removeEventListener('click', close);
    },
  };
}
