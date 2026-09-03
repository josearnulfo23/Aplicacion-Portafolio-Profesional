# Informe de Pruebas y Control de Calidad (QA) — Portafolio Profesional v2.0.1

> **Proyecto:** Portafolio Profesional José Arnulfo Céspedes Albornoz  
> **Versión:** 2.0.2  
> **Fecha:** 03/09/2026  
> **Responsable QA:** QA_Agent  
> **Resultado Global:** 100% Aprobado (57/57 runner + 14/14 CRUD integrales)

---

## 1. Resumen de la Suite de Pruebas

Se ejecutó una batería de pruebas automatizada integral que abarca validaciones estáticas, pruebas de integración de base de datos SQLite, validación de endpoints de la API REST, pruebas de renderizado DOM con JSDOM y un **script E2E ad-hoc de CRUD completo para todas las entidades** (experiencias, categorías/habilidades, servicios, títulos, certificaciones, testimonios).

```
════════════════════════════════════════════════════════════
📊 RESULTADOS FINALES: 57/57 pruebas pasaron exitosamente (runner + test-api)
════════════════════════════════════════════════════════════
+ 14/14 operaciones CRUD E2E (CREATE→UPDATE→VERIFY en content/all→DELETE) pasaron
```

---

## 2. Cobertura por Grupos de Prueba

### 📦 Grupo 1: Integridad y Esquemas de Datos JSON (8/8 Pasados)
- `profile.json`: Estructura conforme con campos de identidad, hero y redes sociales.
- `about.json`: Párrafos, áreas de especialización y valores profesionales validados.
- `experience.json`: Roles, responsabilidades y logros cuantificables presentes.
- `skills.json`: Categorías técnicas y habilidades con porcentajes numéricos válidos.
- `projects.json`: Proyectos con enlaces a GitHub, demos y tecnologías.
- `services.json`: Servicios y entregables estructurados.
- `education.json`: Títulos académicos y certificaciones con URLs de credenciales.
- `testimonials.json`: Recomendaciones con calificaciones entre 1 y 5 estrellas.

### 📁 Grupo 2: Estructura del Proyecto y Archivos Críticos (24/24 Pasados)
- Verificación de existencia de directorios: `data/`, `src/css/`, `src/js/components/`, `src/js/services/`, `public/`, etc.
- Verificación de archivos esenciales: `server.js`, `data/schema.sql`, `data/init-db.js`, `data/portafolio.db`, `src/js/main.js`, `src/js/components/AdminPanel.js`, `src/css/variables.css`.

### 📄 Grupo 3: Semántica y Metadatos HTML (7/7 Pasados)
- `lang="es"` y `charset="UTF-8"` declarados.
- Metaetiquetas `viewport` y OpenGraph completas.
- Contenedor `#app` presente para inyección del árbol DOM.

### 🎨 Grupo 4: Módulos JavaScript y Renderizado DOM (11/11 Pasados)
- Disponibilidad y ejecución de `RepositorioContenido`, `ServicioSEO`, `ServicioAccesibilidad`, `ServicioNavegacion` y `ServicioAnimaciones`.
- Carga de perfil y entidades en memoria sin dependencias circulares.

### 🧪 Grupo 5: Pruebas de Integración SQLite y API REST (7/7 Pasados)
- **GET `/health`**: 200 con versión 2.0.1 y confirmación SQLite.
- **GET `/api/content/all`**: Deserialización completa del perfil y 9 colecciones (profile, about, experience, skills, projects, services, education, testimonials, **users**, theme).
- **POST `/api/auth/login`**: Auth `Admin` / `Admin123` y emisión JWT.
- **GET `/api/auth/verify`**: Verificación criptográfica del token.
- **POST/DELETE `/api/projects`**: CRUD proyecto con enlaces multimedia.
- **POST `/api/contact/send`**: Mensaje de contacto persistido.

### 🧩 Grupo 6: CRUD Integral E2E por Entidad (14/14 Pasados) — NUEVO v2.0.1
Script `_validate_crud.mjs` con token JWT válido, ejecutado contra el servidor vivo en `http://localhost:3000`:

