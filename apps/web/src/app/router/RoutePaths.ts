export const ROUTE_PATHS = {
  signIn: "/sign-in",
  register: "/register",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  verifyEmail: "/verify-email",

  dashboard: "/dashboard",
  settings: "/settings",
  profile: "/profile",

  notFound: "/404",

  /** DEV-only design-system gallery — never mounted in a production build. */
  styleguide: "/dev/styleguide",
} as const;
