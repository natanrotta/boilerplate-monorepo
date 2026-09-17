import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

/**
 * B-C14 guard. The auth/scope middlewares are FACTORIES — `authMiddleware()`
 * returns the handler. Mounting the factory itself (`router.use(authMiddleware)`)
 * makes Express call it as the handler: it returns a function, never calls
 * `next()`, every request on that router hangs, and the guard is never applied.
 * Nothing at type level catches it (a factory IS a function), so this spec
 * walks every route file and refuses a factory name that is not immediately
 * called.
 */
const SRC = path.resolve(__dirname, "../../..");

const FACTORY_SOURCES = ["core/http/middlewares/auth.middleware.ts"];

/**
 * DERIVED, not hand-maintained. A hand-written list silently leaves a NEW
 * factory unguarded — exactly the failure mode this spec exists to prevent —
 * so every exported function in the guarded sources is covered automatically.
 * A future non-factory export in one of these files would be guarded too; a
 * false positive here is a one-line fix, a false negative is a hung endpoint.
 */
const FACTORIES: readonly string[] = FACTORY_SOURCES.flatMap((relative) => {
  const source = readFileSync(path.join(SRC, relative), "utf8");
  return [...source.matchAll(/^export function (\w+)\(/gm)].map((m) => m[1]!);
});

function walk(dir: string, out: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const full = path.join(dir, entry);
    if (entry === "generated" || entry === "node_modules") continue;
    if (statSync(full).isDirectory()) walk(full, out);
    else out.push(full);
  }
  return out;
}

const isRouteFile = (file: string): boolean =>
  /\/infrastructure\/route\/[^/]+\.routes\.ts$/.test(file) ||
  file.endsWith("/core/http/routes/index.ts") ||
  file.endsWith("/core/http/app.ts");

// Imports and comments are not mounts — a comment that merely mentions a
// factory name must not trip the guard.
const stripImports = (source: string): string =>
  source
    .replace(/^import[\s\S]*?from\s+["'][^"']+["'];?/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\/\/[^\n]*/g, "");

describe("route mounting (B-C14)", () => {
  const routeFiles = walk(SRC).filter(isRouteFile);

  it("finds the route files it guards", () => {
    expect(routeFiles.length).toBeGreaterThanOrEqual(3);
  });

  it("derives a non-empty factory list from the guarded sources", () => {
    // A regex that stops matching (a refactor to `export const x = () => …`)
    // would leave every `it.each` below with nothing to check and the suite
    // would still go green. Fail loudly instead.
    expect(FACTORIES.length).toBeGreaterThanOrEqual(5);
    expect(FACTORIES).toContain("authMiddleware");
  });

  it("never aliases a guarded factory on import (the name check greps for the real name)", () => {
    // `import { authMiddleware as auth }` then `router.use(auth)` would slip
    // past the per-line name check below, because the literal factory name
    // never appears outside the stripped import line.
    const offenders: string[] = [];
    for (const file of routeFiles) {
      const source = readFileSync(file, "utf8");
      for (const match of source.matchAll(/(\w+)\s+as\s+(\w+)/g)) {
        if (FACTORIES.includes(match[1]!)) {
          offenders.push(`${path.relative(SRC, file)}: ${match[0]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });

  it("never mounts a /users surface again (the unscoped CRUD was deleted, not fixed)", () => {
    const aggregator = readFileSync(
      path.join(SRC, "core/http/routes/index.ts"),
      "utf8",
    );
    expect(aggregator).not.toMatch(/["']\/users["']/);
    expect(routeFiles.some((file) => /\/user\.routes\.ts$/.test(file))).toBe(
      false,
    );
  });

  it.each(FACTORIES)("never mounts %s without calling it", (factory) => {
    const pattern = new RegExp(`\\b${factory}\\b(?!\\s*\\()`, "g");
    const offenders: string[] = [];
    for (const file of routeFiles) {
      const body = stripImports(readFileSync(file, "utf8"));
      const lines = body.split("\n");
      lines.forEach((line, index) => {
        if (pattern.test(line)) {
          offenders.push(
            `${path.relative(SRC, file)}:${index + 1}: ${line.trim()}`,
          );
        }
        pattern.lastIndex = 0;
      });
    }
    expect(offenders).toEqual([]);
  });
});
