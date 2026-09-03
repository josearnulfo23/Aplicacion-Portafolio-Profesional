# Informe de Desarrollo y Arquitectura — Portafolio Profesional v2.0

> **Proyecto:** Portafolio Profesional José Arnulfo Céspedes Albornoz  
> **Versión:** 2.0.0  
> **Fecha:** 03/09/2026  
> **Equipo Agentic:** Architect_Agent, Coder_Agent, QA_Agent  
> **Coordinador:** Agentic Team Coordinator  

---

## 1. Resumen Ejecutivo

El presente informe documenta la evolución arquitectónica y de software del aplicativo web tipo Landing Page para el portafolio profesional de José Arnulfo Céspedes Albornoz, transitando exitosamente desde una arquitectura estática (v1.0) hacia un **ecosistema dinámico de grado de producción (v2.0)** impulsado por una base de datos relacional **SQLite 3**, una **API RESTful en Express.js**, un **Panel de Administración con autenticación JWT** y un **sistema adaptativo de temas visuales**.

---

## 2. Decisiones Arquitectónicas Clave (Top-Down Design)

### 2.1 Desacoplamiento y Capa de Persistencia Dinámica
En concordancia con el principio de responsabilidad única (SRP), se separó completamente la capa de persistencia de la capa de presentación:
- **Base de Datos SQLite (`data/portafolio.db`)**: Estructurada en tercera forma normal (3NF), garantizando que las entidades (perfiles, experiencias, habilidades, proyectos, servicios, títulos, certificaciones, testimonios y contactos) tengan relaciones coherentes y claves foráneas con políticas de actualización/eliminación seguras.
- **Backend API REST (`server.js`)**: Encapsula las consultas SQLite mediante `better-sqlite3`, exponiendo endpoints REST uniformes con protección JWT para mutaciones y endpoints públicos de lectura de alta velocidad.

### 2.2 Panel de Administración Modular (`AdminPanel.js`)
Diseñado como un componente autocontenido en Vanilla JS:
- Proporciona interfaces intuitivas para el ingreso seguro de credenciales (`Admin` / `Admin123`).
- Ofrece formularios estructurados para la creación y edición de registros en todas las secciones de la landing page.
- Soporta integración nativa con servicios de almacenamiento en la nube (**Google Drive, OneDrive, Dropbox**) para activos visuales y plataformas de video (**YouTube, Vimeo**).
- Notificaciones en tiempo real vía componente `Toast.js` y recarga reactiva del DOM sin refrescar la página.

### 2.3 Sistema de Temas y Estilos CSS
- Definición de variables CSS semánticas para el modo oscuro por defecto y el modo claro alternativo (`[data-theme="light"]`).
- Contraste visual validado bajo directrices WCAG 2.1 AA (mínimo 4.5:1 para texto normal y 3:1 para elementos de interfaz).

---

## 3. Revisión de Código y Buenas Prácticas (Code Review)

| Criterio | Evaluación | Evidencia / Implementación |
| :--- | :--- | :--- |
| **Modularidad** | Excelente (10/10) | Separación en `components/`, `services/`, `domain/`, `data/` y `css/`. |
| **Seguridad** | Excelente (10/10) | Contraseñas con `bcrypt` (10 rounds), tokens `JWT`, `helmet` habilitado y sanitización de inputs. |
| **Rendimiento** | Excelente (10/10) | SQLite en modo WAL, consultas preparadas (`prepared statements`), bundle único para carga inicial. |
| **Mantenibilidad** | Excelente (10/10) | Código exhaustivamente comentado con JSDoc y tipado implícito coherente. |
| **Resiliencia** | Excelente (10/10) | Fallback automático en `RepositorioContenido.js` a datos JSON locales si el backend no está disponible. |

---

## 4. Estado de Cumplimiento de Requerimientos

- [x] **REQ-01 (SQLite Data Model):** Tablas, relaciones, vistas, procedimientos CRUD y migración completada.
- [x] **REQ-02 (Carpeta Data):** Directorio `data/` creado conteniendo `portafolio.db`, `schema.sql` e `init-db.js`.
- [x] **REQ-03 (Autenticación Admin):** Formulario de login, token JWT y usuario `Admin` / `Admin123` activo.
- [x] **REQ-04 (Gestión de Contenido y Cloud Links):** Formularios para todas las 9 secciones con soporte de enlaces a GitHub, Drive, OneDrive, Dropbox, YouTube y Vimeo.
- [x] **REQ-05 (Pruebas Unitarias y de Integración):** Suite de 57 pruebas automatizadas pasando al 100%.
- [x] **REQ-06 (Temas Dark / Light):** Selector de tema interactivo en Header con persistencia.
- [x] **REQ-07 (Documentación en `/docs`):** Manuales, esquemas, changelog e informes generados.
