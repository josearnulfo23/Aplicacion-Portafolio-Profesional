# Portafolio Profesional — José Arnulfo Céspedes Albornoz

[![Version: 2.0.3](https://img.shields.io/badge/Version-2.0.3-blue.svg)](docs/CHANGELOG.md)
[![Database: SQLite3](https://img.shields.io/badge/Database-SQLite%203-lightgrey.svg)](docs/DATABASE_SCHEMA.md)
[![Backend: Express.js](https://img.shields.io/badge/Backend-Express.js%205-green.svg)](server.js)
[![Frontend: Vanilla JS ES6+](https://img.shields.io/badge/Frontend-Vanilla%20JS%20ES6%2B-yellow.svg)](src/js/main.js)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Accessibility: WCAG 2.1 AA](https://img.shields.io/badge/Accessibility-WCAG%202.1%20AA-success.svg)](https://www.w3.org/WAI/standards-guidelines/wcag/)

> **Landing Page web dinámica, moderna y relacional** para el posicionamiento profesional de **José Arnulfo Céspedes Albornoz**, especialista interdisciplinario en Tecnologías de la Información, Análisis de Datos y Sistemas de Seguridad.

---

## 🌟 Novedades de la Versión 2.0

- 🗄️ **Base de Datos Dinámica SQLite 3**: Persistencia relacional en `/data/portafolio.db` con tablas normalizadas, vistas e índices de alta velocidad.
- 🔐 **Panel de Administración con Autenticación**: Gestión completa en tiempo real de proyectos, experiencias, habilidades, servicios, educación, testimonios y buzón de mensajes (Credenciales por defecto: `Admin` / `Admin123`).
- ☁️ **Integración Multimedia en la Nube**: Soporte para fotos, diplomas y capturas en **Google Drive, OneDrive y Dropbox**, y videos en **YouTube y Vimeo**.
- 🔗 **Enlaces a Repositorios**: Campos y visualización para repositorios en **GitHub, GitLab** y demos en vivo.
- 🌓 **Selector de Temas (Dark / Light Mode)**: Paletas de color accesibles con persistencia en `localStorage`.
- ⚡ **Rendimiento Excepcional**: Arquitectura ligera sin sobrecarga de frameworks pesados (Lighthouse > 95).
- ♿ **Accesibilidad WCAG 2.1 AA**: Navegación por teclado, contraste alto, atributos ARIA y textos alternativos.
- 📬 **Buzón de Contacto Seguro**: Recepción y almacenamiento de mensajes de visitantes en SQLite.

---

## 📚 Documentación Completa del Proyecto

Toda la documentación técnica y de usuario se encuentra centralizada en la carpeta [**`/docs`**](docs/):

1. 📘 [**Manual de Uso y Administración**](docs/MANUAL_DE_USO.md)
2. 🗄️ [**Diseño y Esquema de Base de Datos SQLite**](docs/DATABASE_SCHEMA.md)
3. 📝 [**Control de Cambios (Changelog)**](docs/CHANGELOG.md)
4. 🏗️ [**Informe de Desarrollo y Arquitectura**](docs/INFORME_DESARROLLO.md)
5. 🧪 [**Informe de Pruebas y QA**](docs/INFORME_PRUEBAS.md)
6. 💡 [**Justificación Tecnológica del Stack**](docs/JUSTIFICACION_TECNOLOGICA.md)

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias
npm install

# 2. Inicializar o migrar la base de datos
node data/init-db.js

# 3. Iniciar el servidor
npm start

# 4. Abrir en el navegador:
# http://localhost:3000
```

---

## 🧪 Pruebas Automatizadas

```bash
npm test
```

---

## 📄 Licencia

Este proyecto está bajo la Licencia [MIT](LICENSE) - consulta el archivo LICENSE para más detalles.
