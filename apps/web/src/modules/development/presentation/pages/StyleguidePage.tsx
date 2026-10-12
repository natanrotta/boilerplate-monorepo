import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Box, Button, Flex, Stack, Text, chakra } from "@chakra-ui/react";
import { ColorModeToggle } from "@/shared/components/ui/ColorModeToggle";
import { EmptyState } from "@/shared/components/ui/EmptyState";
import { FilterBar } from "@/shared/components/ui/FilterBar";
import { PageHeader } from "@/shared/components/ui/PageHeader";
import { Section } from "../styleguide/Section";
import {
  STYLEGUIDE_CATEGORIES,
  STYLEGUIDE_SECTIONS,
  filterSections,
} from "../styleguide/registry";

const COMPONENT_COUNT = new Set(
  STYLEGUIDE_SECTIONS.flatMap((section) => section.usage.map((item) => item.name)),
).size;

/** How far below the top of the scrolling area a section becomes "the current one". */
const ACTIVE_LINE_PX = 48;

/** The element that scrolls the sections: the content column on desktop, the page elsewhere. */
function scrollerOf(content: HTMLElement | null): HTMLElement | null {
  if (content && content.scrollHeight > content.clientHeight + 1) {
    const overflowY = getComputedStyle(content).overflowY;
    if (overflowY === "auto" || overflowY === "scroll") return content;
  }
  return document.scrollingElement as HTMLElement | null;
}

/**
 * The section the reader is on: the last one whose top has passed a line near
 * the top of the scrolling area. Returns a setter too, so a click on the index
 * marks its target at once instead of waiting for the scroll to arrive.
 */
function useActiveSection(ids: readonly string[], contentRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    let frame = 0;
    const measure = () => {
      frame = 0;
      const scroller = scrollerOf(contentRef.current);
      const isPage = scroller === document.scrollingElement;
      const areaTop = scroller && !isPage ? scroller.getBoundingClientRect().top : 96;
      const areaBottom =
        scroller && !isPage ? scroller.getBoundingClientRect().bottom : window.innerHeight;

      let current = ids[0] ?? null;
      let lastVisible: string | null = null;
      for (const id of ids) {
        const element = document.getElementById(id);
        if (!element) continue;
        const { top } = element.getBoundingClientRect();
        if (top <= areaTop + ACTIVE_LINE_PX) current = id;
        if (top < areaBottom) lastVisible = id;
      }
      // At the very end the last sections never reach the line: the last one
      // on screen is the current one.
      const visibleHeight = isPage ? window.innerHeight : (scroller?.clientHeight ?? 0);
      const atEnd =
        scroller !== null && scroller.scrollTop + visibleHeight >= scroller.scrollHeight - 2;
      setActive(atEnd && lastVisible ? lastVisible : current);
    };
    const onScroll = () => {
      if (frame === 0) frame = requestAnimationFrame(measure);
    };

    measure();
    // Capture: the sections scroll inside the content column on desktop.
    window.addEventListener("scroll", onScroll, { capture: true, passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll, { capture: true });
      window.removeEventListener("resize", onScroll);
    };
  }, [ids, contentRef]);

  return [active, setActive] as const;
}

/**
 * DEV-ONLY design-system reference (`/dev/styleguide`, mounted only when
 * `import.meta.env.DEV`). Every shared primitive of the app, grouped by
 * category, with what it is for, how to use it (import + a minimal call) and —
 * in its preview — every variation and state. A side index follows the scroll
 * and a quick filter (press `/`) finds a component by name.
 *
 * The previews are the subject of the visual regression spec
 * (`e2e/tests/design-system/styleguide-visual.spec.ts`), in light and dark.
 * Sections live in `../sections` and are described in `../styleguide/registry`.
 * Copy is literal pt-BR on purpose: this is a development tool, not a product
 * screen, so it stays out of the i18n catalog.
 */
