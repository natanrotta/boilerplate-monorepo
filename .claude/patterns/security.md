# Security — App Security Model & Anti-Patterns (Authority)

**This document is the authoritative security reference for the Boilerplate.** It describes the security model of the starter application (auth, resource ownership, endpoints, integrations, deploy) and a `SEC-*` anti-pattern catalog. Generic OWASP checklists complement it but never replace it. As you build real features on top of the boilerplate, keep this file in sync with your actual surfaces.

It is consumed by:
- the **`/security`** skill (`.claude/commands/security.md`) — consultant + implementer,
- the **`security-auditor`** agent (`.claude/agents/security-auditor.md`) — read-only scanner,
- `/code-review` and any reviewer who needs the security lens.

It **defers** to: `BASELINE.md` (R1–R28), `code-review-checklist.md` (B-/F-/X-/SC- codes — many are already security codes), `/devops` + `.claude/knowledge/devops.md` (infra). It cross-references those codes instead of duplicating them.

> **Namespace:** security codes are **`SEC-*`**. The bare `S-*` prefix is reserved — never mint an `S-*` security code.
>
> **Anchors drift.** Any `file:line` below is a hint, not a fact. Re-grep the symbol by name before quoting it — files move, line numbers rot.

---

## 0. Data classification

Classify the data your feature touches and handle each tier accordingly:

| Tier | Examples | Rule |
|---|---|---|
| **Secret** | `JWT_SECRET`, DB/Redis creds, `RESEND_API_KEY`, `AWS_*`, `BUGSNAG_API_KEY`, `GITHUB_ACTIONS_TOKEN`, `GOOGLE_CLIENT_ID`, password-reset / e-mail-verification tokens (stored hashed) | Env-only (validated config), `chmod 600` on the server, never in logs/commits/images/front/responses. `R22`, `SEC-C4`. |
| **PII** | user name/email/phone, any personal data you add | Never logged (`R5`/`SEC-C7`), never in URLs/referrers (`F-C4`), never returned to a different owner (`SEC-C2`), redacted in pino. |
| **Operational** | ids, timestamps, counts, status | Normal handling; still owner-scoped where applicable. |

The default posture is **fail-closed**: cross-owner access returns `NotFoundError` (404), never `ForbiddenError` (403) — revealing existence is itself a leak (`R3`, `B-H16`).

---

## 1. Trust boundaries (the map you reason about per change)

```
Internet ── CDN / reverse proxy (TLS, WAF) ── Express API
                                                    │
   Browser (SPA)  ─cookies + CSRF→  Express middleware chain
                                                    │
   3rd parties (email provider, S3, any webhook)  ─signed/keyed→  providers
                                                    │
   API ── private network ── Postgres / Redis (never exposed to the internet)
```

Each boundary is a place to ask "what does the other side control, and what am I trusting?". The highest-risk inbound surfaces: **unauthenticated routes**, **webhooks**, and **file uploads**.

---

## 2. Identity & authentication

- **JWT** — `jsonwebtoken`, **HS256 pinned** on verify (alg-confusion defense) — `core/provider/jwt/`. Secret `env.JWT_SECRET` (min 32 chars, composed from `core/config/schema/auth.schema.ts`). Access TTL `JWT_EXPIRES_IN` (default `15m`), refresh `REFRESH_TOKEN_EXPIRES_IN` (default `30d`).
- **Token revocation** — a `tokenVersion` claim must match the user row; bump it on password reset / logout-all → invalidates all live JWTs. `auth.middleware.ts`.
- **Scoped tokens** — capability JWTs (`email:verify`) minted via `signScoped()`; gated by `requireScope()` / `rejectScopedTokens()`; `bearerFromQueryToken()` promotes a query token only where a browser can't set headers. `modules/auth/constant/jwt-scopes.ts`.
- **Passwords** — bcrypt — `core/provider/hash/`. Strength enforced in `modules/auth/application/dto/` (8+, upper/lower/digit/special). Google sign-in via `GOOGLE_CLIENT_ID`.
- **Middleware ladder** — `authMiddleware()` (full session token), `emailVerificationAuthMiddleware()` (scoped PIN routes), plus `requireScope()` / `rejectScopedTokens()`. All exported from `core/http/middlewares/index.ts`. **Every one of them is a factory — mount it CALLED** (`authMiddleware()`, not `authMiddleware`): passed uncalled, Express runs it as the handler, the request hangs and the guard is absent (`B-C14`, `core/http/routes/route-mount.spec.ts`).
- **Cookies** — `boilerplate_at` (httpOnly session), `boilerplate_rt` (httpOnly refresh, scoped path), `boilerplate_csrf` (JS-readable, path `/`). Prod: `secure` + `sameSite=strict`, optional `COOKIE_DOMAIN`. `core/http/helpers/auth-cookies.ts`.

