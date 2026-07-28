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
