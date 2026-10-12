import type { Dictionary } from "./pt";

export const es: Dictionary = {
  brand: "Boilerplate",

  header: {
    howItWorks: "Cómo funciona",
    signIn: "Entrar",
    toggleTheme: "Alternar entre tema claro y oscuro",
    language: "Idioma",
  },

  hero: {
    eyebrow: "Starter de monorepo TypeScript",
    title: "Empieza tu próximo producto por la parte que importa.",
    subtitle:
      "Autenticación, sistema de diseño, tres idiomas, pruebas y despliegue ya listos y validados. Clona, renombra y construye lo que es solo tuyo.",
    cta: "Ver en GitHub",
    secondary: "Cómo funciona",
    stackLabel: "Hecho con",
    mock: {
      label: "Ilustración del panel que el starter abre después de iniciar sesión.",
      nav: ["Dashboard", "Configuración"],
      greeting: "Hola, Demo",
      subtitle: "Bienvenido a tu panel.",
      stats: [
        { label: "Total", value: "0" },
        { label: "Completados", value: "0" },
        { label: "Crecimiento", value: "0%" },
      ],
      emptyTitle: "Todavía no hay nada aquí",
      emptyBody: "Empieza a usar la app y tus datos aparecerán en este panel.",
    },
  },

  steps: {
    eyebrow: "Cómo funciona",
    title: "Del clon a tu primera pantalla, en tres pasos.",
    items: [
      {
        title: "Clona e instala",
        body: "Un repositorio con la API, la app web y este sitio. Un yarn install, y Postgres y Redis arrancan en Docker.",
      },
      {
        title: "Ejecuta y entra",
        body: "Migraciones, seed y yarn dev. En tu máquina, el inicio de sesión rápido entra como el usuario de demostración con un clic.",
      },
      {
        title: "Construye tu módulo",
        body: "Sigue el módulo de referencia en el backend y en el frontend, y arma la pantalla con los componentes de la guía de estilos.",
      },
    ],
  },

  included: {
    eyebrow: "Lo que ya viene listo",
    title: "La parte aburrida, pero crítica, ya está hecha.",
    items: [
      {
        title: "Autenticación completa",
        body: "Registro, inicio de sesión, restablecimiento de contraseña, verificación de correo por PIN y Google. La sesión vive en una cookie httpOnly, con CSRF y límite de solicitudes.",
      },
      {
        title: "Backend por capas",
        body: "Módulos organizados en dominio, aplicación e infraestructura, con inyección de dependencias y configuración validada. Colas, almacenamiento y correo ya están conectados.",
      },
      {
        title: "Sistema de diseño propio",
        body: "Tokens, recetas y estilos de texto en un solo paquete, usado por la app y por este sitio. Tema claro y oscuro, y una guía de estilos con todos los componentes.",
      },
      {
        title: "Tres idiomas",
        body: "Portugués, inglés y español, en la app y en este sitio.",
      },
      {
        title: "Pruebas que acompañan",
        body: "Pruebas unitarias en el backend y en los componentes, y pruebas de extremo a extremo con regresión visual del sistema de diseño.",
      },
      {
        title: "Build y despliegue",
        body: "Pipelines con Turborepo, una imagen Docker y GitHub Actions para integración, build y despliegue.",
      },
    ],
  },

  closing: {
    title: "¿Listo para empezar?",
    subtitle: "Clona el repositorio y ten inicio de sesión, panel y configuración funcionando en tu máquina.",
    cta: "Ver en GitHub",
    copy: "Copiar comando",
    copied: "Comando copiado",
  },

  footer: {
    tagline: "Starter de monorepo TypeScript.",
    terms: "Términos de Uso",
    privacy: "Política de Privacidad",
    rights: "Boilerplate. Licencia MIT.",
  },

  legal: {
    eyebrow: "Legal",
    backToHome: "Volver al inicio",
    updatedAt: "Última actualización:",
    updatedAtDate: "1 de enero de 2025",
    privacyTitle: "Política de Privacidad",
    privacyIntro:
      "Este es un texto de ejemplo. Reemplázalo con tu propia política de privacidad antes de publicar.",
    termsTitle: "Términos de Uso",
    termsIntro:
      "Este es un texto de ejemplo. Reemplázalo con tus propios términos de uso antes de publicar.",
  },
};
