/**
 * ==========================================================================
 * CONSTANTES GLOBALES Y CONFIGURACIÓN (constants.js)
 * FUENTE: RNF-002, RNF-005, RNF-007, RF-010, RF-012, §2.6
 * ==========================================================================
 */

export const SITE_CONFIG = {
  NOMBRE: "José Arnulfo Céspedes Albornoz",
  TITULO_CORTO: "José Céspedes",
  TITULO_PROFESIONAL: "Especialista en TI, Análisis de Datos y Seguridad",
  EMAIL: "cespedes.albornoz@gmail.com",
  TELEFONO: "+57 (300) 123-4567",
  UBICACION: "Bogotá, Colombia",
  CV_FILE: "public/documents/CV_Jose_Cespedes_2024.pdf",
  CV_MAX_SIZE_MB: 2,
  DOMAIN: "https://josecespedes.com",
  
  NAV_ITEMS: [
    { id: "inicio", label: "Inicio", href: "#inicio" },
    { id: "sobre-mi", label: "Sobre Mí", href: "#sobre-mi" },
    { id: "experiencia", label: "Experiencia", href: "#experiencia" },
    { id: "habilidades", label: "Habilidades", href: "#habilidades" },
    { id: "proyectos", label: "Proyectos", href: "#proyectos" },
    { id: "servicios", label: "Servicios", href: "#servicios" },
    { id: "educacion", label: "Educación", href: "#educacion" },
    { id: "testimonios", label: "Testimonios", href: "#testimonios" },
    { id: "contacto", label: "Contacto", href: "#contacto" }
  ],

  BREAKPOINTS: {
    MOBILE_MAX: 767,
    TABLET_MIN: 768,
    TABLET_MAX: 1023,
    DESKTOP_MIN: 1024,
    LARGE_DESKTOP_MIN: 1440
  },

  TOUCH_TARGET_MIN_PX: 44,
  MAX_CLICK_DEPTH: 3,

  EMAIL_CONFIG: {
    PROVIDER: "simulated", // 'simulated' | 'emailjs' | 'formspree'
    SERVICE_ID: "service_portfolio",
    TEMPLATE_ID: "template_contact",
    PUBLIC_KEY: "pk_live_portfolio_key"
  }
};
