# Control de Cambios (Changelog) — Portafolio Profesional

Todas las modificaciones notables realizadas en este proyecto se documentan en este archivo siguiendo el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.0] - 2026-09-03 (Versión Dinámica con SQLite y Panel Admin)

### 🚀 Novedades Principales (Added)
- **Base de Datos Relacional SQLite 3 (`data/portafolio.db`)**:
  - Implementación de motor SQLite relacional embebido mediante `better-sqlite3`.
  - Creación de 27 tablas relacionales normalizadas (3NF) con claves foráneas, restricciones de integridad e índices.
  - Vistas SQL optimizadas (`vw_profile_complete`, `vw_experience_full`, `vw_projects_full`, `vw_admin_stats`).
  - Script de migración inicial automática (`data/init-db.js`) desde JSON estáticos a SQLite.
- **Panel de Administración Integral (`AdminPanel.js`)**:
  - Módulo de autenticación con JSON Web Tokens (JWT) y cifrado de contraseñas con `bcryptjs`.
  - Usuario administrador por defecto configurado (`Admin` / `Admin123`).
  - Formulario de login en modal flotante accesible mediante botón flotante discreto.
  - Interfaz de gestión completa con pestañas para **Sobre Mí**, **Experiencia**, **Habilidades**, **Proyectos**, **Servicios**, **Educación**, **Testimonios** y **Buzón de Mensajes**.
- **Gestión Multimedia en la Nube**:
  - Soporte en formularios y componentes para enlaces externos a **Google Drive, OneDrive y Dropbox** (foto de perfil, diplomas, capturas).
  - Integración de enlaces de video de **YouTube y Vimeo**.
  - Campos dedicados para enlaces a repositorios en **GitHub y GitLab**.
- **Selector de Temas (Dark / Light Mode)**:
  - Sistema de tokens CSS con soporte completo para Tema Oscuro y Tema Claro.
  - Toggle interactivo en el Header con persistencia en `localStorage`.
- **Servidor Backend API REST (`server.js`)**:
  - Endpoints CRUD para todas las entidades del portafolio.
  - Endpoint unificado `/api/content/all` para consumo eficiente del frontend.
  - Endpoint `/api/contact/send` y `/api/contact/messages` para recepción y consulta de mensajes de visitantes.
- **Organización Centralizada de Documentación (`/docs`)**:
  - Creación de la carpeta `/docs/` con manuales, esquemas de BD, control de cambios, informes y justificación técnica.

### 🔄 Modificaciones y Mejoras (Changed)
- **Repositorio de Contenido (`RepositorioContenido.js`)**:
  - Refactorizado para consultar la API REST SQLite en tiempo de ejecución con fallback automático a archivos JSON locales.
- **Entrada Principal (`main.js`)**:
  - Integración del ciclo de vida del `AdminPanel` y callback de recarga reactiva de la aplicación tras modificaciones administrativas.
- **Suite de Pruebas (`tests/runner.js` y `tests/test-api.mjs`)**:
  - Ampliación de la cobertura de pruebas a 57 tests con validación de API, autenticación, SQLite y DOM.

### 🔒 Seguridad (Security)
- Cifrado unidireccional de contraseñas administrativas con salting de 10 rondas (`bcryptjs`).
- Protección de endpoints de modificación mediante middleware JWT y validación de rol `admin`.
- Protección de cabeceras HTTP mediante `helmet` y políticas de sanitización en peticiones POST.

---

## [1.0.0] - 2026-08-21 (Versión Inicial Estática)

### 🚀 Novedades Iniciales
- Landing page estructurada en Vanilla JavaScript ES6+ sin dependencias de frameworks pesados.
- Arquitectura modular con 9 secciones semánticas según especificación y pseudocódigo PS-07.
- Modelo de datos basado en archivos JSON estáticos con validación JSON Schema Draft-07.
- Sistema de diseño CSS con Dark Mode, variables HSL y animaciones aceleradas por hardware.
- Cumplimiento de accesibilidad WCAG 2.1 AA y optimización SEO con metadatos OpenGraph y Schema.org JSON-LD.
