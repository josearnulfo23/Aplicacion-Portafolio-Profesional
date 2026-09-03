# Justificación y Argumentación Tecnológica — Portafolio Profesional v2.0

> **Autor:** Architect_Agent  
> **Proyecto:** Portafolio Profesional José Arnulfo Céspedes Albornoz  
> **Versión:** 2.0.0  

---

## 1. Stack Tecnológico Seleccionado

| Capa / Módulo | Tecnología Seleccionada | Alternativas Evaluadas | Razón de la Elección |
| :--- | :--- | :--- | :--- |
| **Base de Datos** | **SQLite 3 (`better-sqlite3`)** | PostgreSQL, MySQL, MongoDB | Motor relacional embebido sin necesidad de servicio externo, modo WAL de alta concurrencia, latencia < 1ms y portabilidad absoluta en un solo archivo (`data/portafolio.db`). |
| **Backend & API** | **Node.js + Express.js 5** | NestJS, Fastify, Flask | Ecosistema ligero, altamente compatible con módulos ES, middleware estándar (`cors`, `helmet`), y curva de mantenimiento mínima. |
| **Frontend UI** | **Vanilla JavaScript (ES6+ Modules)** | React, Vue, Angular | Cero sobrecarga de Virtual DOM, tiempo de carga ultrarrápido (< 1s First Contentful Paint), 100% de control sobre el renderizado y compatibilidad universal. |
| **Estilos & Diseño** | **CSS3 Moderno (Custom Properties + Glassmorphism)** | Tailwind CSS, Bootstrap | Sin proceso de build obligatorio, tokens de diseño dinámicos para Dark/Light mode en tiempo de ejecución, aceleración GPU para animaciones. |
| **Seguridad** | **Bcrypt.js + JSON Web Tokens (JWT)** | Session cookies, OAuth2 | Autenticación desacoplada sin estado (stateless), transporte seguro de credenciales y protección robusta contra ataques de fuerza bruta. |
| **Testing** | **Node Test Runner + JSDOM** | Jest, Mocha, Cypress | Ejecución nativa sin dependencias pesadas, simulación fiel del DOM del navegador y validación de APIs REST en milisegundos. |

---

## 2. Argumentación Arquitectónica

### 2.1 ¿Por qué SQLite para un Portafolio Profesional Dinámico?
Un portafolio profesional es un sistema donde la proporción de operaciones es de **alta lectura (99%) y baja escritura (1%)**. SQLite es ideal para esta carga de trabajo porque:
1. **Rendimiento en Lectura:** SQLite lee directamente del archivo del sistema de archivos local en memoria compartida (WAL), superando a bases de datos cliente-servidor al no tener sobrecarga de red TCP/IP.
2. **Autonomía Operativa:** No requiere configurar puertos, credenciales de conexión complejas de servidor externo ni pagar por instancias dedicadas de base de datos en la nube.
3. **Integridad Relacional Completa:** A diferencia de bases de datos orientadas a documentos (NoSQL), SQLite ofrece claves foráneas con cascadas, índices B-Tree y vistas complejas.

### 2.2 ¿Por qué Vanilla JS sin Frameworks para el Frontend?
1. **Lighthouse Score > 95:** Al no tener que descargar ni parsear megabytes de librerías como React o Angular, el navegador ejecuta el código inmediatamente.
2. **Longevidad del Código:** El estándar ECMAScript es estable y no sufre de "framework churn" (roturas por cambios de versión de librerías).
3. **Accesibilidad WCAG 2.1 AA Nativa:** Permite manipular directamente elementos ARIA, focus trapping y eventos de teclado sin capas intermedias.

### 2.3 Estrategia Híbrida para Multimedia en la Nube
En lugar de almacenar pesados archivos binarios (imágenes en alta resolución y videos) dentro de la base de datos o sobrecargar el servidor web, se implementó una estrategia de **enlace a almacenamiento en la nube (Google Drive, OneDrive, Dropbox, YouTube, Vimeo)**:
- **Ahorro de Ancho de Banda y Almacenamiento:** Los proveedores cloud asumen la distribución global de CDN.
- **Flexibilidad:** El usuario puede actualizar sus diplomas o capturas en su nube personal y simplemente vincular la URL.

---

## 3. Conclusión
La arquitectura elegida para la versión 2.0 maximiza la **eficiencia, seguridad, velocidad de carga y facilidad de administración**, proporcionando un portafolio profesional escalable y de máxima calidad técnica.
