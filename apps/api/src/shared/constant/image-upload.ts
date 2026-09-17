import {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  type AllowedImageMimeType,
} from "@boilerplate/shared-types";

/**
 * The image MIME allowlist for user uploads (declared once in
 * `@boilerplate/shared-types`, which the web also checks before sending), and
 * the file extension each one maps to. Shared by the upload middleware (which
 * rejects everything else at the edge) and the use cases that build the S3
 * object key — so the extension stored is derived from the ALLOWLISTED type,
 * never from the client-supplied filename (SEC-H6).
 *
 * The allowlist checks the DECLARED multipart `Content-Type`, not the bytes:
 * arbitrary content labelled `image/png` still passes. That residual risk is
 * bounded (a user can only shadow their own key) and documented in
 * `.claude/patterns/security.md` § 6 — verify magic bytes there before adding
 * an upload surface where it matters.
 */
export {
  ALLOWED_IMAGE_MIME_TYPES,
  MAX_IMAGE_UPLOAD_BYTES,
  type AllowedImageMimeType,
};

export const IMAGE_MIME_EXTENSION: Record<AllowedImageMimeType, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

export function isAllowedImageMimeType(
  value: string,
): value is AllowedImageMimeType {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}
