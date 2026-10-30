# Memorastle

**Turn memories into places. Make information easier to remember.**

Memorastle is an interactive 3D memory palace inspired by the Method of Loci. Explore the Grand Archive, discover its objects, and save ideas to revisit later.

## Current foundation

- Vite serves the native JavaScript application and builds it for production.
- Three.js renders a procedural hall with marble flooring, pillars, ribbed arches, cyan window light, lanterns, and a floating relic.
- Orbit and zoom with mouse, touch, or arrow keys; select the crystal, book, or lantern to attach a memory.
- Memories are saved per object in browser `localStorage`, with create, edit, and delete actions.
- Reused scene, camera, and renderer modules initialize the environment; world, interactions, memory storage, objects, and UI remain separate.
- The existing brand art and favicon remain in the root `assets/` directory and are served from `/assets/`.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Run locally

```sh
npm install
npm run dev
```

Vite prints a local URL after startup. Create a production bundle with `npm run build` and inspect it locally with `npm run preview`.

## Project structure

```text
assets/                 Existing brand image and favicon
src/
  core/                  Scene, camera, and renderer setup
  interactions/          Orbit controls and object picking
  memory/                Per-object localStorage persistence
  objects/               Crystal, book, lantern, and selection helpers
  styles/                Application styles
  ui/                    Intro, HUD, memory panel, and error handling
  world/                 Hall architecture, lighting, and atmosphere
  main.js                Application entry and animation loop
index.html               Page shell and accessible interface
```

## Deploy to Vercel

Vercel can use its Vite preset with `npm run build` and `dist` as the output directory. The application uses a single static entry page and needs no server rewrite or `vercel.json` file. Memories are stored only in the current browser; they are not synced between devices.

## Team

- **Creator:** mukti786
- **Collaborator:** Lakshya787

## License

To be decided.

---

*Memorastle — build a place for every memory.* 🏰
