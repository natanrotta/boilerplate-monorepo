# Fullstack — Accumulated Knowledge

> Living notes for the `/fullstack` specialist — integration wisdom across the BE↔FE boundary.
> Starts mostly empty and fills **with use** (contract drift traps, type-mirroring lessons),
> per `.claude/learning/protocol.md`.

## Consolidated Principles
- [High] A dev-only endpoint that mints a session needs a NETWORK boundary, not just an env gate: check the socket peer (`req.socket.remoteAddress`, never `req.ip`) for loopback AND the `Host` header (DNS rebinding). The env double gate only answers "is this a deploy?", not "who is calling?". (2026-10-12)

## Contract / Integration Patterns
- When a panel's visibility hinges on an error mapping (`AppError` 404 → hidden), spec the HOOK with the repository mocked — component specs that mock the hook leave the mapping untested. (2026-10-12)

## Dead Ends
- (none yet)
