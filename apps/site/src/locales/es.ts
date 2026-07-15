import type { Dictionary } from "./pt";

export const es: Dictionary = {
  nav: {
    topo: "Volver al inicio",
    problema: "Por qué",
    modulos: "Funciones",
    planos: "Planes",
    acessar: "Entrar",
    plataforma: "App",
    abrirMenu: "Abrir menú",
    fecharMenu: "Cerrar menú",
    tema: "Cambiar tema",
    sectionPlanos: "PLANES",
  },

  hero: {
    eyebrow: "El boilerplate de producto listo para lanzar",
    line1: "Construye más rápido.",
    line2Lead: "Empieza con el",
    line2Highlight: "boilerplate.",
    subtitle:
      "Un punto de partida limpio y moderno para tu próximo producto. Tema, animaciones, internacionalización y modo claro/oscuro ya configurados — solo cambia la marca y publica.",
    ctaPrimary: "Empezar ahora",
    ctaSecondary: "Ver funciones",
    scrollHint: "desplaza para descubrir",
  },

  problem: {
    eyebrow: "Por qué este boilerplate",
    headlineLead: "Menos configuración, ",
    headlineHighlight: "más producto.",
    subtitle:
      "No deberías gastar tus primeras semanas montando el tema, la i18n y la infraestructura. Este boilerplate te da una base sólida para que te enfoques en lo que hace único a tu producto.",
    answerLabel: "La base",
    items: {
      time: {
        title: "Empieza en minutos",
        body: "Clona, instala y ejecuta. Una estructura organizada y con opinión, lista para que agregues tus pantallas.",
      },
      energy: {
        title: "Diseño consistente",
        body: "Un sistema de diseño con tokens, tipografía y componentes reutilizables — coherente del primer clic al último.",
      },
      scatter: {
        title: "Listo para escalar",
        body: "Patrones claros de componentes, contenido y traducciones que crecen junto con tu producto.",
      },
      answer: {
        title: "Hecho para ser tu marca",
        body: "Genérico a propósito. Cambia el nombre, los colores y los textos y se vuelve tuyo — sin código heredado en el camino.",
      },
    },
    bridge: "Mira lo que ya viene incluido.",
  },

  modules: {
    eyebrow: "Las funciones",
    titleLead: "Todo lo que necesitas, ",
    titleHighlight: "ya configurado.",
    subtitle: "Bloques genéricos y reutilizables, pensados para combinarse entre sí.",
    counterSeparator: "/",
    a11yPrev: "Anterior",
    a11yNext: "Siguiente",
    a11yGoTo: "Ir a",
    items: {
      workflows: {
        title: "Flujos de trabajo",
        body: "Organiza pantallas y pasos en flujos claros que tus usuarios entienden a la primera.",
      },
      automation: {
        title: "Automatización",
        body: "Automatiza tareas repetitivas y deja que el producto trabaje por ti en segundo plano.",
      },
      analytics: {
        title: "Analíticas",
        body: "Paneles y métricas listos para responder las preguntas que de verdad importan.",
      },
      collaboration: {
        title: "Colaboración",
        body: "Roles, permisos y trabajo en equipo pensados para varios usuarios desde el inicio.",
      },
      integrations: {
        title: "Integraciones",
        body: "Conecta servicios externos con un punto de extensión simple y predecible.",
      },
      customization: {
        title: "Personalización",
        body: "Campos, temas y ajustes que adaptan el producto a tu caso de uso.",
      },
    },
  },

  trust: {
    eyebrow: "Confianza",
    titleLead: "Equipos de todos los tamaños ",
    titleHighlight: "construyen con nosotros.",
    subtitle:
      "Una base probada, accesible y lista para producción — para que publiques con confianza desde el primer día.",
    logosLabel: "Usado por equipos de",
    items: {
      privacidade: {
        title: "Accesible por defecto",
        body: "Foco, teclado y lectores de pantalla pensados desde el inicio — inclusión sin retrabajo.",
      },
      seguranca: {
        title: "Seguro por defecto",
        body: "Buenas prácticas de seguridad integradas en la base, para no empezar de cero.",
      },
      assinatura: {
        title: "Realmente rápido",
        body: "Optimizado para cargar rápido y responder al instante, en cualquier dispositivo.",
      },
      saude: {
        title: "Listo para producción",
        body: "Una estructura clara, tipada y documentada — fácil de mantener a medida que crece el equipo.",
      },
    },
    testimonials: {
      one: {
        quote:
          "Cambiamos la marca y publicamos la landing en una tarde. La base ya estaba lista para producción.",
        author: "Alex Costa",
        role: "CTO, Acme",
        initials: "AC",
      },
      two: {
        quote:
          "El sistema de diseño y la internacionalización nos ahorraron semanas. Nos enfocamos en el producto, no en la infraestructura.",
        author: "Bruna Dias",
        role: "Head de Producto, Globex",
        initials: "BD",
      },
      three: {
        quote: "Limpio, rápido y fácil de extender. Exactamente el punto de partida que queríamos.",
        author: "Carlos Melo",
        role: "Fundador, Initech",
        initials: "CM",
      },
    },
  },

  pricing: {
    eyebrow: "Planes",
    titleLead: "Un plan ",
    titleHighlight: "para cada",
    titleTail: " etapa.",
    subtitle:
      "Precios de ejemplo para que adaptes. Sin permanencia, sin letra pequeña — solo un punto de partida claro.",
    trialTitle: "14 días gratis para probar",
    trialSubtitle: "Úsalo todo, sin tarjeta. Solo suscríbete si quieres continuar.",
    closingPart1: "Todos los planes incluyen ",
    closingHighlight: "las funciones esenciales",
    closingPart2: " — la diferencia está en la escala.",
    descLabel: "DESCRIPCIÓN",
    subtotalLabel: "SUBTOTAL",
    totalLabel: "TOTAL",
    featuredBadge: "MÁS POPULAR",
    plans: {
      starter: {
        name: "STARTER",
        description: "Para proyectos personales",
        descriptionSubtitle: "Todo lo que necesitas para empezar. Cancela cuando quieras.",
        totalSuffix: "/ mes",
        cta: "Empezar",
      },
      pro: {
        name: "PRO",
        description: "Para equipos en crecimiento",
        descriptionSubtitle: "Más capacidad y funciones avanzadas para escalar.",
        totalSuffix: "/ mes",
        installments: "por usuario",
        cta: "Suscribir Pro",
      },
      enterprise: {
        name: "ENTERPRISE",
        description: "Para grandes operaciones",
        descriptionSubtitle: "Soporte dedicado, SSO y controles avanzados.",
        totalSuffix: "/ mes",
        cta: "Hablar con ventas",
      },
    },
  },

  footer: {
    tagline:
      "Un boilerplate de producto limpio y sin marca. Tema, animaciones, internacionalización y modo claro/oscuro listos para que lo hagas tuyo.",
    navHeader: "Navegar",
    contatoHeader: "Contacto",
    contatoInvite:
      "¿Dudas o quieres adaptar este boilerplate? Escríbenos — este es un texto de ejemplo.",
    termos: "Términos de uso",
    privacidade: "Política de privacidad",
    acessar: "Abrir la app",
    whatsapp: "Hablar por WhatsApp",
    whatsappMessage: "¡Hola! Vine desde el sitio y me gustaría saber más.",
    copyright: "Una plantilla de ejemplo — reemplázala con tu propia marca.",
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
