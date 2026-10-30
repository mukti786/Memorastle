const STORAGE_KEY = 'memorastle.memories.v1';
const MAX_TITLE_LENGTH = 80;
const MAX_DESCRIPTION_LENGTH = 1600;
const MEMORY_ID_PATTERN = /^[a-z0-9-]{2,64}$/;

function normalizeMemory(value) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  if (typeof value.title !== 'string' || typeof value.description !== 'string') return null;

  const title = value.title.trim().slice(0, MAX_TITLE_LENGTH);
  const description = value.description.trim().slice(0, MAX_DESCRIPTION_LENGTH);
  return title && description ? { title, description, updatedAt: Number.isFinite(value.updatedAt) ? value.updatedAt : Date.now() } : null;
}

export function readMemories() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return {};

    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return {};

    return Object.fromEntries(
      Object.entries(parsed)
        .filter(([id]) => MEMORY_ID_PATTERN.test(id))
        .map(([id, value]) => [id, normalizeMemory(value)])
        .filter(([, memory]) => memory !== null),
    );
  } catch {
    // Storage can be disabled or contain malformed JSON; the palace still opens with an empty shelf.
    return {};
  }
}

export function saveMemory(id, value) {
  if (typeof id !== 'string' || !MEMORY_ID_PATTERN.test(id)) throw new Error('This memory object could not be identified.');
  const memory = normalizeMemory(value);
  if (!memory) throw new Error('Add a title and a description before saving.');

  const memories = readMemories();
  const next = { ...memories, [id]: memory };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function deleteMemory(id) {
  if (typeof id !== 'string' || !MEMORY_ID_PATTERN.test(id)) throw new Error('This memory object could not be identified.');
  const memories = readMemories();
  delete memories[id];
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  return memories;
}

export function getMemoryCount(memories = readMemories()) {
  return Object.keys(memories).length;
}

export const MEMORY_LIMITS = Object.freeze({ title: MAX_TITLE_LENGTH, description: MAX_DESCRIPTION_LENGTH });
