/**
 * The one condition under which the passwordless dev quick-login exists
 * (`/api/dev/*` routes + their CSRF exemption): a local machine that opted in.
 * NODE_ENV alone is not enough — it DEFAULTS to "local", which is fail-unsafe.
 */
export function isDevQuickLoginEnabled(config: {
  NODE_ENV: string;
  DEV_QUICK_LOGIN_ENABLED: boolean;
}): boolean {
  return config.NODE_ENV === "local" && config.DEV_QUICK_LOGIN_ENABLED;
}
