# Manual de Usuario y Administración — Portafolio Profesional v2.0.1

> **Aplicación:** Portafolio Profesional Interactivo v2.0.1  
> **Titular:** José Arnulfo Céspedes Albornoz  
> **Autor del Manual:** Agentic Architecture Team  
> **Última actualización:** 2026-09-03  

---

## 1. Guía del Visitante (Navegación en la Landing Page)

La Landing Page ofrece una experiencia fluida, rápida y accesible estructurada en 10 secciones principales:

1. **Header Fijo**: Logotipo, menú de navegación rápida, botón **Modo Oscuro / Claro (🌙 / ☀️)** y descarga de CV.
2. **Hero (Inicio)**: Título profesional, resumen, CTAs (*Ver Proyectos*, *Contáctame*) y redes sociales.
3. **Sobre Mí (Biografía)**: Trayectoria, áreas de especialización y valores.
4. **Experiencia**: Línea de tiempo con roles, responsabilidades, logros y tecnologías.
5. **Habilidades**: Categorías técnicas con barras de dominio animadas al scroll.
6. **Proyectos**: Catálogo filtrable con tarjetas, enlaces **GitHub/GitLab**, demos y modales.
7. **Servicios**: Catálogo de consultoría con entregables y CTAs.
8. **Educación & Certificaciones**: Títulos y badges con credenciales digitales (Drive/OneDrive).
9. **Testimonios**: Reseñas con valoración 1–5 estrellas.
10. **Contacto**: Formulario con validación en tiempo real.

---

## 2. Guía del Administrador (Gestión Dinámica del Portafolio)

### 2.1 Acceso al Panel de Administración
1. Haz clic en el botón flotante **`🔐 Admin`** (esquina inferior derecha).
2. En el modal, ingresa:
   - **Usuario:** `Admin`
   - **Contraseña:** `Admin123`
3. Click **Iniciar Sesión** → notificación de bienvenida y carga del dashboard.

> El token JWT se guarda en `localStorage` (`portafolio_admin_token`) con expiración de 24 h. Usa **Cerrar Sesión** para invalidarlo localmente.

### 2.2 Gestión por Pestaña

#### 👤 Sobre Mí & Hero
- Edita nombre, título profesional, tagline, descripción breve, **profesión, edad, email, teléfono, celular**, biografía completa, **foto de perfil** y **CV** (URLs locales o cloud: Drive/OneDrive/Dropbox) y **🔗 URL LinkedIn** (alimenta Contacto > Red Profesional): Google Drive / OneDrive / Dropbox).
- **Guardar Cambios de Perfil** → `PUT /api/profile` + `PUT /api/about` → refresco reactivo de la landing.

#### 💼 Experiencia
- **Crear:** `+ Agregar Experiencia` → cargo, empresa, ubicación, modalidad (Híbrido/Remoto/Presencial), periodo inicio/fin, descripción, **responsabilidades** (una por línea), **logros** (uno por línea), **tecnologías** (coma). → `POST /api/experiences`.
- **Editar:** `✏️ Editar` en la tarjeta → el formulario se precarga (responsabilidades/logros/tecnologías) → `PUT /api/experiences/:id`.
- **Eliminar:** `🗑️ Borrar` → `DELETE /api/experiences/:id` con confirmación.

#### 🎯 Habilidades
- **Categorías:** `+ Nueva Categoría` → nombre, descripción, icono URL → `POST /api/skill-categories`. Edición con `✏️` y borrado `🗑️` (elimina en cascada las habilidades) → `PUT/DELETE /api/skill-categories/:id`.
- **Habilidades:** `+ Agregar Habilidad` dentro de cada categoría (pre-selecciona la categoría) o edición con `✏️` → nombre, categoría (select), nivel 0-100, años, icono → `POST /api/skills` / `PUT /api/skills/:id`. Borrado con `DELETE /api/skills/:id`.

#### 🚀 Proyectos & Demos
- `+ Agregar Proyecto` → título, categoría, descripciones, **GitHub/GitLab**, **demo**, **imagen cloud** (Drive/OneDrive/Dropbox), **video** (YouTube/Vimeo), tecnologías (coma), destacado → `POST /api/projects`.
- Editar con `✏️ Editar` (precarga por índice, tecnologías parseadas) → `PUT /api/projects/:id`. Borrar → `DELETE`.

