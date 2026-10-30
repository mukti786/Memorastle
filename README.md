# Memorastle

**Turn memories into places. Make information easier to remember.**

Memorastle is an interactive 3D memory palace inspired by the Method of Loci. Explore the first environment, the Grand Archive: a vaulted marble hall centered around a floating memory relic.

## Current foundation

- Vite serves the native JavaScript application and builds it for production.
- Three.js renders a procedural, atmospheric hall with marble flooring, pillars, ribbed arches, cyan window light, lanterns, and a floating relic.
- Drag the scene to look around; the hall has a restrained ambient camera drift and animated lantern light.
- Reused scene, camera, and renderer modules initialize the environment; world, lighting, atmosphere, objects, and pointer interaction remain separate.
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
  interactions/          Pointer drag-look controls
  objects/               Reusable 3D memory relic
  styles/                Application styles
  ui/                    User-facing error handling
  world/                 Hall architecture, lighting, and atmosphere
  main.js                Application entry and animation loop
index.html               Page shell and accessible interface
```

## Roadmap

- [ ] Add room-to-room navigation and palace spaces
- [ ] Create, edit, and place memory notes in the environment
- [ ] Implement recall and review flows
- [ ] Add persistence and customizable environments
- [ ] Deploy a live demo

## Team

- **Creator:** mukti786
- **Collaborator:** Lakshya787

## License

To be decided.

---

*Memorastle — build a place for every memory.* 🏰