export function StyleguidePage() {
  const [query, setQuery] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = useMemo(() => filterSections(STYLEGUIDE_SECTIONS, query), [query]);
  const groups = useMemo(
    () =>
      STYLEGUIDE_CATEGORIES.map((category) => ({
        ...category,
        sections: sections.filter((section) => section.category === category.id),
      })).filter((group) => group.sections.length > 0),
    [sections],
  );
  const ids = useMemo(() => sections.map((section) => section.id), [sections]);
  const [active, setActive] = useActiveSection(ids, contentRef);
  const isFiltering = query.trim() !== "";

  // `/` jumps to the filter, as in the tools this page keeps company with.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (event.key !== "/" || isTyping || event.metaKey || event.ctrlKey || event.altKey) return;
      event.preventDefault();
      filterRef.current?.querySelector("input")?.focus();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // A shared link (`/dev/styleguide#buttons`) opens on its section — on load
  // and whenever the hash changes. The target is marked at once: the last
  // sections cannot scroll far enough to reach the "current" line.
  useEffect(() => {
    const openHash = () => {
      const id = window.location.hash.slice(1);
      const element = id ? document.getElementById(id) : null;
      if (!element) return;
      element.scrollIntoView();
      setActive(id);
    };
    openHash();
    window.addEventListener("hashchange", openHash);
    return () => window.removeEventListener("hashchange", openHash);
  }, [setActive]);

  const goTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", `#${id}`);
  };

  return (
    // Desktop: the page takes exactly the viewport (as the list screens do) —
    // the header, the filter and the index stay put and only the sections
    // scroll. Smaller screens flow normally.
    <Flex
      direction="column"
      gap={{ base: 5, lg: 4 }}
      h={{ lg: "calc(100dvh - 24px)" }}
      mb={{ lg: -7 }}
      pb={{ base: 10, lg: 0 }}
    >
      <PageHeader
        title="Styleguide"
        description="A referência viva do design system: fundamentos, componentes, variações e estados."
        actions={<ColorModeToggle />}
        mb={0}
        flex="none"
      />

      <Flex
        flex="none"
        position={{ base: "sticky", lg: "static" }}
        top={0}
        zIndex={5}
        align="center"
        gap={3}
        wrap="wrap"
        py={3}
        bg="bg.canvas"
        borderBottomWidth="1px"
        borderColor="border.subtle"
        data-cy="sg-toolbar"
      >
        <Box ref={filterRef} flex="1 1 280px" maxW="420px" data-cy="sg-filter">
          <FilterBar
            searchValue={query}
            onSearchChange={setQuery}
            searchPlaceholder="Filtrar por componente, token ou estado…"
          />
        </Box>
        <Text fontSize="12px" color="text.muted" data-cy="sg-count" aria-live="polite">
          {isFiltering
            ? `${sections.length} de ${STYLEGUIDE_SECTIONS.length} seções`
            : `${STYLEGUIDE_SECTIONS.length} seções · ${COMPONENT_COUNT} componentes documentados`}
        </Text>
        <Text
          display={{ base: "none", md: "block" }}
          ml="auto"
          fontFamily="mono"
          fontSize="11px"
          color="text.muted"
        >
          / para filtrar
        </Text>
      </Flex>

      <Flex gap={6} align="stretch" flex="1" minH={0}>
        {/* The index is a card as tall as the screen; a long list scrolls inside it. */}
        <Box
          as="nav"
          aria-label="Seções do styleguide"
          display={{ base: "none", lg: "block" }}
          flex="none"
          w="232px"
          mb={5}
          p={3}
          bg="bg.surface"
          borderWidth="1px"
          borderColor="border.subtle"
          borderRadius="xl"
          overflowY="auto"
          data-cy="sg-nav"
        >
          <Stack gap={5}>
            {groups.map((group) => (
              <Stack key={group.id} gap={1}>
                <Text textStyle="eyebrow" color="text.muted" px={2.5} mb={1}>
                  {group.title}
                </Text>
                {group.sections.map((section) => {
                  const isActive = active === section.id;
                  return (
                    <chakra.a
                      key={section.id}
                      href={`#${section.id}`}
                      aria-current={isActive ? "location" : undefined}
                      onClick={(event) => {
                        event.preventDefault();
                        goTo(section.id);
                      }}
                      display="block"
                      px={2.5}
                      py="6px"
                      borderRadius="sm"
                      fontSize="13px"
                      color={isActive ? "text.primary" : "text.muted"}
                      bg={isActive ? "bg.brand.subtle" : "transparent"}
                      transition="background 0.14s ease, color 0.14s ease"
                      _hover={{ bg: isActive ? "bg.brand.subtle" : "bg.hover", color: "text.primary" }}
                      _focusVisible={{ outline: "2px solid", outlineColor: "border.focus", outlineOffset: "1px" }}
                      data-cy={`sg-nav-${section.id}`}
                    >
                      {section.title}
                    </chakra.a>
                  );
                })}
              </Stack>
            ))}
          </Stack>
        </Box>

        <Stack
          ref={contentRef}
          gap={10}
          flex="1"
          minW={0}
          overflowY={{ lg: "auto" }}
          pr={{ lg: 2 }}
          pb={{ lg: 7 }}
          data-cy="sg-content"
        >
          {groups.length === 0 ? (
            <Stack gap={4} align="center">
              <EmptyState
                title="Nada encontrado"
                description={`Nenhuma seção corresponde a “${query.trim()}”. Tente o nome de um componente, como EntityCard ou StatusBadge.`}
              />
              <Button variant="outline" size="sm" onClick={() => setQuery("")} data-cy="sg-clear">
                Limpar filtro
              </Button>
            </Stack>
          ) : (
            groups.map((group) => (
              <Stack key={group.id} as="section" gap={4} aria-label={group.title} data-cy={`sg-category-${group.id}`}>
                <Flex align="baseline" gap={3}>
                  <Text fontSize="18px" fontWeight="500" letterSpacing="-0.02em">
                    {group.title}
                  </Text>
                  <Text fontFamily="mono" fontSize="11px" color="text.muted">
                    {group.sections.length}
                  </Text>
                </Flex>
                {group.sections.map((section) => (
                  <Section key={section.id} section={section} categoryTitle={group.title} />
                ))}
              </Stack>
            ))
          )}
        </Stack>
      </Flex>
    </Flex>
  );
}
