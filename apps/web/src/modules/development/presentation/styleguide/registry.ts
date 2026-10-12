import type { ComponentType } from "react";
import {
  ColorSection,
  IconSection,
  RadiusSection,
  ShadowSection,
  TypographySection,
} from "../sections/FoundationSections";
import { ButtonSection } from "../sections/ButtonSection";
import { BadgeSection } from "../sections/BadgeSection";
import { FieldSection } from "../sections/FieldSection";
import { ControlSection } from "../sections/ControlSection";
import { CardSection } from "../sections/CardSection";
import { EmptyStateSection, GuardSection, SkeletonSection } from "../sections/StateSection";
import { OverlaySection } from "../sections/OverlaySection";
import { ShellSection } from "../sections/ShellSection";
import { MotionSection } from "../sections/MotionSection";
import { AnimatedIconSection } from "../sections/AnimatedIconSection";
import { TabsSection } from "../sections/TabsSection";

/** The shelves of the gallery, in reading order. */
export const STYLEGUIDE_CATEGORIES = [
  { id: "foundations", title: "Fundamentos" },
  { id: "actions", title: "Ações e status" },
  { id: "forms", title: "Formulários" },
  { id: "data", title: "Dados e layout" },
  { id: "feedback", title: "Feedback e estados" },
] as const;

export type StyleguideCategoryId = (typeof STYLEGUIDE_CATEGORIES)[number]["id"];

/** How a component of a section is brought into a screen. */
export interface StyleguideUsage {
  /** The component (or hook / token family) the example is about. */
  name: string;
  /** Its import line; omitted for tokens, which need none. */
  importLine?: string;
  /** A minimal, real call. */
  code: string;
}

export interface StyleguideSection {
  /** `data-cy="styleguide-<id>"` — one visual baseline per id, per color mode. */
  id: string;
  title: string;
  category: StyleguideCategoryId;
  /** One sentence: what lives here and when to reach for it. */
  description: string;
  /** Component and token names the quick filter matches besides the title. */
  keywords: readonly string[];
  usage: readonly StyleguideUsage[];
  Component: ComponentType;
}

const UI = "@/shared/components/ui";
const FORMS = "@/shared/components/forms";
const SKELETONS = "@/shared/components/skeletons";
const LAYOUT = "@/shared/components/layout";
const ANIMATIONS = "@/shared/components/animations";

/**
 * Every section of the gallery, grouped by category in reading order.
 *
 * Two contracts hang off this list:
 *  - the ids are the `SECTIONS` of `e2e/tests/design-system/styleguide-visual.spec.ts`
 *    (one baseline per id, per color mode);
 *  - every component under `shared/components` must be named by a `usage` or a
 *    keyword here — `registry.spec.ts` fails on a component nobody documented.
 */
