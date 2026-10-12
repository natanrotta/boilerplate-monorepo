# Frontend — Accumulated Knowledge

> Living notes for the `/frontend` specialist. Starts mostly empty and fills **with use**:
> every non-obvious lesson (a TanStack Query cache gotcha, a Chakra/theme trap, a hook insight) gets one line here,
> per `.claude/learning/protocol.md`. Authority for patterns stays in `.claude/patterns/frontend.md`.

## Consolidated Principles
- (none yet)

## Component & Hook Patterns
- (none yet)

## Cache / Query Insights
- (none yet)

## Styling Gotchas
- The `border: "1px solid"` shorthand in a recipe/prop can land after `borderColor` in the stylesheet and reset the color to `currentColor` (outline buttons drew a black border). Use `borderWidth` + `borderStyle` + `borderColor`. (2026-10-12)
- `MotionConfig reducedMotion="user"` does not touch CSS keyframes (`animation="…"` props): give each one `_motionReduce={{ animation: "none" }}` — a blanket `*` rule also freezes spinners and skeleton pulses, which are the loading signal. (2026-10-12)
- Chakra's own `bg.muted` / `border.subtle` are defined with `_light`, which beats a `base` — a re-skinned token needs `_light` too or light mode keeps Chakra's gray. (2026-10-12)

## Testing Gotchas
- Running Prettier on a glob (`pages/*.tsx`) reformats untouched files (specs included) — pass explicit paths. A token value change (even one ink) invalidates every styleguide baseline: regenerate with `yarn test:e2e --update-snapshots`, then run once WITHOUT the flag to prove stability. (2026-10-12)

## Dead Ends
- (none yet)
