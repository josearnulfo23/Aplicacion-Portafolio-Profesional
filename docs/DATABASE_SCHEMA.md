# Diccionario y Arquitectura de Base de Datos SQLite — Portafolio Profesional v2.0

> **Autor:** José Arnulfo Céspedes Albornoz  
> **Motor:** SQLite 3 (`better-sqlite3`)  
> **Ubicación del archivo:** `data/portafolio.db`  
> **Script de inicialización:** `data/init-db.js`  
> **Script DDL:** `data/schema.sql`  

---

## 1. Justificación y Argumentación del Modelo de Datos

En la versión 1.0, el portafolio profesional utilizaba datos estáticos en formato JSON. Si bien esto garantizaba rapidez inicial, presentaba la limitación crítica de que cualquier actualización de proyectos, nuevas certificaciones, ascensos o testimonios requería editar código fuente y desplegar nuevamente.

Para la **versión 2.0**, se adoptó **SQLite 3** como motor de base de datos relacional embebido por las siguientes razones:
1. **Dinamicidad Total**: Permite operaciones CRUD (Crear, Leer, Actualizar, Eliminar) en tiempo real sin reiniciar el servidor.
2. **Integridad Referencial y Consistencia ACID**: Claves foráneas con eliminación en cascada (`ON DELETE CASCADE`) y restricciones `NOT NULL`, `UNIQUE` y `CHECK`.
3. **Alto Rendimiento y Cero Latencia**: Al ser un motor embebido que corre en el mismo proceso de Node.js, las consultas toman submilisegundos (< 1 ms).
4. **Portabilidad y Respaldo Fácil**: Toda la base de datos reside en un único archivo (`data/portafolio.db`), facilitando backups automáticos y control de versiones.

---

## 2. Diagrama Entidad-Relación y Tablas Principales

```
[ users ] ── (1:1) ──> [ profiles ] ── (1:N) ──> [ social_networks ]
                             │
                             ├── (1:1) ──> [ bios ] ── (1:N) ──> [ bio_paragraphs ]
                             │                            ├── (1:N) ──> [ specializations ]
                             │                            ├── (1:N) ──> [ professional_values ]
                             │                            └── (1:N) ──> [ key_statistics ]
                             │
                             ├── (1:N) ──> [ experiences ] ── (1:N) ──> [ responsibilities ]
                             │                                  ├── (1:N) ──> [ achievements ]
                             │                                  └── (1:N) ──> [ experience_techs ]
                             │
                             ├── (1:N) ──> [ skill_categories ] ── (1:N) ──> [ skills ]
                             │
                             ├── (1:N) ──> [ projects ] ── (1:N) ──> [ project_techs ]
                             │                               ├── (1:N) ──> [ project_results ]
                             │                               └── (1:N) ──> [ project_metrics ]
                             │
                             ├── (1:N) ──> [ services ]
                             ├── (1:N) ──> [ academic_degrees ]
                             ├── (1:N) ──> [ certifications ]
                             └── (1:N) ──> [ testimonials ]

[ contacts ] (Buzón de mensajes recibidos de visitantes)
[ theme_config ] (Configuración de tema activo y colores)
```

---

## 3. Diccionario de Tablas y Atributos

### 3.1 Tabla `users` (Administradores del Sistema)
| Columna | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | Identificador único del usuario. |
| `username` | `TEXT` | `NOT NULL UNIQUE` | Nombre de usuario (ej. `Admin`). |
| `email` | `TEXT` | `NOT NULL UNIQUE` | Correo electrónico del administrador. |
| `password_hash` | `TEXT` | `NOT NULL` | Hash seguro generado con bcrypt (costo 10). |
| `role` | `TEXT` | `NOT NULL DEFAULT 'admin'` | Rol en el sistema (`admin`, `editor`). |
| `is_active` | `INTEGER` | `NOT NULL DEFAULT 1` | Estado de activación (1=Activo, 0=Inactivo). |
| `created_at` | `TEXT` | `DEFAULT (datetime('now'))` | Fecha de creación. |
| `updated_at` | `TEXT` | `DEFAULT (datetime('now'))` | Fecha de última actualización. |

### 3.2 Tabla `profiles` (Información Personal del Titular)
| Columna | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | ID único de perfil. |
| `nombre_completo` | `TEXT` | `NOT NULL` | Nombre del profesional. |
| `titulo_profesional` | `TEXT` | `NOT NULL` | Título y especialidad principal. |
| `tagline` | `TEXT` | `NOT NULL` | Frase destacada / lema profesional. |
| `descripcion_breve` | `TEXT` | `NOT NULL` | Resumen para la sección Hero. |
| `foto_perfil` | `TEXT` | `NOT NULL` | URL de la foto (local o cloud: Drive, OneDrive, Dropbox). |
| `cv_archivo` | `TEXT` | - | Enlace a descarga del currículum vitae en PDF. |
| `created_at` | `TEXT` | `DEFAULT (datetime('now'))` | Fecha de registro. |
| `updated_at` | `TEXT` | `DEFAULT (datetime('now'))` | Fecha de última edición. |

