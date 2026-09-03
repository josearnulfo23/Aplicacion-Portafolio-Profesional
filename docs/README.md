# Portafolio Profesional v2.0 — José Arnulfo Céspedes Albornoz

[![Version: 2.0.0](https://img.shields.io/badge/Version-2.0.0-blue.svg)](docs/CHANGELOG.md)
[![Database: SQLite3](https://img.shields.io/badge/Database-SQLite%203-lightgrey.svg)](docs/DATABASE_SCHEMA.md)
[![Backend: Express.js](https://img.shields.io/badge/Backend-Express.js%205-green.svg)](server.js)
[![Frontend: Vanilla JS ES6+](https://img.shields.io/badge/Frontend-Vanilla%20JS%20ES6%2B-yellow.svg)](src/js/main.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Accessibility: WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Aplicación web dinámica tipo Landing Page con arquitectura relacional SQLite, panel de administración con autenticación JWT, soporte multimedia en la nube (OneDrive, Google Drive, Dropbox, YouTube, Vimeo), temas interactivos (Dark/Light Mode) y API REST.**

---

## 📚 Índice de Documentación en `/docs`

| Documento | Descripción |
| :--- | :--- |
| 📘 [**Manual de Uso y Administración**](MANUAL_DE_USO.md) | Guía detallada para el usuario visitante y manual paso a paso del Administrador. |
| 🗄️ [**Diseño de Base de Datos SQLite**](DATABASE_SCHEMA.md) | Diccionario de datos, relaciones 3NF, vistas, triggers y procedimientos CRUD. |
| 📝 [**Control de Cambios (Changelog)**](CHANGELOG.md) | Registro de versiones y novedades desde v1.0 hasta v2.0. |
| 🏗️ [**Informe de Desarrollo**](INFORME_DESARROLLO.md) | Reporte arquitectónico, decisiones de diseño y revisión de código por agentes. |
| 🧪 [**Informe de Pruebas (QA)**](INFORME_PRUEBAS.md) | Resultados de la suite de pruebas unitarias, de integración y cobertura del 100%. |
| 💡 [**Justificación Tecnológica**](JUSTIFICACION_TECNOLOGICA.md) | Argumentación técnica de la selección de SQLite, Express, Vanilla JS y CSS tokens. |

---

## 🚀 Arquitectura y Novedades de la Versión 2.0

1. **Base de Datos Dinámica SQLite 3 (`/data/portafolio.db`)**:
   - Migración completa de datos estáticos JSON a tablas relacionales con integridad referencial, índices y vistas.
   - Soporte para actualización continua de proyectos, experiencias, habilidades, servicios, educación y testimonios.

2. **Panel de Administración con Autenticación JWT (`AdminPanel.js`)**:
   - Acceso seguro mediante modal con credenciales (Por defecto: Usuario: `Admin`, Contraseña: `Admin123`).
   - Formularios completos para la gestión CRUD en tiempo real con recarga reactiva de la landing page.

3. **Gestión de Recursos Multimedia en la Nube**:
   - Soporte para enlaces directos e imágenes alojadas en **Google Drive, OneDrive y Dropbox** (foto de perfil, diplomas, capturas de pantalla).
   - Enlace de videos demostrativos y de presentación mediante URLs de **YouTube y Vimeo**.
   - Campos dedicados para repositorios en **GitHub, GitLab** y enlaces a demos en vivo.

4. **Selector de Temas y Estilos**:
   - Soporte para **Modo Oscuro (Dark Theme)** y **Modo Claro (Light Theme)** con transición suave y persistencia en `localStorage`.

5. **API RESTful de Alto Rendimiento (`server.js`)**:
   - Endpoints públicos (`/api/content/all`, `/api/contact/send`, `/health`) y protegidos con JWT para operaciones CRUD.

---

## 💻 Inicio Rápido y Ejecución

```bash
# 1. Instalar dependencias
npm install

# 2. Inicializar / Migrar la base de datos SQLite
node data/init-db.js

# 3. Iniciar el servidor backend + frontend
npm start
# o con recarga automática:
node server.js

# 4. Abrir en el navegador:
# http://localhost:3000
```

---

## 🔑 Credenciales por Defecto del Administrador

* **Usuario**: `Admin`
* **Contraseña**: `Admin123`
* *(Se recomienda cambiar la contraseña tras el primer inicio de sesión).*
