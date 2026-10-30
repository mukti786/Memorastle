import { createMemoryBook } from './memoryBook.js';
import { createMemoryLantern } from './memoryLantern.js';
import { registerMemoryObject } from './memoryObjectBase.js';
import { createMemoryRelic } from './memoryRelic.js';

export function createMemoryObjects(scene) {
  const crystalRoot = createMemoryRelic();
  const crystal = registerMemoryObject(crystalRoot, {
    id: 'archive-crystal',
    name: 'The Archive Crystal',
    ringRadius: 2.15,
    ringHeight: 0.055 - crystalRoot.position.y,
  });
  crystalRoot.position.set(0, 5.6, -17.4);

  const book = createMemoryBook();
  book.root.position.set(-4.1, 0, 1.2);
  const lantern = createMemoryLantern();
  lantern.root.position.set(4.1, 0, -3.5);

  const objects = [crystal, book, lantern];
  for (const object of objects) scene.add(object.root);

  return {
    objects,
    update(elapsed) {
      crystal.root.position.y = 5.6 + Math.sin(elapsed * 0.72) * 0.16;
      crystal.root.rotation.y = elapsed * 0.17;
      for (const object of objects) object.update(elapsed);
    },
    dispose() {
      for (const object of objects) object.dispose?.();
    },
  };
}
