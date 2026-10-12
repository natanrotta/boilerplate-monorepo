/**
 * Where "Sign in" goes: the web app. Override per build with
 * `VITE_PLATFORM_URL`; a local `yarn dev` points at the app it just started.
 */
export const PLATFORM_URL: string =
  import.meta.env.VITE_PLATFORM_URL ??
  (import.meta.env.DEV ? "http://localhost:3000" : "https://app.example.com");

/** The repository the page invites you to clone. Override with `VITE_REPO_URL`. */
export const REPO_URL: string =
  import.meta.env.VITE_REPO_URL ?? "https://github.com/natanrotta/boilerplate-monorepo";

/** What the closing section offers to copy. */
export const CLONE_COMMAND = `git clone ${REPO_URL}.git`;

export const ROUTES = {
  home: "/",
  terms: "/termos",
  privacy: "/privacidade",
} as const;

/** The section the header and the hero scroll to. */
export const HOW_IT_WORKS_ID = "como-funciona";

/** What the starter is built with — the chips under the hero. Names, so they are not translated. */
export const STACK = ["React 19", "Chakra UI 3", "Node 22", "Express", "Prisma", "Vite", "Playwright"] as const;

/** One width for the header, every section and the footer. */
export const CONTENT_MAX_W = "1120px";
export const CONTENT_PX = { base: "20px", md: "28px" } as const;
