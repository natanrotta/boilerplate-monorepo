# Violations Ledger — Pattern-Adoption Telemetry

**Append-only.** Every Critical/High finding surfaced during the babysit loop, `/check`, or `/code-review` is logged here as one line. Format and rules: `.claude/learning/protocol.md` § Pattern-Adoption Telemetry.

The ledger feeds the **recurring-violations surfacing** pass: codes that appear ≥5 times in 30 days are candidates for promotion into a hook, into BASELINE, or into a module-specific knowledge entry.

**Never edit historical entries.** Mark promoted ones with `[PROMOTED YYYY-MM-DD]` only.

---

## Entries

| Date | Code | Fixed-by | Context |
| ---- | ---- | -------- | ------- |
| 2026-07-28 | F-M17 | code-reviewer | AppTabs v3 (value-based) sem defaultValue quando syncWithUrl=false — machine inicia em null, nenhuma aba selecionada; fixado (defaultValue sempre) |
| 2026-07-28 | F-M18 | code-reviewer | boxShadow="card-hover" (kebab) não mapeia pro CSS var; token correto é shadow.cardHover — popover Country/Phone sem sombra; fixado |
| 2026-09-17 | not-in-checklist (propose) | code-reviewer | graceful-shutdown.ts:105-107 — a second SIGTERM/fatal signal that arrives while a non-fatal shutdown is already in-flight is swallowed: the fatal's error report never reaches errorReporter and exit code stays 0 instead of 1 |
| 2026-09-17 | SC-H3 | code-reviewer | shared/dto/common.dto.ts UuidParamSchema has zero production consumers after /api/users deletion (only its own spec) — speculative abstraction |
| 2026-09-17 | SEC-H6 (nuance) | security-auditor | upload allowlist checks the DECLARED multipart Content-Type, not the bytes; code + security.md said "VALIDATED", overstating the guarantee — wording corrected to "ALLOWLISTED" and the residual risk documented in security.md §6 (accepted: bounded to the uploader's own key) |
| 2026-09-17 | B-C14 (guard gap) | security-auditor | route-mount.spec.ts kept a HAND-MAINTAINED factory list — a newly added auth factory would be silently unguarded, the exact bug class the spec exists to catch; FACTORIES is now derived from auth.middleware.ts's exports |
| 2026-09-17 | B-C14 (guard gap) | code-reviewer | route-mount.spec.ts per-line name grep is blind to `import { authMiddleware as auth }` + `router.use(auth)`; added an alias-refusing test (probed RED/GREEN) |
| 2026-09-17 | doc-drift | orchestrator | .claude docs cited 4 data-cy ids that did not match the code, a non-existent e2e fixture, 2 deleted /api/users use-case paths and an unqualified script path — every backtick-quoted repo path in .claude/** is now machine-verified to resolve |
