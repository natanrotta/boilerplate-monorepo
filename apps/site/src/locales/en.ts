import type { Dictionary } from "./pt";

export const en: Dictionary = {
  brand: "Boilerplate",

  header: {
    howItWorks: "How it works",
    signIn: "Sign in",
    toggleTheme: "Switch between light and dark theme",
    language: "Language",
  },

  hero: {
    eyebrow: "TypeScript monorepo starter",
    title: "Start your next product at the part that matters.",
    subtitle:
      "Auth, a design system, three languages, tests and deploy are already built and validated. Clone it, rename it, and build what is yours alone.",
    cta: "View on GitHub",
    secondary: "How it works",
    stackLabel: "Built with",
    mock: {
      label: "Illustration of the dashboard the starter opens after sign-in.",
      nav: ["Dashboard", "Settings"],
      greeting: "Hello, Demo",
      subtitle: "Welcome to your dashboard.",
      stats: [
        { label: "Total", value: "0" },
        { label: "Completed", value: "0" },
        { label: "Growth", value: "0%" },
      ],
      emptyTitle: "Nothing here yet",
      emptyBody: "Start using the app and your data shows up on this dashboard.",
    },
  },

  steps: {
    eyebrow: "How it works",
    title: "From a clone to your first screen, in three steps.",
    items: [
      {
        title: "Clone and install",
        body: "One repository with the API, the web app and this site. One yarn install, and Postgres and Redis come up in Docker.",
      },
      {
        title: "Run it and sign in",
        body: "Migrations, seed and yarn dev. On your machine, the quick login signs you in as the demo user with one click.",
      },
      {
        title: "Build your module",
        body: "Follow the reference module on the backend and the frontend, and assemble the screen from the styleguide's components.",
      },
    ],
  },

  included: {
    eyebrow: "What is already built",
    title: "The boring but critical part is done.",
    items: [
      {
        title: "Complete authentication",
        body: "Sign-up, sign-in, password reset, e-mail verification by PIN and Google. The session lives in an httpOnly cookie, with CSRF protection and rate limiting.",
      },
      {
        title: "A layered backend",
        body: "Modules organized into domain, application and infrastructure, with dependency injection and validated configuration. Queues, storage and e-mail are already wired.",
      },
      {
        title: "Its own design system",
        body: "Tokens, recipes and text styles in a single package, used by the app and by this site. Light and dark themes, and a styleguide with every component.",
      },
      {
        title: "Three languages",
        body: "Portuguese, English and Spanish, in the app and on this site.",
      },
      {
        title: "Tests that keep up",
        body: "Unit tests on the backend and the components, and end-to-end tests with visual regression of the design system.",
      },
      {
        title: "Build and deploy",
        body: "Turborepo pipelines, one Docker image and GitHub Actions for integration, build and deploy.",
      },
    ],
  },

  closing: {
    title: "Ready to start?",
    subtitle: "Clone the repository and have sign-in, a dashboard and settings running on your machine.",
    cta: "View on GitHub",
    copy: "Copy command",
    copied: "Command copied",
  },

  footer: {
    tagline: "TypeScript monorepo starter.",
    terms: "Terms of Use",
    privacy: "Privacy Policy",
    rights: "Boilerplate. MIT License.",
  },

  legal: {
    eyebrow: "Legal",
    backToHome: "Back to home",
    updatedAt: "Last updated:",
    updatedAtDate: "January 1, 2025",
    privacyTitle: "Privacy Policy",
    privacyIntro:
      "This is placeholder text. Replace it with your own privacy policy before publishing.",
    termsTitle: "Terms of Use",
    termsIntro:
      "This is placeholder text. Replace it with your own terms of use before publishing.",
  },
};
