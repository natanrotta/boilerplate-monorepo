import type { ErrorCode } from "@boilerplate/shared-types";

/**
 * Domain-shaped error class for the frontend. Wraps any backend or network
 * failure with the typed `code` the API put on the wire, so pages and hooks can
 * branch on it instead of on a message.
 *
 * `code` is typed as `ErrorCode | string` because a transport failure (offline,
 * a proxy 502, a gateway timeout) produces an error that never reached the API
 * catalog. Unknown codes still flow through — they just don't auto-complete in
 * `===` checks and fall back to the generic error toast.
 */
export class AppError extends Error {
  public readonly code: ErrorCode | string;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(
    message: string,
    code: ErrorCode | string = "UNKNOWN_ERROR",
    statusCode = 500,
    details?: unknown
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}
