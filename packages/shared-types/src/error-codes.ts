/**
 * Every error code the API can put on the wire (`error.code` in the response
 * envelope). One entry per code the API actually throws or responds with —
 * a code nothing emits is a lie the client may branch on, so the catalog is
 * pruned, not grown "just in case".
 *
 * The API's `error-codes.spec.ts` pins the locale parity, so adding a code
 * means adding its message to `apps/api/src/shared/i18n/locales/{pt-BR,en,es}/
 * errors.json` (in the same order). The web client branches on these values,
 * never on `message`.
 */
export const ErrorCodes = {
  // Fallback — used when an unknown/uncategorized error bubbles up.
  // Keeps the client response shape stable and gives the error reporter a
  // consistent grouping key.
  GENERIC_ERROR: "GENERIC_ERROR",

  // ── User ──────────────────────────────────────────────────────────────
  USER_NOT_FOUND: "USER_NOT_FOUND",

  // ── Auth ──────────────────────────────────────────────────────────────
  /** Deliberately generic: wrong password, unknown e-mail and a non-ACTIVE
   *  account all answer with this one code (no account enumeration). */
  AUTH_INVALID_CREDENTIALS: "AUTH_INVALID_CREDENTIALS",
  AUTH_TOKEN_EXPIRED: "AUTH_TOKEN_EXPIRED",
  AUTH_TOKEN_INVALID: "AUTH_TOKEN_INVALID",
  AUTH_TOKEN_REVOKED: "AUTH_TOKEN_REVOKED",
  AUTH_NO_TOKEN: "AUTH_NO_TOKEN",
  AUTH_EMAIL_ALREADY_EXISTS: "AUTH_EMAIL_ALREADY_EXISTS",
  AUTH_GOOGLE_ONLY: "AUTH_GOOGLE_ONLY",
  AUTH_GOOGLE_TOKEN_INVALID: "AUTH_GOOGLE_TOKEN_INVALID",
  AUTH_PASSWORD_RESET_TOKEN_INVALID: "AUTH_PASSWORD_RESET_TOKEN_INVALID",
  AUTH_PASSWORD_RESET_TOKEN_EXPIRED: "AUTH_PASSWORD_RESET_TOKEN_EXPIRED",
  AUTH_PASSWORD_RESET_TOKEN_USED: "AUTH_PASSWORD_RESET_TOKEN_USED",
  /** Wrong e-mail-confirmation PIN. Intentionally vague to avoid leaking how
   *  many digits matched. */
  AUTH_EMAIL_VERIFICATION_PIN_INVALID: "AUTH_EMAIL_VERIFICATION_PIN_INVALID",
  /** PIN expired, never issued, or already consumed — the user must request
   *  a new code. */
  AUTH_EMAIL_VERIFICATION_PIN_EXPIRED: "AUTH_EMAIL_VERIFICATION_PIN_EXPIRED",
  /** Too many wrong attempts (lockout) or a resend requested inside the
   *  cooldown window. */
  AUTH_EMAIL_VERIFICATION_RATE_LIMITED: "AUTH_EMAIL_VERIFICATION_RATE_LIMITED",
  /** The e-mail was already confirmed — the FE should move on. */
  AUTH_EMAIL_ALREADY_VERIFIED: "AUTH_EMAIL_ALREADY_VERIFIED",

  // ── Account ───────────────────────────────────────────────────────────
  /** 402 — the account exists but may not use the API (billing/suspension).
   *  The default code of `PaymentRequiredError`. */
  ACCOUNT_BLOCKED: "ACCOUNT_BLOCKED",

  // ── Files / uploads ───────────────────────────────────────────────────
  FILE_REQUIRED: "FILE_REQUIRED",
  /** MIME outside `ALLOWED_IMAGE_MIME_TYPES` (see `shared/uploads.ts`). */
  FILE_INVALID_TYPE: "FILE_INVALID_TYPE",
  FILE_UPLOAD_FAILED: "FILE_UPLOAD_FAILED",
  FILE_DOWNLOAD_FAILED: "FILE_DOWNLOAD_FAILED",

  // ── Infrastructure ────────────────────────────────────────────────────
  QUEUE_NOT_FOUND: "QUEUE_NOT_FOUND",
  MAIL_SEND_FAILED: "MAIL_SEND_FAILED",

  // ── Rate limiting ─────────────────────────────────────────────────────
  /** The auth surface (sign-in, sign-up, password reset) — tighter than the
   *  global limiter and keyed by IP. */
  AUTH_RATE_LIMIT: "AUTH_RATE_LIMIT",
  /** Anonymous public surface — coarse IP-keyed HTTP shield. The use-case
   *  layer still owns the per-resource brute-force guard. */
  PUBLIC_RATE_LIMIT: "PUBLIC_RATE_LIMIT",

  // ── Transport-level (HTTP status defaults) ────────────────────────────
  // Used by AppError subclasses and by middleware that responds outside of a
  // thrown AppError (rate-limit, 404 fallback).
  BAD_REQUEST: "BAD_REQUEST",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  TOO_MANY_REQUESTS: "TOO_MANY_REQUESTS",
  RATE_LIMIT: "RATE_LIMIT",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];
