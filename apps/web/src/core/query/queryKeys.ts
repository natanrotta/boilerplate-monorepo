export const queryKeys = {
  settings: {
    all: ["settings"] as const,
  },
  auth: {
    all: ["auth"] as const,
    me: () => [...queryKeys.auth.all, "me"] as const,
  },
  health: {
    all: ["health"] as const,
    version: () => [...queryKeys.health.all, "version"] as const,
  },
} as const;