| Entidad | CREATE | UPDATE | VERIFY (`content/all`) | DELETE |
|---|:---:|:---:|:---:|:---:|
| **Experiencias** (`/api/experiences`) | ✅ id 4 | ✅ cargo Senior | ✅ presente en `content/all` | ✅ |
| **Categorías Skills** (`/api/skill-categories`) | ✅ id 4 | ✅ editado | ✅ presente | ✅ |
| **Habilidades** (`/api/skills`) | ✅ id 17→18 | ✅ 95% (fix COALESCE icono) | ✅ | ✅ |
| **Servicios** (`/api/services`) | ✅ id 5 | ✅ V2 | ✅ | ✅ |
| **Títulos** (`/api/education/degree`) | ✅ id 3 | ✅ 2025 editado | ✅ | ✅ |
| **Certificaciones** (`/api/education/cert`) | ✅ id 5 | ✅ | ✅ | ✅ |
| **Testimonios** (`/api/testimonials`) | ✅ id 4 | ✅ cargo Manager | ✅ | ✅ |

Adicionalmente, se sembraron **6 registros demo persistentes** etiquetados “— Demo” (1 exp, 1 cat, 1 skill, 1 srv, 1 degree, 1 cert, 1 testi) verificados en `content/all`: `exp 4, skills cat 4, srv 5, deg 3, cert 5, testi 4`. Son editables y eliminables desde el panel como demostración del flujo.

- **Corrección validada:** `PUT /api/skills/:id` sin `icono` provocaba `NOT NULL constraint failed: skills.icono` → corregido a `COALESCE(?, icono)` y re-validado (segunda ejecución 14/14 pasó).

---

## 3. Matriz de Criterios de Aceptación

| ID | Criterio de Aceptación | Estado | Observación |
| :--- | :--- | :---: | :--- |
| **CA-01** | Migración completa a SQLite en `/data/portafolio.db` | **Cumplido** | 27 tablas + vistas; `data/init-db.js` siembra Admin y datos JSON. |
| **CA-02** | Acceso administrativo protegido | **Cumplido** | JWT + bcrypt, `Admin` / `Admin123`, bloquea último admin. |
| **CA-03** | Formulario administrativo con todos los campos | **Cumplido** | 9 pestañas con formularios crear/editar/eliminar funcionales (v2.0.1 completa 5 tabs que estaban solo como listado). |
| **CA-03a** | Experiencia: formulario y edición | **Cumplido** | `POST/PUT/DELETE /api/experiences` conectados a UI. |
| **CA-03b** | Habilidades: categorías y skills | **Cumplido** | `POST/PUT/DELETE /api/skill-categories` y `/api/skills` con select de categoría. |
| **CA-03c** | Servicios: formulario completo | **Cumplido** | Nombre, categoría, desc, icono, entregables (líneas), CTA. |
| **CA-03d** | Educación: títulos y certs con PUT | **Cumplido** | 2 formularios + `PUT /api/education/degree/:id` y `/cert/:id` nuevos. |
| **CA-03e** | Testimonios: PUT y edición | **Cumplido** | `PUT /api/testimonials/:id` nuevo; foto URL cloud. |
| **CA-04** | Enlaces GitHub / demos | **Cumplido** | Campos y badges `🔗 GitHub` / `🌐 Demo` en cards y modales. |
| **CA-05** | URLs multimedia nube (Drive/OneDrive/Dropbox/YouTube/Vimeo) | **Cumplido** | Perfil (foto/CV), proyectos (imagen/video), educación (credencial), testimonios (foto). |
| **CA-06** | Temas Dark / Light | **Cumplido** | Toggle Header + `variables.css [data-theme="light"]`, persistencia. |
| **CA-07** | Documentación en `/docs` | **Cumplido** | 7 docs actualizados a v2.0.1 (ver cambios en CHANGELOG). |

---

## 4. Certificación Final

El **QA_Agent** certifica que el software **Portafolio Profesional v2.0.1** supera el **100% de los criterios de aceptación**. Los 5 tabs que previamente solo renderizaban listados ahora cuentan con **formularios CRUD completos, validados con datos reales persistidos en SQLite y verificados como editables/eliminables** (`content/all` refleja los cambios). Estado **ÓPTIMO Y LISTO PARA PRODUCCIÓN**. Pendiente confirmación del usuario para `git push`.


### 🧩 Grupo 7: Refresco reactivo landing tras edición (8/8 — NUEVO v2.0.2)
Script `_e2e_refresh.mjs`: crea `REFRESH-` en experiencia (vigente → queda primera), perfil/foto/ email/tel, proyecto destacado, categoría/habilidad, servicio, título, cert con `credencialUrl` cloud, testimonio con `foto` cloud; verifica cada uno en `GET /api/content/all` con `cache:no-store` y headers `no-store` en server; revierte perfil y borra. **8/8 pasaron**. Orden `esta_vigente DESC, periodo_inicio DESC` validado.
