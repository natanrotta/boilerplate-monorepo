// Public API of the `development` module — DEV-only tooling. `AppRouter` mounts
// it behind `import.meta.env.DEV`, and a Vite plugin fails the production build
// if any of this code reaches a chunk.
export { StyleguidePage } from "./presentation/pages/StyleguidePage";
