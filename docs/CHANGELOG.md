# Control de Cambios (Changelog) — Portafolio Profesional

Todas las modificaciones notables realizadas en este proyecto se documentan en este archivo siguiendo el formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/) y [Semantic Versioning](https://semver.org/lang/es/).

---

## [2.0.1] - 2026-09-03 — Formularios CRUD completos para todas las secciones

### ✅ Corregido (Fixed)
- `AdminPanel.js:1023` `SyntaxError: Missing catch or finally after try` — bloque `try/catch` mal cerrado (`});` → `}`).
- `Identifier 'userForm' has already been declared` — segundo `const userForm` renombrado a `userFormEl`.
- `switch renderActiveTab` malformado (`case "users":` pegado a `default:`) → separado y formateado.
- HTML roto en `renderProfileTab` (`<textarea descripcionBreve` sin `</div>` y `</div>` duplicado) → estructura corregida.
- Payload `PUT /api/profile` incompleto — ahora persiste `profesion, edad, email, telefono, numeroCelular`.
- `GET /api/content/all` `perfilData` incompleto y `users` consultado pero no retornado → ambos incluidos.
- `server.js` cabecera `// USERS ENDPOINTS// ===app.get` sin saltos de línea → reescrito limpio.
- `PUT /api/skills/:id` `NOT NULL constraint failed: skills.icono` → actualizado a `COALESCE` para permitir updates parciales.
- `.gitignore` no excluía `*.db-shm / *.db-wal / server.log` → añadido y `data/portafolio.db-shm|wal` removidos del índice con `git rm --cached`.

### ✨ Añadido (Added) — Formularios faltantes completados
- **Experiencia (💼)**: Formulario crear/editar con cargo, empresa, ubicación, modalidad, periodo inicio/fin, descripción, responsabilidades (línea por línea), logros y tecnologías (coma). Acciones Editar/Eliminar con confirmación; `POST /api/experiences`, `PUT /api/experiences/:id`, `DELETE /api/experiences/:id` ya existían y ahora están conectados.
- **Habilidades (🎯)**: 
  - Nuevo formulario **Categoría** (`+ Nueva Categoría`) → `POST/PUT/DELETE /api/skill-categories` y `DELETE` en cascada de skills.
  - Formulario **Habilidad** (`+ Agregar Habilidad` / ✏️ Editar) → categoría select, nivel 0-100, años experiencia, icono. Endpoints `POST /api/skills`, `PUT /api/skills/:id` (corregido), `DELETE /api/skills/:id`.
  - UI agrupada por categoría con vacíos explícitos y edición inline.
- **Servicios (🛠️)**: Formulario crear/editar con nombre, categoría, descripción, icono, entregables (línea), CTA texto/destino. Botón `+ Agregar Servicio` + ✏️ Editar en cada card. Endpoints `POST/PUT/DELETE /api/services` conectados.
- **Educación (🎓)**: Formularios separados **Título** y **Certificación** (`+ Título` / `+ Certificación`) con título, institución/entidad, año, estado/credencialUrl, badge. Botones ✏️ Editar (carga por índice) y 🗑️ Borrar. Nuevos endpoints `PUT /api/education/degree/:id` y `PUT /api/education/cert/:id` añadidos en `server.js`.
- **Testimonios (💬)**: Formulario crear/editar (`+ Nuevo Testimonio`) con recomendador, cargo, empresa, foto URL (Drive/OneDrive), valoración 1-5, relación profesional y texto. Nuevo endpoint `PUT /api/testimonials/:id` añadido.
- **Seed demo persistente**: 6 registros demo etiquetados “— Demo” (1 experiencia, 1 categoría, 1 habilidad, 1 servicio, 1 título, 1 cert, 1 testimonio) insertados y visibles en `GET /api/content/all`, editables y eliminables desde el panel para que el evaluador valide el flujo sin crear datos desde cero.

### 🔧 Cambiado (Changed)
- `AdminPanel.js` `vincularEventosTabActivo`: +420 líneas de handlers para los 5 tabs que antes solo tenían `render` sin eventos. Todos los formularios hacen `fetch` con `Authorization: Bearer <JWT>`, `Toast`, `RepositorioContenido.invalidarCache()` y `cargarYRenderDashboard()` para refresco reactivo.
- `server.js`: 4 nuevos endpoints PUT y 3 endpoints de categorías de skills; `PUT /api/skills` ahora tolera payloads parciales.

### ✅ Validación
- Script E2E `_validate_crud.mjs`: CREATE → UPDATE → VERIFY en `content/all` → DELETE para las 7 entidades (14 operaciones) → **14/14 pasaron**; persistido seed demo → `exp 4, skills cat 4, srv 5, deg 3, cert 5, testi 4`.
- `npm test` → **57/57** pasaron (suite runner + test-api). Servidor recargado y `GET /health` OK.

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
  - Interfaz de gestión completa con pestañas para **Sobre Mí**, **Experiencia**, **Habilidades**, **Proyectos**, **Servicios**, **Educación**, **Testimonios**, **Usuarios** y **Buzón de Mensajes**.
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