export const STYLEGUIDE_SECTIONS: StyleguideSection[] = [
  {
    id: "typography",
    title: "Tipografia",
    category: "foundations",
    description:
      "Geist para texto e Geist Mono para identificadores e rótulos. Use os text styles do tema — nunca um tamanho solto.",
    keywords: ["textStyle", "Geist", "Geist Mono", "pageTitle", "sectionTitle", "eyebrow", "caption", "fonte"],
    usage: [
      {
        name: "textStyle",
        code: `<Heading as="h1" textStyle="pageTitle">Configurações</Heading>\n<Text textStyle="eyebrow" color="text.muted">Conta</Text>`,
      },
    ],
    Component: TypographySection,
  },
  {
    id: "colors",
    title: "Cores semânticas",
    category: "foundations",
    description:
      "Todo componente pinta com tokens semânticos (bg.*, text.*, border.*, status.*), que já trazem o par claro/escuro. Hex fora do tema é erro.",
    keywords: ["tokens", "bg", "text", "border", "status", "brand", "primary", "dark", "light", "tema"],
    usage: [
      {
        name: "tokens",
        code: `<Box bg="bg.surface" borderWidth="1px" borderColor="border.subtle" color="text.primary" />\n<Text color="status.error.fg">Não foi possível salvar</Text>`,
      },
    ],
    Component: ColorSection,
  },
  {
    id: "shadows",
    title: "Sombras",
    category: "foundations",
    description:
      "A interface é plana: uma linha fina separa as superfícies e a sombra só aparece quando algo se eleva (hover, menu, modal).",
    keywords: ["shadow", "boxShadow", "elevação", "shadow.card", "shadow.panel", "focus"],
    usage: [{ name: "boxShadow", code: `<Box boxShadow="shadow.card" _hover={{ boxShadow: "shadow.cardHover" }} />` }],
    Component: ShadowSection,
  },
  {
    id: "radii",
    title: "Raios",
    category: "foundations",
    description:
      "Cantos justos e precisos: md em controles e campos, lg/xl em cards e menus, 2xl/3xl em diálogos, full em pílulas.",
    keywords: ["borderRadius", "radius", "canto", "arredondado"],
    usage: [{ name: "borderRadius", code: `<Box borderRadius="xl" />` }],
    Component: RadiusSection,
  },
  {
    id: "icons",
    title: "Ícones",
    category: "foundations",
    description:
      "O barrel de ícones do app: Lucide com caixa de 1em, então o ícone acompanha o tamanho do texto ao redor e herda a cor.",
    keywords: ["icon", "ícone", "lucide", "Fi", "BrandIcons", "IconType"],
    usage: [
      {
        name: "icons",
        importLine: `import { FiSearch } from "@/shared/components/icons";`,
        code: `<Button variant="outline"><FiSearch /> Buscar</Button>`,
      },
    ],
    Component: IconSection,
  },
  {
    id: "animated-icons",
    title: "Ícones animados",
    category: "foundations",
    description:
      "Ícones que animam uma vez, no hover ou foco do controle dono ou quando um estado vazio aparece. Herdam a cor do texto, nunca ficam em loop e ficam parados sob prefers-reduced-motion.",
    keywords: ["AnimatedIcon", "useHoverPlay", "ícone", "icon", "hover", "glyph", "motion"],
    usage: [
      {
        name: "AnimatedIcon",
        importLine: `import { AnimatedIcon, useHoverPlay } from "@/shared/components/icons/animated";`,
        code: `// O controle dono (linha, botão) dispara o ícone:\nconst { playing, hostProps } = useHoverPlay();\n\n<Flex {...hostProps}>\n  <AnimatedIcon name="settings" size={18} playing={playing} />\n  Configurações\n</Flex>`,
      },
      {
        name: "EmptyState animatedIcon",
        importLine: `import { EmptyState } from "${UI}/EmptyState";`,
        code: `<EmptyState animatedIcon="search" title="Nenhum resultado" description="Tente outro termo de busca." />`,
      },
    ],
    Component: AnimatedIconSection,
  },
  {
    id: "motion",
    title: "Animações",
    category: "foundations",
    description:
      "Entradas curtas, uma vez só. FadeIn para um bloco, StaggerContainer para uma lista; PageTransition já anima a troca de rota no shell e SlidingIndicator desliza a marca de seleção de um controle.",
    keywords: ["motion", "animação", "transição", "entrada", "seleção", "LayoutGroup", "layoutId"],
    usage: [
      {
        name: "FadeIn",
        importLine: `import { FadeIn, StaggerContainer, StaggerItem } from "${ANIMATIONS}/FadeIn";`,
        code: `<FadeIn delay={0.1}>\n  <SectionCard>…</SectionCard>\n</FadeIn>`,
      },
      {
        name: "PageTransition",
        importLine: `import { PageTransition } from "${ANIMATIONS}/PageTransition";`,
        code: `// No lugar do <Outlet /> de um layout de rota:\n<PageTransition />`,
      },
      {
        name: "SlidingIndicator",
        importLine: `import { SlidingIndicator } from "${ANIMATIONS}/SlidingIndicator";`,
        code: `// Um LayoutGroup por controle; a marca só existe dentro da opção selecionada\n// (que precisa de position="relative"):\n<LayoutGroup id={useId()}>\n  {options.map((option) => (\n    <Flex key={option.value} position="relative">\n      {option.value === value ? (\n        <SlidingIndicator layoutId="active" bg="bg.brand.subtle" borderRadius="md" />\n      ) : null}\n      <Text position="relative">{option.label}</Text>\n    </Flex>\n  ))}\n</LayoutGroup>`,
      },
    ],
    Component: MotionSection,
  },
  {
    id: "shell",
    title: "Shell e navegação",
    category: "foundations",
    description:
      "A moldura do app autenticado: sidebar no desktop, cabeçalho e barra inferior no celular, e a versão do build no rodapé da navegação. A marca (BrandMark) e a moldura das telas sem sessão (AuthShell) também moram aqui.",
    keywords: ["sidebar", "navegação", "layout", "mobile", "versão", "logo", "marca", "login", "BrandMark", "AuthShell"],
    usage: [
      {
        name: "AppShell",
        importLine: `import { AppShell } from "${LAYOUT}/AppShell";`,
        code: `<AppShell>\n  <PageTransition />\n</AppShell>`,
      },
      {
        name: "SidebarNav",
        importLine: `import { SidebarNav } from "${LAYOUT}/SidebarNav";`,
        code: `<SidebarNav forceExpanded onNavigate={onClose} />`,
      },
      {
        name: "MobileHeader",
        importLine: `import { MobileHeader } from "${LAYOUT}/MobileHeader";`,
        code: `<MobileHeader onOpenSidebar={onOpen} />`,
      },
      {
        name: "MobileBottomNav",
        importLine: `import { MobileBottomNav } from "${LAYOUT}/MobileBottomNav";`,
        code: `<MobileBottomNav />`,
      },
      {
        name: "AppVersion",
        importLine: `import { AppVersion } from "${LAYOUT}/AppVersion";`,
        code: `<AppVersion />`,
      },
      {
        name: "BrandMark",
        importLine: `import { BrandMark } from "${UI}/BrandMark";`,
        code: `<BrandMark size={36} />`,
      },
      {
        name: "AuthShell",
        importLine: `import { AuthShell } from "${LAYOUT}/AuthShell";`,
        code: `<AuthShell crossLinkPrompt="Ainda não tem conta?" crossLinkLabel="Criar conta" crossLinkTo={ROUTE_PATHS.register}>…</AuthShell>`,
      },
    ],
    Component: ShellSection,
  },
  {
    id: "buttons",
    title: "Botões",
    category: "actions",
    description:
      "A ação primária é a tinta invertida (solid); outline é a secundária, ghost a terciária, subtle a de destaque suave e danger a destrutiva.",
    keywords: ["Button", "solid", "outline", "ghost", "subtle", "danger", "loading", "salvar"],
    usage: [
      {
        name: "Button",
        importLine: `import { Button } from "@chakra-ui/react";`,
        code: `<Button>Salvar</Button>\n<Button variant="outline">Cancelar</Button>\n<Button variant="danger">Excluir</Button>`,
      },
      {
        name: "SaveButton",
        importLine: `import { SaveButton } from "${UI}/SaveButton";`,
        code: `<SaveButton isDirty={isDirty} isSaving={isSaving} onClick={save} />`,
      },
    ],
    Component: ButtonSection,
  },
  {
    id: "badges",
    title: "Status",
    category: "actions",
    description:
      "Um status por cor semântica: sucesso, informação, aviso (roxo — nunca amarelo), erro e neutro.",
    keywords: ["badge", "status", "success", "warning", "error", "info", "neutral"],
    usage: [
      {
        name: "StatusBadge",
        importLine: `import { StatusBadge } from "${UI}/StatusBadge";`,
        code: `<StatusBadge status="success" label="Ativo" />`,
      },
    ],
    Component: BadgeSection,
  },
  {
    id: "controls",
    title: "Controles de página",
    category: "actions",
    description:
      "O cabeçalho de uma tela, a busca de uma listagem, o menu de ações de um item e os seletores de tema e idioma.",
    keywords: ["cabeçalho", "busca", "menu", "tema", "idioma", "dark mode"],
    usage: [
      {
        name: "PageHeader",
        importLine: `import { PageHeader } from "${UI}/PageHeader";`,
        code: `<PageHeader\n  title="Clientes"\n  description="Quem usa o produto."\n  primaryAction={{ label: "Adicionar", onClick: openCreate }}\n/>`,
      },
      {
        name: "FilterBar",
        importLine: `import { FilterBar } from "${UI}/FilterBar";`,
        code: `<FilterBar searchValue={search} onSearchChange={setSearch} />`,
      },
      {
        name: "ActionMenu",
        importLine: `import { ActionMenu } from "${UI}/ActionMenu";`,
        code: `<ActionMenu items={[{ label: "Editar", icon: FiEdit2, onClick: edit }]} />`,
      },
      {
        name: "ColorModeToggle",
        importLine: `import { ColorModeToggle } from "${UI}/ColorModeToggle";`,
        code: `<ColorModeToggle size="sm" />`,
      },
      {
        name: "LanguageSelector",
        importLine: `import { LanguageSelector } from "${UI}/LanguageSelector";`,
        code: `<LanguageSelector />`,
      },
    ],
    Component: ControlSection,
  },
  {
    id: "tabs",
    title: "Abas e segmentos",
    category: "actions",
    description:
      "UnderlineTabs troca a seção de uma página; SegmentedControl escolhe uma entre poucas opções curtas. Nos dois a marca de seleção desliza até a nova opção.",
    keywords: ["abas", "tabs", "tablist", "segmented", "radio", "filtro", "período", "SlidingIndicator"],
    usage: [
      {
        name: "UnderlineTabs",
        importLine: `import { UnderlineTabs } from "${UI}/UnderlineTabs";`,
        code: `<UnderlineTabs\n  ariaLabel="Seções"\n  items={[{ value: "profile", label: "Perfil" }, { value: "preferences", label: "Preferências" }]}\n  value={tab}\n  onChange={setTab}\n/>`,
      },
      {
        name: "SegmentedControl",
        importLine: `import { SegmentedControl } from "${UI}/SegmentedControl";`,
        code: `<SegmentedControl\n  ariaLabel="Período"\n  options={[{ value: "7d", label: "7 dias" }, { value: "30d", label: "30 dias" }]}\n  value={range}\n  onChange={setRange}\n/>`,
      },
    ],
    Component: TabsSection,
  },
  {
    id: "fields",
    title: "Campos",
    category: "forms",
    description:
      "Todo formulário usa estes campos — rótulo, ajuda e erro já vêm prontos. Nunca um <Input> cru em código de feature.",
    keywords: ["input", "formulário", "form", "senha", "select", "textarea", "número", "erro", "helper"],
    usage: [
      {
        name: "FormField",
        importLine: `import { FormField } from "${FORMS}/FormField";`,
        code: `<FormField label="Nome" value={name} onChange={setName} error={errors.name} />`,
      },
      {
        name: "PasswordField",
        importLine: `import { PasswordField } from "${FORMS}/PasswordField";`,
        code: `<PasswordField label="Senha" value={password} onChange={setPassword} />`,
      },
      {
        name: "PasswordStrengthIndicator",
        importLine: `import { PasswordStrengthIndicator } from "${FORMS}/PasswordStrengthIndicator";`,
        code: `<PasswordStrengthIndicator password={password} />`,
      },
      {
        name: "SelectField",
        importLine: `import { SelectField } from "${FORMS}/SelectField";`,
        code: `<SelectField label="Tipo" value={kind} onChange={setKind} options={options} />`,
      },
      {
        name: "NumberField",
        importLine: `import { NumberField } from "${FORMS}/NumberField";`,
        code: `<NumberField label="Quantidade" value={count} onChange={setCount} />`,
      },
      {
        name: "TextAreaField",
        importLine: `import { TextAreaField } from "${FORMS}/TextAreaField";`,
        code: `<TextAreaField label="Observações" value={notes} onChange={setNotes} />`,
      },
    ],
    Component: FieldSection,
  },
  {
    id: "cards",
    title: "Cards",
    category: "data",
    description:
      "SectionCard agrupa o conteúdo de uma tela, EntityCard é um item de listagem e StatCard é um número de dashboard.",
    keywords: ["card", "listagem", "dashboard", "kpi", "métrica", "glass", "sunken"],
    usage: [
      {
        name: "SectionCard",
        importLine: `import { SectionCard } from "${UI}/SectionCard";`,
        code: `<SectionCard title="Perfil">…</SectionCard>`,
      },
      {
        name: "EntityCard",
        importLine: `import { EntityCard } from "${UI}/EntityCard";`,
        code: `<EntityCard title={item.name} subtitle={item.owner} onClick={() => open(item.id)} />`,
      },
      {
        name: "StatCard",
        importLine: `import { StatCard } from "${UI}/StatCard";`,
        code: `<StatCard label="Total" value="128" hint="+12% no mês" trend="up" />`,
      },
    ],
    Component: CardSection,
  },
  {
    id: "empty",
    title: "Estado vazio",
    category: "feedback",
    description:
      "O que uma listagem mostra sem itens: o motivo e, quando existe, a ação que resolve.",
    keywords: ["vazio", "empty", "sem resultados", "cta"],
    usage: [
      {
        name: "EmptyState",
        importLine: `import { EmptyState } from "${UI}/EmptyState";`,
        code: `<EmptyState\n  title="Nada por aqui"\n  description="Crie o primeiro registro para começar."\n  actionLabel="Adicionar"\n  onAction={openCreate}\n/>`,
      },
    ],
    Component: EmptyStateSection,
  },
  {
    id: "skeletons",
    title: "Carregamento",
    category: "feedback",
    description:
      "Conteúdo principal carrega com o esqueleto da própria tela — nunca com um spinner solto.",
    keywords: ["skeleton", "loading", "carregando", "esqueleto", "lazy"],
    usage: [
      {
        name: "ListPageSkeleton",
        importLine: `import { ListPageSkeleton } from "${SKELETONS}/ListPageSkeleton";`,
        code: `if (isLoading) return <ListPageSkeleton />;`,
      },
      {
        name: "DetailPageSkeleton",
        importLine: `import { DetailPageSkeleton } from "${SKELETONS}/DetailPageSkeleton";`,
        code: `<DetailPageSkeleton variant="profile" />`,
      },
      {
        name: "EntityCardSkeleton",
        importLine: `import { EntityCardSkeleton } from "${SKELETONS}/EntityCardSkeleton";`,
        code: `<EntityCardSkeleton />`,
      },
      {
        name: "SectionCardSkeleton",
        importLine: `import { SectionCardSkeleton } from "${SKELETONS}/SectionCardSkeleton";`,
        code: `<SectionCardSkeleton lines={3} />`,
      },
      {
        name: "FilterBarSkeleton",
        importLine: `import { FilterBarSkeleton } from "${SKELETONS}/FilterBarSkeleton";`,
        code: `<FilterBarSkeleton />`,
      },
      {
        name: "RouteContentSkeleton",
        importLine: `import { RouteContentSkeleton } from "${SKELETONS}/RouteContentSkeleton";`,
        code: `<Suspense fallback={<RouteContentSkeleton />}>…</Suspense>`,
      },
    ],
    Component: SkeletonSection,
  },
  {
    id: "guards",
    title: "Erros e guardas",
    category: "feedback",
    description:
      "DetailPageGuard decide entre esqueleto, erro e não encontrado; RouteErrorBoundary contém a quebra de uma tela e GlobalErrorBoundary a do app inteiro.",
    keywords: ["erro", "error boundary", "não encontrado", "404", "retry", "falha"],
    usage: [
      {
        name: "DetailPageGuard",
        importLine: `import { DetailPageGuard } from "${UI}/DetailPageGuard";`,
        code: `<DetailPageGuard isLoading={isLoading} error={error} entity={entity}>\n  {/* a tela */}\n</DetailPageGuard>`,
      },
      {
        name: "RouteErrorBoundary",
        importLine: `import { RouteErrorBoundary } from "${UI}/RouteErrorBoundary";`,
        code: `<RouteErrorBoundary locationKey={location.pathname}>\n  <Outlet />\n</RouteErrorBoundary>`,
      },
      {
        name: "GlobalErrorBoundary",
        importLine: `import { GlobalErrorBoundary } from "${UI}/GlobalErrorBoundary";`,
        code: `<GlobalErrorBoundary>\n  <App />\n</GlobalErrorBoundary>`,
      },
    ],
    Component: GuardSection,
  },
  {
    id: "overlays",
    title: "Sobreposições",
    category: "feedback",
    description:
      "Modal para criar ou editar, confirmação para o que não tem volta e toast para o resultado de uma ação.",
    keywords: ["modal", "dialog", "confirmação", "toast", "notificação", "useNotify", "useConfirm"],
    usage: [
      {
        name: "AppModal",
        importLine: `import { AppModal } from "${UI}/AppModal";`,
        code: `<AppModal\n  isOpen={open}\n  onClose={onClose}\n  title="Novo registro"\n  primaryActionLabel="Criar"\n  onPrimaryAction={create}\n>\n  …\n</AppModal>`,
      },
      {
        name: "ConfirmDialog",
        importLine: `import { ConfirmDialog } from "${UI}/ConfirmDialog";`,
        code: `<ConfirmDialog\n  isOpen={open}\n  onClose={onClose}\n  onConfirm={remove}\n  title="Excluir registro?"\n  description="Esta ação não pode ser desfeita."\n/>`,
      },
      {
        name: "useNotify",
        importLine: `import { useNotify } from "@/shared/hooks/useNotify";`,
        code: `const { showSuccess, showError } = useNotify();\nshowSuccess("Salvo com sucesso");`,
      },
    ],
    Component: OverlaySection,
  },
];

/** Lowercase, accent-free — so "botoes" finds "Botões". */
function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** The sections a quick-filter text matches: by title, description, component or token name. */
export function filterSections(
  sections: readonly StyleguideSection[],
  query: string,
): StyleguideSection[] {
  const terms = fold(query).split(/\s+/).filter(Boolean);
  if (terms.length === 0) return [...sections];

  return sections.filter((section) => {
    const haystack = fold(
      [section.title, section.description, ...section.keywords, ...section.usage.map((item) => item.name)].join(" "),
    );
    return terms.every((term) => haystack.includes(term));
  });
}