#### 🛠️ Servicios
- `+ Agregar Servicio` → nombre, categoría, descripción, icono, **entregables** (líneas), CTA texto/destino → `POST /api/services`.
- Edición con `✏️ Editar` y borrado `🗑️` → `PUT/DELETE /api/services/:id`. Entregables se muestran como tags en la card.

#### 🎓 Educación & Diplomas
- Dos formularios: **Título** (`+ Título`: título, institución, año, estado, descripción) y **Certificación** (`+ Certificación`: nombre, entidad, año, **credencialUrl** cloud, badge) → `POST /api/education/degree` / `/cert`.
- Edición `✏️` y borrado `🗑️` por índice → `PUT /api/education/degree/:id` / `PUT /api/education/cert/:id` / `DELETE`.
- Las credenciales pueden ser URLs de Drive/OneDrive y se renderizan como `Credencial` badge.

#### 💬 Testimonios
- `+ Nuevo Testimonio` → recomendador, cargo, empresa, **foto URL** (Drive/OneDrive), valoración 1-5, relación, texto → `POST /api/testimonials`.
- Edición `✏️ Editar` y borrado `🗑️` → `PUT/DELETE /api/testimonials/:id`. Estrellas renderizadas con `⭐.repeat`.

#### 👥 Usuarios
- `+ Agregar Usuario` → username, email, rol (admin/editor), contraseña, activo → `POST /api/users`.
- Editar `✏️` carga `GET /api/users/:id` (usa `PUT /api/users/:id` y soporta cambio de rol/is_active y contraseña opcional). Borrar `🗑️` → `DELETE /api/users/:id` (bloquea eliminar último admin activo).

#### 📬 Mensajes & Redes
- Solo lectura: carga `GET /api/contact/messages` con Auth. Muestra nombre, email, asunto, mensaje, teléfono y fecha.

### 2.3 Datos demo incluidos para validar
Tras la instalación se crean 6 registros con sufijo **“— Demo”** (1 experiencia QA, 1 categoría + 1 habilidad Playwright, 1 servicio QA, 1 título MSc, 1 cert ISTQB, 1 testimonio) visibles en cada pestaña. Son **editables y eliminables** para que valides el flujo sin crear datos desde cero. Si los borras, créalos de nuevo desde los formularios.

---

## 3. Selector de Temas (Dark / Light Mode)

- Toggle sol/luna (☀️ / 🌙) en el Header.
- Usa `document.documentElement.setAttribute("data-theme", ...)` con tokens en `src/css/variables.css` (`[data-theme="light"]`).
- Persistencia en `localStorage` (`portafolio_tema`); el usuario visitante ve el mismo tema al volver.

---

## 4. Respaldo y Mantenimiento

- DB SQLite en `data/portafolio.db` (WAL). Copia el archivo para backup.
- Restaurar fábrica: `node data/init-db.js` (borra y re-siembra desde `src/js/data/*.json` + usuario Admin).
- Health: `GET /health` → `{ status:"OK", version:"2.0.0", database:"...Connected" }`.
- Contenido unificado: `GET /api/content/all` (profile, about, experience, skills, projects, services, education, testimonials, users, theme) — usado por el frontend y por el panel.

---

## 5. Refresco instantáneo tras editar (v2.0.2)

Tras guardar, editar o borrar en cualquier pestaña, la **landing se actualiza al instante sin recargar la página ni cerrar el panel**. La experiencia nueva aparece **primero** (más reciente → antigua), y las imágenes/credenciales cloud (Drive/OneDrive/Dropbox) y email/teléfono se reflejan en Hero/Contacto en el mismo segundo. Si no ves el cambio, verifica que el Toast diga `¡... guardado!` y que el servidor siga en `http://localhost:3000`.

## 6. Solución de Problemas

- **Pantalla blanca / SyntaxError AdminPanel.js:1023**: recarga con `Ctrl+F5`; el bug de `try/catch` ya está corregido en v2.0.1.
- **Login falla**: verifica que el servidor esté corriendo `npm start` en `http://localhost:3000` y que uses `Admin` / `Admin123` (case-sensitive).
- **Cambios no se ven**: el panel hace `RepositorioContenido.invalidarCache()` y `cargarYRenderDashboard()`; si persiste, borra `localStorage` y recarga.
