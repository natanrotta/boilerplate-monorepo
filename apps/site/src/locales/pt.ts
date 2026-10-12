export const pt = {
  brand: "Boilerplate",

  header: {
    howItWorks: "Como funciona",
    signIn: "Entrar",
    toggleTheme: "Alternar tema claro e escuro",
    language: "Idioma",
  },

  hero: {
    eyebrow: "Starter de monorepo TypeScript",
    title: "Comece o próximo produto pela parte que importa.",
    subtitle:
      "Autenticação, design system, três idiomas, testes e deploy já prontos e validados. Clone, renomeie e construa o que é só seu.",
    cta: "Ver no GitHub",
    secondary: "Como funciona",
    stackLabel: "Feito com",
    mock: {
      label: "Ilustração do painel que o starter abre depois do login.",
      nav: ["Dashboard", "Configurações"],
      greeting: "Olá, Demo",
      subtitle: "Bem-vindo ao seu painel.",
      stats: [
        { label: "Total", value: "0" },
        { label: "Concluídos", value: "0" },
        { label: "Crescimento", value: "0%" },
      ],
      emptyTitle: "Nada por aqui ainda",
      emptyBody: "Comece a usar o app e seus dados aparecem neste painel.",
    },
  },

  steps: {
    eyebrow: "Como funciona",
    title: "Do clone à sua primeira tela, em três passos.",
    items: [
      {
        title: "Clone e instale",
        body: "Um repositório com a API, o app web e este site. Um yarn install, e o Postgres e o Redis sobem em Docker.",
      },
      {
        title: "Rode e entre",
        body: "Migrations, seed e yarn dev. Na sua máquina, o login rápido entra como o usuário de demonstração com um clique.",
      },
      {
        title: "Construa o seu módulo",
        body: "Siga o módulo de referência no backend e no frontend, e monte a tela com os componentes do styleguide.",
      },
    ],
  },

  included: {
    eyebrow: "O que já vem pronto",
    title: "A parte chata, mas crítica, já está feita.",
    items: [
      {
        title: "Autenticação completa",
        body: "Cadastro, login, redefinição de senha, verificação de e-mail por PIN e Google. A sessão fica em cookie httpOnly, com CSRF e limite de requisições.",
      },
      {
        title: "Backend em camadas",
        body: "Módulos organizados em domínio, aplicação e infraestrutura, com injeção de dependência e configuração validada. Filas, armazenamento e e-mail já estão ligados.",
      },
      {
        title: "Design system próprio",
        body: "Tokens, receitas e estilos de texto em um pacote só, usado pelo app e por este site. Tema claro e escuro, e um styleguide com todos os componentes.",
      },
      {
        title: "Três idiomas",
        body: "Português, inglês e espanhol, no app e neste site.",
      },
      {
        title: "Testes que acompanham",
        body: "Testes unitários no backend e nos componentes, e testes de ponta a ponta com regressão visual do design system.",
      },
      {
        title: "Build e deploy",
        body: "Pipelines com Turborepo, uma imagem Docker e GitHub Actions para integração, build e deploy.",
      },
    ],
  },

  closing: {
    title: "Pronto para começar?",
    subtitle: "Clone o repositório e tenha login, painel e configurações rodando na sua máquina.",
    cta: "Ver no GitHub",
    copy: "Copiar comando",
    copied: "Comando copiado",
  },

  footer: {
    tagline: "Starter de monorepo TypeScript.",
    terms: "Termos de Uso",
    privacy: "Política de Privacidade",
    rights: "Boilerplate. Licença MIT.",
  },

  legal: {
    eyebrow: "Legal",
    backToHome: "Voltar para a home",
    updatedAt: "Última atualização:",
    updatedAtDate: "1 de janeiro de 2025",
    privacyTitle: "Política de Privacidade",
    privacyIntro:
      "Este é um texto de exemplo. Substitua por sua própria política de privacidade antes de publicar.",
    termsTitle: "Termos de Uso",
    termsIntro:
      "Este é um texto de exemplo. Substitua por seus próprios termos de uso antes de publicar.",
  },
};

export type Dictionary = typeof pt;
