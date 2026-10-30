import { createMemoryRelic } from '../objects/memoryRelic.js';
import { createHallArchitecture } from './hallArchitecture.js';
import { createDustMotes } from './hallAtmosphere.js';
import { createHallLighting } from './hallLighting.js';

export function createMemoryGarden(scene) {
  createHallArchitecture(scene);
  const lighting = createHallLighting(scene);
  const memory = createMemoryRelic();
  const motes = createDustMotes(scene);
  scene.add(memory);

  return {
    update(elapsed) {
      memory.position.y = 5.6 + Math.sin(elapsed * 0.72) * 0.16;
      memory.rotation.y = elapsed * 0.17;
      lighting.update(elapsed);
      motes.update(elapsed);
    },
    dispose() {
      motes.dispose();
    },
  };
}
