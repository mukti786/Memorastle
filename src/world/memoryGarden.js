import { createMemoryObjects } from '../objects/memoryObjects.js';
import { createHallArchitecture } from './hallArchitecture.js';
import { createDustMotes } from './hallAtmosphere.js';
import { createHallLighting } from './hallLighting.js';

export function createMemoryGarden(scene) {
  createHallArchitecture(scene);
  const lighting = createHallLighting(scene);
  const motes = createDustMotes(scene);
  const memoryObjects = createMemoryObjects(scene);

  return {
    objects: memoryObjects.objects,
    update(elapsed) {
      memoryObjects.update(elapsed);
      lighting.update(elapsed);
      motes.update(elapsed);
    },
    dispose() {
      motes.dispose();
      memoryObjects.dispose();
    },
  };
}