### 3.3 Tabla `projects` (Portafolio de Proyectos)
| Columna | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | ID del proyecto. |
| `titulo` | `TEXT` | `NOT NULL` | Título del proyecto. |
| `subtitulo` | `TEXT` | - | Subtítulo descriptivo. |
| `categoria` | `TEXT` | `NOT NULL` | Categoría (Desarrollo Web, Analítica, Seguridad). |
| `descripcion_breve` | `TEXT` | `NOT NULL` | Resumen para la tarjeta de previsualización. |
| `descripcion_detallada` | `TEXT` | - | Descripción completa y caso de estudio. |
| `imagen_representativa` | `TEXT` | - | URL de imagen en la nube (Drive, Dropbox, OneDrive). |
| `enlace_demo` | `TEXT` | - | URL de demostración en vivo. |
| `enlace_github` | `TEXT` | - | URL al repositorio en GitHub o GitLab. |
| `destacado` | `INTEGER` | `DEFAULT 0` | Bandera de proyecto destacado (1=Sí, 0=No). |

### 3.4 Tabla `experiences` (Experiencia Laboral)
| Columna | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | ID de la experiencia. |
| `cargo` | `TEXT` | `NOT NULL` | Cargo o rol desempeñado. |
| `empresa` | `TEXT` | `NOT NULL` | Organización o empresa. |
| `ubicacion` | `TEXT` | - | Ciudad y país. |
| `modalidad` | `TEXT` | `DEFAULT 'Híbrido'` | Modalidad (`Remoto`, `Híbrido`, `Presencial`). |
| `periodo_inicio` | `TEXT` | `NOT NULL` | Fecha de inicio (`MM/AAAA`). |
| `periodo_fin` | `TEXT` | `DEFAULT 'Presente'` | Fecha de finalización o `Presente`. |
| `esta_vigente` | `INTEGER` | `DEFAULT 0` | Indicador de empleo actual (1=Vigente, 0=Finalizado). |
| `descripcion` | `TEXT` | `NOT NULL` | Descripción de responsabilidades globales. |

### 3.5 Tablas de Habilidades (`skill_categories` & `skills`)
* `skill_categories`: `id`, `nombre_categoria`, `descripcion`, `icono`, `orden`.
* `skills`: `id`, `categoria_id` (FK), `nombre`, `icono`, `nivel_dominio` (0-100), `anios_experiencia`, `certificaciones`.

### 3.6 Tablas de Formación (`academic_degrees` & `certifications`)
* `academic_degrees`: `id`, `titulo_academico`, `institucion`, `anio`, `estado`, `descripcion`.
* `certifications`: `id`, `nombre`, `entidad_certificadora`, `anio`, `credencial_url`, `badge_digital`.

### 3.7 Tabla `contacts` (Buzón de Mensajes Web)
| Columna | Tipo | Restricción | Descripción |
| :--- | :--- | :--- | :--- |
| `id` | `INTEGER` | `PRIMARY KEY AUTOINCREMENT` | ID del mensaje. |
| `nombre` | `TEXT` | `NOT NULL` | Nombre del remitente. |
| `email` | `TEXT` | `NOT NULL` | Correo del remitente. |
| `telefono` | `TEXT` | - | Teléfono de contacto. |
| `asunto` | `TEXT` | - | Asunto del mensaje. |
| `mensaje` | `TEXT` | `NOT NULL` | Cuerpo del mensaje. |
| `respondido` | `INTEGER` | `DEFAULT 0` | Estado de lectura/respuesta. |
| `created_at` | `TEXT` | `DEFAULT (datetime('now'))` | Timestamp de recepción. |

---

## 4. Vistas SQL (Views)

* **`vw_profile_complete`**: Consolida datos del perfil y conteo de redes sociales activas.
* **`vw_experience_full`**: Agrupa experiencia laboral junto con responsabilidades, logros y tecnologías en strings concatenados.
* **`vw_projects_full`**: Retorna proyectos con tecnologías, resultados y métricas de impacto calculadas.
* **`vw_admin_stats`**: Vista resumen de estadísticas generales para el panel de control del administrador.

---

## 5. Procedimientos y Endpoints CRUD

| Entidad | CREATE (POST) | READ (GET) | UPDATE (PUT) | DELETE (DELETE) |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | - | `/api/auth/verify` | `/api/auth/login` | - |
| **Contenido Unificado** | - | `/api/content/all` | - | - |
| **Perfil** | - | `/api/profile` | `/api/profile` | - |
| **Sobre Mí** | - | - | `/api/about` | - |
| **Experiencias** | `/api/experiences` | `/api/content/all` | `/api/experiences/:id` | `/api/experiences/:id` |
| **Habilidades** | `/api/skills` | `/api/content/all` | `/api/skills/:id` | `/api/skills/:id` |
| **Proyectos** | `/api/projects` | `/api/content/all` | `/api/projects/:id` | `/api/projects/:id` |
| **Servicios** | `/api/services` | `/api/content/all` | `/api/services/:id` | `/api/services/:id` |
| **Educación** | `/api/education/degree` | `/api/content/all` | - | `/api/education/degree/:id` |
| **Certificaciones** | `/api/education/cert` | `/api/content/all` | - | `/api/education/cert/:id` |
| **Testimonios** | `/api/testimonials` | `/api/content/all` | - | `/api/testimonials/:id` |
| **Contacto** | `/api/contact/send` | `/api/contact/messages` | - | - |
| **Tema** | - | `/api/theme` | `/api/theme` | - |
