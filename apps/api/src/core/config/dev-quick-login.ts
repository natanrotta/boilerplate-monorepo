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

/**
 * What to tell a developer whose local API has the quick login OFF. The flag
 * lives in a gitignored `.env`, so a checkout that predates it gets no button
 * on the sign-in page and no clue why — `null` anywhere the hint does not
 * apply (the feature is on, or this is not a local machine).
 */
export function devQuickLoginHint(config: {
  NODE_ENV: string;
  DEV_QUICK_LOGIN_ENABLED: boolean;
}): string | null {
  if (config.NODE_ENV !== "local" || config.DEV_QUICK_LOGIN_ENABLED)
    return null;
  return "[DEV] Quick login is off: set DEV_QUICK_LOGIN_ENABLED=true in apps/api/.env and restart to get the one-click sign-in on the login page";
}
