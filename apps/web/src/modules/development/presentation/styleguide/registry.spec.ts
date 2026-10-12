import { readdirSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { STYLEGUIDE_CATEGORIES, STYLEGUIDE_SECTIONS, filterSections } from "./registry";

describe("STYLEGUIDE_SECTIONS", () => {
  it("gives every section a unique id, a description and at least one usage example", () => {
    const ids = STYLEGUIDE_SECTIONS.map((section) => section.id);
    expect(new Set(ids).size).toBe(ids.length);

    for (const section of STYLEGUIDE_SECTIONS) {
      expect(section.description.length, section.id).toBeGreaterThan(20);
      expect(section.usage.length, section.id).toBeGreaterThan(0);
      for (const usage of section.usage) {
        expect(usage.code.trim(), `${section.id}/${usage.name}`).not.toBe("");
      }
    }
  });

  it("lists the sections grouped by category, in the categories' order", () => {
    const order = STYLEGUIDE_CATEGORIES.map((category) => category.id as string);
    const seen = STYLEGUIDE_SECTIONS.map((section) => order.indexOf(section.category));

    expect(seen).not.toContain(-1);
    expect(seen).toEqual([...seen].sort((a, b) => a - b));
    // No empty shelf.
    expect(new Set(seen).size).toBe(order.length);
  });

  it("documents every shared component (a new one without an entry fails here)", () => {
    const sharedRoot = path.resolve(__dirname, "../../../../shared/components");
    const folders = ["ui", "forms", "skeletons", "layout", "animations", "icons"];
    const components = folders.flatMap((folder) =>
      readdirSync(path.join(sharedRoot, folder))
        .filter((file) => file.endsWith(".tsx") && !file.endsWith(".spec.tsx"))
        .map((file) => file.replace(/\.tsx$/, "")),
    );
    const documented = new Set(
      STYLEGUIDE_SECTIONS.flatMap((section) => [
        ...section.keywords,
        ...section.usage.map((usage) => usage.name),
      ]),
    );

    // The scan found the folders it is supposed to guard.
    expect(components.length).toBeGreaterThan(20);
    expect(components.filter((name) => !documented.has(name))).toEqual([]);
  });
});

describe("filterSections", () => {
  const ids = (query: string) => filterSections(STYLEGUIDE_SECTIONS, query).map((s) => s.id);

  it("returns everything for an empty filter", () => {
    expect(ids("")).toHaveLength(STYLEGUIDE_SECTIONS.length);
    expect(ids("   ")).toHaveLength(STYLEGUIDE_SECTIONS.length);
  });

  it("finds a section by a component name, whatever the case", () => {
    expect(ids("statcard")).toEqual(["cards"]);
    expect(ids("StatusBadge")).toEqual(["badges"]);
  });

  it("ignores accents and matches every word", () => {
    expect(ids("botoes")).toEqual(["buttons"]);
    expect(ids("confirmacao modal")).toEqual(["overlays"]);
  });

  it("returns nothing when no section matches", () => {
    expect(ids("componente-que-nao-existe")).toEqual([]);
  });
});