## 3. Authorization & resource ownership

- **Ownership isolation** — every request-driven repository method takes the owner id and scopes the query; a miss returns `null` → `NotFoundError`. There is **no `ensureOwner()` helper** in the tree — the scoping lives in the repository signature, which is what makes it un-forgettable. **System-triggered** methods (`*Internal`, `listAll`) have no caller and must never be reachable from a user request; never launder their owner id into a scoped call (confused deputy). This is the #1 invariant (`R1`/`R3`). `account_id` multi-tenancy is the documented upgrade path — the same rules apply verbatim with `accountId` from `req.auth`.
- **RBAC** — there are no roles yet (single user per account). Add `requireRole(...)` in `core/http/middlewares/` the day a second role appears; admin ≠ authenticated.
- **Request context** — `req.auth` (userId, language, scope?). Use cases receive `userId` as an argument — never `req` (`R7`/`B-C9`).

## 4. HTTP hardening (`core/http/app.ts`)

- **helmet** — HSTS + preload, frameguard deny, referrer strict-origin; **CSP** (`defaultSrc 'self'`, `scriptSrc 'self'`, `objectSrc 'none'`, `frameAncestors 'none'`). `/admin/*` (BullBoard) uses a CSP-relaxed variant.
- **CORS** — origin allowlist from `ALLOWED_ORIGIN` (strips `*` in prod), `credentials: true`.
- **CSRF** — double-submit (`boilerplate_csrf` cookie ↔ `X-CSRF-Token` header); safe methods + Bearer-only routes skip. `csrf.middleware.ts` (`B-C12`).
- **Rate limiting (layered, Redis store)** — global `RATE_LIMIT_GLOBAL_MAX`/`_WINDOW_MS` per IP; auth `RATE_LIMIT_AUTH_MAX` per IP (`authRateLimit`); user `RATE_LIMIT_USER_MAX` per userId (`userRateLimit`, mounted at the aggregator for every authenticated surface below it); public `RATE_LIMIT_PUBLIC_MAX` per IP (`publicRateLimit`). The store lives in `core/http/middlewares/rate-limit-store.ts` and is torn down by the shutdown plan.
- **Body limits** — default `10kb` (`express.json`); raise per-route only where a payload legitimately needs it (uploads).
- **Validation** — Zod via `validateRequest` middleware on params/query/body (`B-C6`). `trust proxy: 1`.
- **Errors** — central handler; `{ ok:false, error:{ message, code, debug? } }`, stack only non-prod, query strings stripped from Bugsnag reports. `error-handler.middleware.ts`. The `ErrorCode` catalog is the wire contract in `@boilerplate/shared-types` — a new code ships with its 3 locales (`error-codes.spec.ts` gates parity).

## 5. Data layer, secrets, logging

