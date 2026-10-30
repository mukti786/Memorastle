# Memorastle

**Turn memories into places. Make information easier to remember.**

Memorastle is an interactive 3D memory palace inspired by the Method of Loci. This repository is the foundation for a spatial learning experience where people can explore rooms, place ideas in memorable locations, and practice recall.

## Current foundation

- Vite serves the native JavaScript application and builds it for production.
- Three.js renders a procedural, atmospheric atrium with an animated memory relic.
- Drag the scene to look around; use the entry button to clear the welcome panel.
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
  world/                 Procedural garden environment
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
