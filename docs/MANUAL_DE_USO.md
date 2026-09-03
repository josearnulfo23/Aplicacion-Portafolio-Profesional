# Manual de Usuario y Administración — Portafolio Profesional v2.0

> **Aplicación:** Portafolio Profesional Interactivo v2.0  
> **Titular:** José Arnulfo Céspedes Albornoz  
> **Autor del Manual:** Agentic Architecture Team  

---

## 1. Guía del Visitante (Navegación en la Landing Page)

La Landing Page ofrece una experiencia fluida, rápida y accesible estructurada en 9 secciones principales:

1. **Header Fijo**: Contiene el logotipo, menú de navegación rápida, botón para alternar el **Modo Oscuro / Claro (🌙 / ☀️)** y botón de descarga directa de CV.
2. **Hero (Inicio)**: Presentación con título profesional, resumen, llamadas a la acción (*Ver Proyectos* y *Contáctame*) y enlaces a redes sociales.
3. **Sobre Mí (Biografía)**: Trayectoria profesional, áreas de especialización y valores de trabajo.
4. **Experiencia**: Línea de tiempo interactiva con roles, responsabilidades, logros cuantificables y tecnologías utilizadas.
5. **Habilidades**: Barras de dominio técnico categorizadas con animaciones al hacer scroll.
6. **Proyectos**: Catálogo con filtros por categoría, tarjetas informativas con enlaces a **GitHub**, demos en vivo y modales con detalles ampliados.
7. **Servicios**: Propuesta de valor y servicios profesionales de consultoría.
8. **Educación & Certificaciones**: Títulos universitarios y certificaciones con enlaces a credenciales digitales.
9. **Testimonios**: Reseñas de clientes y colaboradores.
10. **Contacto**: Formulario con validación en tiempo real para enviar mensajes directos al titular.

---

## 2. Guía del Administrador (Gestión Dinámica del Portafolio)

### 2.1 Acceso al Panel de Administración
1. En la esquina inferior derecha de la pantalla, haz clic en el botón flotante **`🔐 Admin`**.
2. Se abrirá el modal de autenticación.
3. Ingresa las credenciales por defecto:
   - **Usuario:** `Admin`
   - **Contraseña:** `Admin123`
4. Haz clic en **Iniciar Sesión**. Recibirás una notificación de bienvenida y se cargará el panel de administración.

---

### 2.2 Gestión de Secciones desde el Panel

#### 👤 Pestaña "Sobre Mí & Hero"
* Permite actualizar en tiempo real tu nombre, título profesional, tagline, descripción breve y biografía completa.
* **Fotos y CV en la nube:** Puedes pegar URLs de tu foto de perfil o CV alojados en **Google Drive**, **OneDrive**, **Dropbox** o tu servidor web.
* Haz clic en **Guardar Cambios de Perfil** para que la landing page se actualice inmediatamente.

#### 💼 Pestaña "Experiencia"
* **Agregar nueva experiencia:** Haz clic en `+ Agregar Experiencia`, diligencia el cargo, empresa, ubicación, modalidad, periodo, responsabilidades (una por línea), logros y tecnologías.
* **Editar experiencia:** Haz clic en el botón `✏️ Editar` sobre cualquier tarjeta.
* **Eliminar:** Haz clic en `🗑️ Borrar`.

#### 🎯 Pestaña "Habilidades"
* Permite agregar nuevas habilidades a cualquiera de las 3 categorías principales (TI, Análisis de Datos, Seguridad).
* Define el nombre de la habilidad, porcentaje de dominio (0-100%) e icono representativo.

#### 🚀 Pestaña "Proyectos & Demos"
* Haz clic en `+ Agregar Proyecto`.
* **Enlaces a Repositorios:** Diligencia el enlace a tu repositorio en **GitHub** o GitLab en el campo *Enlace Repositorio GitHub*.
* **Demo en Vivo:** Agrega el link de despliegue en el campo *Enlace Demo en Vivo*.
* **Capturas y Videos en la Nube:** Agrega enlaces directos de imágenes de Google Drive, Dropbox, OneDrive, y videos de **YouTube o Vimeo**.
* **Destacado:** Marca la casilla *Proyecto Destacado* para que aparezca prioritario en portada.

#### 🛠️ Pestaña "Servicios"
* Crea o elimina servicios de consultoría, desarrollo de software, auditoría de seguridad o analítica de datos.

#### 🎓 Pestaña "Educación & Diplomas"
* Registra nuevos títulos académicos de pregrado/posgrado o nuevas certificaciones profesionales con enlace a su credencial digital/diploma.

#### 💬 Pestaña "Testimonios"
* Añade o elimina recomendaciones profesionales de clientes y líderes de equipo con su respectiva calificación en estrellas.

#### 📬 Pestaña "Mensajes & Redes"
* Visualiza todos los mensajes que los visitantes han enviado a través del formulario de contacto web, con fecha, nombre, correo, teléfono y mensaje.

---

## 3. Selector de Temas (Dark / Light Mode)

* Puedes alternar entre el tema oscuro y el tema claro en cualquier momento haciendo clic en el icono del sol/luna (☀️ / 🌙) en el Header superior.
* Tu preferencia se guardará automáticamente en el navegador para futuras visitas.

---

## 4. Respaldo y Mantenimiento de la Base de Datos

* La base de datos SQLite se encuentra en el archivo:
  `data/portafolio.db`
* Para realizar una copia de seguridad rápida, simplemente copia el archivo `portafolio.db` a una ubicación segura.
* Para reiniciar la base de datos a los valores iniciales de fábrica, ejecuta:
  ```bash
  node data/init-db.js
  ```