- **Prisma** — no `$queryRaw`/`$executeRaw` template injection; any `$queryRawUnsafe` must use **positional `$1` placeholders + a separate params array** (parameterized, not injectable). Soft delete (`deleted_at: null`, `R2`). `mapPrismaError` on catches (`B-H3`). Cross-owner mutations fail-closed (zero rows).
- **Secrets** — a single validated config (`core/config/env.ts` composed from `core/config/schema/*.schema.ts`, Zod, fail-loud); **no scattered `process.env`**. `env-example.spec.ts` fails the build when `apps/api/.env.example` or `infra/.env.prod.example` drifts from the schema in either direction (`X-H4`). Any dev-default secret must be a real value in prod. There is **no at-rest encryption primitive** in the tree today — the first provider-issued secret that must be persisted brings one in, in `core/service/`, behind a `shared/provider` port.
- **Logging** — pino with a generated `redact` list (`core/http/logger.ts`): `SENSITIVE_HEADERS` (authorization, cookie, x-api-key, x-csrf-token) + `SENSITIVE_BODY_FIELDS` (password, token, refreshToken, credential, email, …) applied to **both** `req.*` and the `request.*` mirror. **Redaction is defense-in-depth, not a license to log PII** (`R5`/`SEC-C7`). A new sensitive field in a payload must be added to the list (`SEC-M2`).

## 6. Integrations

- **Webhooks (inbound)** — none ship today. The first one MUST mount before the JSON parser with `express.raw` (raw body intact) and verify the signature (`constructEvent(rawBody, sig, SECRET)` style) → 4xx on failure (`SEC-C3`).
- **Outbound fetch** — the app makes no server-side fetch to a user-supplied URL today. The day it does (an outbound webhook, an avatar import, a link preview), it is an **SSRF surface by construction**: `http(s)` only, resolve the host at **every** attempt right before the fetch (DNS rebinding), reject every private range (loopback, RFC 1918, link-local/cloud metadata, CGNAT, ULA, multicast, and every IPv4-embedding IPv6 form), `redirect: "manual"` with any 3xx a final rejection, and never echo the response body to logs (`SEC-C6`).
- **File upload / S3** — gate MIME + size per type (`shared/constant/image-upload.ts` + `ALLOWED_IMAGE_MIME_TYPES`/`MAX_IMAGE_UPLOAD_BYTES` in `@boilerplate/shared-types`), derive the stored extension and the S3 `ContentType` from the **allowlisted MIME**, never from `originalname`; owner-scoped key, signed URLs with a short TTL, compensating delete on failure (`safeS3Delete`). `upload.middleware.ts`, `core/provider/storage/`. Media lives in S3 and is **outside** the `pg_dump` backup scope.
  **Known residual risk (accepted):** the allowlist checks the *client-declared* multipart `Content-Type`, not the bytes. A client can upload arbitrary content labelled `image/png`; it is stored with that `ContentType` on the bucket's own domain, where helmet's headers do not apply. Blast radius is bounded — the uploader can only shadow their **own** avatar key, there is no cross-owner or auth impact — and modern browser sniffing rules close most of the execution path. Close it properly when uploads matter to your product: verify magic bytes server-side (e.g. `file-type` over the buffer) before trusting `file.mimetype`, and/or serve the bucket behind `X-Content-Type-Options: nosniff` + `Content-Disposition: attachment`.
- **Providers** — Resend (mail), S3 (storage), Redis (cache / rate-limit store / event bus), Bugsnag (errors — see `patterns/bugsnag.md` for the PII posture there), GitHub Actions token (read-only CI status). All env-keyed via the validated config, reached through a provider port — never a hardcoded client in a use case. LLMs, when they arrive, only via `ILlmProvider` (`R23`/`B-C13`).

## 7. Deploy security (defer to `/devops`; summary here)

