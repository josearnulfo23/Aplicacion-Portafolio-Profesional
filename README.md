# Portafolio Profesional — José Arnulfo Céspedes Albornoz

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![HTML5](https://img.shields.io/badge/HTML5-Semántico-orange.svg)](https://developer.mozilla.org/es/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design%20System-blue.svg)](https://developer.mozilla.org/es/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6%2B%20Modular-yellow.svg)](https://developer.mozilla.org/es/docs/Web/JavaScript)
[![WCAG](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-green.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Landing Page web interactiva, moderna y orientada a datos (Data-Driven)** para el posicionamiento profesional de **José Arnulfo Céspedes Albornoz**, especialista interdisciplinario en Tecnologías de la Información, Análisis de Datos y Sistemas de Seguridad.

---

## 🌟 Características Principales

- ⚡ **Rendimiento Excepcional**: Arquitectura ligera sin sobrecarga de frameworks (FCP < 0.8s, LCP < 1.2s, Lighthouse > 90).
- 🎨 **Estética Visual Premium**: Tema Dark Mode refinado con glassmorphism, paleta HSL balanceada, tipografía Google Fonts (*Outfit* y *Inter*) y micro-interacciones suaves.
- 📊 **Arquitectura Data-Driven**: Todo el contenido se gestiona desde archivos JSON regulados por **JSON Schemas Draft-07** formales.
- 📱 **Diseño 100% Responsivo**: Adaptación fluida para Mobile (320px-767px), Tablet (768px-1023px), Desktop (1024px-1440px) y Large Desktop (>1440px).
- ♿ **Accesibilidad WCAG 2.1 AA**: Contraste 5.2:1+, navegación completa por teclado, ARIA roles, focus trapping en modales y textos alternativos.
- 🔍 **SEO & Social Share Ready**: Estructura semántica HTML5, metadatos OpenGraph, Twitter Cards, Schema.org JSON-LD para `Person` y `ProfessionalService`.
- 📬 **Formulario de Contacto Seguro**: Validación en cliente y servidor simulada, sanitización anti-XSS y protección CSRF.
- 📄 **Descarga Directa de CV**: Acceso optimizado al currículum en PDF en múltiples ubicaciones estratégicas.

---

## 🏗️ Estructura del Proyecto

```
proyecto-landig-page/
├── index.html                   # Punto de entrada semántico HTML5
├── src/
│   ├── css/                     # Sistema de diseño CSS modular
│   │   ├── variables.css        # Tokens de diseño y variables HSL
│   │   ├── base.css             # Resets, tipografía y accesibilidad
│   │   ├── layout.css           # Header sticky, grid, footer
│   │   ├── components.css       # Tarjetas, botones, modal, timeline, tabs
│   │   ├── sections.css         # Estilos específicos de las 9 secciones
│   │   └── animations.css       # Animaciones CSS aceleradas por GPU
│   └── js/
│       ├── main.js              # Punto de entrada y orquestador JS
│       ├── config/              # Constantes de configuración
│       ├── data/                # Datos estructurados JSON
│       ├── schemas/             # JSON Schemas Draft-07
│       ├── domain/              # Entidades del modelo de negocio
│       ├── services/            # Servicios transversales (Validación, SEO, etc.)
│       └── components/          # Renderizadores de componentes de UI
├── public/                      # Assets públicos (imágenes, documentos, iconos)
├── tests/                       # Suites de pruebas automatizadas y unitarias
├── MANUAL_DE_USO.md             # Manual completo de personalización
├── JUSTIFICACION_TECNOLOGICA.md # Argumentación técnica del stack
├── INFORME_DESARROLLO.md        # Reporte de desarrollo y code review
├── INFORME_PRUEBAS.md           # Informe de QA y criterios de aceptación
├── LICENSE                      # Licencia Open Source MIT
└── package.json                 # Scripts de desarrollo y pruebas
```

---

## 🚀 Inicio Rápido

### Opción 1: Con scripts automáticos
- **Windows**: Ejecutar `.\init.bat`
- **Linux/macOS**: Ejecutar `./init.sh`

### Opción 2: Con NPM
```bash
# Instalar dependencias para el servidor de desarrollo local y pruebas
npm install

# Iniciar servidor local
npm run dev

# Ejecutar pruebas automatizadas de QA
npm test
```

---

## 🧪 Pruebas y Validación de Calidad

Ejecuta la suite de pruebas unitarias y de validación de esquemas:
```bash
npm test
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE) - consulta el archivo LICENSE para más detalles.
