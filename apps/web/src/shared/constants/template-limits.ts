/**
 * Account-scoped caps for default-template flags. Mirrors the backend's
 * `apps/api/src/shared/constants/template-limits.ts`. The server is the
 * source of truth — these values exist on the FE only to disable toggles
 * proactively when the user is at the limit.
 */
export const MAX_DEFAULT_TEMPLATES_PER_PATIENT = 5;
export const MAX_DEFAULT_TEMPLATES_PER_CONSULTATION = 3;

/**
 * Max custom fields a single template can hold. FE-only guard for now —
 * unlike the constants above, this has no backend mirror yet, so it only
 * disables the "add field" action proactively in the UI; the cap is not
 * enforced server-side.
 */
export const MAX_FIELDS_PER_TEMPLATE = 20;