Authoritative: `.claude/knowledge/devops.md` + `infra/`. Security-relevant invariants:
- **Golden rule** — the data host never exposes `5432`/`6379` to the internet; app↔DB only over the private network / WireGuard tunnel (`infra/wireguard/`).
- **Edge** — proxy in front of the origin (hides origin IP) + a valid TLS cert (`infra/app/Caddyfile`); the origin should accept 80/443 only from the proxy.
- **Secrets** — `infra/.env.prod` on the server (`chmod 600`, gitignored), not in the image (except the stamped `APP_VERSION`/`GIT_COMMIT` build args). `infra/deploy.env` (operator targets) is gitignored too — `infra/deploy.env.example` is the template.
- **Backup** — `infra/backup/`: encrypted offsite dumps + dead-man switch, private key off the data host; only "real" after a restore drill.
- **Rotate any secret that ever passed through a chat/log.**

---

## SEC-* Anti-Pattern Catalog

Same rubric as `code-review-checklist.md`: **Critical** blocks merge, **High** fix before merge, **Medium** recommended, **Low** nitpick. Cite the code; cross-refs in parentheses point at the existing checklist/baseline code that already governs the same thing — `SEC-*` is the security *lens* over them, not a replacement.

### Critical (block merge)

| # | Anti-pattern | Why |
|---|--------------|-----|
| SEC-C1 | **Broken authentication** — a route accepting input/returning data mounted without `authMiddleware()` (or the right scope variant), mounted with the factory **uncalled** (`B-C14`), or not in the documented public allowlist in `routes/index.ts` (`/health`, `/auth/*`) | Anyone can call it, or every request hangs (⊃ `B-C11`, `B-C14`) |
| SEC-C2 | **Broken object-level auth / IDOR** — entity fetched by id through an unscoped read (`*Internal`/`listAll`) from a user request, or a scoped method missing the owner column in `where`; or `ForbiddenError` used (reveals existence) | Cross-owner data leak (`R1`/`R3`, ⊃ `B-C1`/`B-C3`/`B-H16`) |
| SEC-C3 | **Unverified webhook / inbound** — webhook handler without signature verification, or JSON body parser placed before the raw-body route (breaks signature verification) | Forged events; follow the raw-body + verify pattern |
| SEC-C4 | **Secret exposed** — credential committed, hardcoded, read outside the validated config, baked into an image, or sent to the front | Immediate revocation needed (`R22`, ⊃ `X-C4`) |
| SEC-C5 | **Injection into an interpreter/sink** — untrusted input (user text, an uploaded file's contents, a third-party response) reaching a shell, an eval, a template, or an LLM prompt with tool-calling, without sanitization/fencing | Command/prompt hijack → data exfil / unauthorized actions (`R23`) |
| SEC-C6 | **Injection / SSRF** — raw SQL with string interpolation, shell exec with user input, a server fetch to a user-controlled URL without the guard described in §6 (scheme + private ranges + IPv4-embedding IPv6 forms + per-attempt resolution + `redirect: "manual"`), or unsafe deserialization | Classic RCE/injection (⊃ `B-C7`) |
| SEC-C7 | **PII / secret leak** — personal data or a secret logged, reported to Bugsnag, returned in an error to the client, placed in a URL/query/referrer, or emitted to a different owner | Privacy incident (`R5`, ⊃ `B-C5`/`F-C4`, `BS-C2`) |

### High (should fix)

| # | Anti-pattern | Fix |
|---|--------------|-----|
| SEC-H1 | Route accepts input without `validateRequest(...)` (Zod) | Add the schema + middleware (`B-C6`) |
| SEC-H2 | Sensitive/unauthenticated endpoint (auth, password reset, e-mail verification, public share, file upload) without rate limiting | Add the right limiter (`authRateLimit` / `userRateLimit` / `publicRateLimit`) |
| SEC-H3 | Privileged action (a system-triggered repository method, `listAll`, an admin UI) reachable from a user request, or — once roles exist — without a role gate | Keep system paths unreachable; add `requireRole` when roles land |
| SEC-H4 | State-changing cookie-auth route bypassing CSRF | Keep it under the CSRF middleware (`B-C12`) |
| SEC-H5 | Weak token/crypto — JWT alg not pinned, no expiry, predictable/guessable token, missing `tokenVersion` revocation, password not bcrypt, MD5/SHA1 for secrets | Mirror the JWT/bcrypt providers |
| SEC-H6 | File upload trusting client MIME/filename (extension or `ContentType` derived from `originalname`), or missing size/type gate, or unsanitized path | Gate via `upload.middleware.ts` + `shared/constant/image-upload.ts`; derive extension + `ContentType` from the allowlisted MIME; owner-scoped key. Note that an allowlist on the declared header is **not** content verification — see the residual risk in §6 before treating a new upload surface as safe |
| SEC-H7 | Permissive CORS (`*` with credentials) or weakened/removed security header / CSP `unsafe-eval` | Keep the allowlist + helmet/CSP posture |
| SEC-H8 | New secret added without env validation + rotation path, a dev-default secret left in prod, or a provider-issued secret persisted in clear | Register it in the right `core/config/schema/*.schema.ts` **and** in both `.env.example` templates (`env-example.spec.ts` gates it); require a real value in prod (`X-H4`); encrypt at rest (bring the primitive in `core/service/` behind a port — none exists today) |

### Medium (recommended)

| # | Anti-pattern | Fix |
|---|--------------|-----|
| SEC-M1 | Error response leaks internals (stack, SQL, file path, dependency version) to the client in prod | Map to an `AppError`+`ErrorCode`; debug only non-prod |
| SEC-M2 | New sensitive/personal field in a request/response payload not added to the pino `redact` list | Add the path to `logger.ts` |
| SEC-M3 | No refresh-token rotation / session-fixation defense on long-lived sessions | Rotate on refresh where feasible; document trade-off |
| SEC-M4 | Sensitive action (password reset, e-mail change, account deletion, admin/impersonation) without an audit trail | Log the actor + action (no PII) for forensics |
| SEC-M5 | Dependency with a known CVE / no `yarn npm audit` consideration on a new dep | Pin/upgrade; note in the spec Decisions log |
| SEC-M6 | Token promoted from query (`?access_token=`) for SSE/download without proxy stripping it from access logs | Document the proxy requirement; prefer header |

### Low / Nitpick

| # | Issue |
|---|-------|
| SEC-L1 | Verbose version/server header disclosure |
| SEC-L2 | Overly long token/session TTL with no justification |
| SEC-L3 | Missing `aria`/UX affordance that nudges users toward insecure behavior (e.g. paste-secret-in-plaintext field) |

When you spot something real that no `SEC-*` code covers, report it as **`Issue (proposed)`** so it can be promoted into this catalog.

---

## Analysis techniques (how the specialist reasons)

1. **Threat-model the change, not the whole app.** For the diff, ask STRIDE-lite per touched boundary: *Spoofing* (auth ok? the factory actually called?), *Tampering* (validation/signature?), *Repudiation* (audit trail?), *Information disclosure* (owner scope + PII in logs/errors/Bugsnag?), *DoS* (rate limit + pagination + body cap?), *Elevation* (system path reachable? IDOR? role gate?).
2. **Follow the data.** Trace untrusted input from the boundary to where it's trusted (DB query, outbound fetch, shell, S3 key, response, prompt). Every hop is a SEC checkpoint. The uploaded file's declared MIME and any future user-supplied URL are the two hops people forget.
3. **Per change-type checklist** — *new route* → SEC-C1/H1/H2/H3 + C2 (+ `B-C14`); *new webhook/integration/outbound fetch* → SEC-C3/C4/C6; *touches auth/JWT/tokens/crypto* → SEC-H5; *new env/secret* → SEC-C4/H8; *logging/new field* → SEC-C7/M2; *file upload* → SEC-H6; *LLM/prompt* → SEC-C5; *infra/deploy* → defer to `/devops` golden rules (§7).
4. **Prefer existing primitives.** The repo ships the secure way (owner-scoped repository signatures, `validateRequest`, the limiters, the JWT/bcrypt providers, the redact list, the upload MIME gate). A security fix is usually "use the existing primitive", not "invent crypto".
