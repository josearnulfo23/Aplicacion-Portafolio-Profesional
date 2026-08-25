# MANUAL DE USO Y PERSONALIZACIÓN DE LA APLICACIÓN

## Portafolio Profesional — Landing Page Web

> **Autor del Software:** José Arnulfo Céspedes Albornoz  
> **Licencia:** MIT (Open Source)  
> **Versión:** 1.0.0 — **Año:** 2026

---

## 1. Introducción y Propósito

Este manual proporciona una guía paso a paso para ejecutar, personalizar y desplegar la aplicación web **Portafolio Profesional**. La aplicación está construida sobre una arquitectura **Data-Driven (dirigida por datos)**, lo que significa que puedes actualizar toda tu información profesional, proyectos, experiencia, habilidades y enlaces sociales **simplemente editando archivos JSON**, sin necesidad de modificar el código JavaScript o HTML.

---

## 2. Requisitos Previos e Instalación Rápida

La aplicación es completamente estática y no requiere bases de datos ni dependencias complejas.

### 2.1 Requisitos Mínimos
- Un navegador web moderno (Google Chrome, Microsoft Edge, Mozilla Firefox o Apple Safari).
- *(Opcional pero recomendado para pruebas locales)*: **Node.js** (versión 16 o superior) o Python 3.

### 2.2 Inicialización Rápida

#### En Windows:
Ejecuta el script automático haciendo doble clic en `init.bat` o desde la terminal PowerShell/CMD:
```powershell
.\init.bat
```

#### En Linux / macOS:
Otorga permisos de ejecución y ejecuta el script:
```bash
chmod +x init.sh
./init.sh
```

#### Mediante NPM:
```bash
npm install
npm run dev
```

El servidor local se abrirá automáticamente en tu navegador en `http://localhost:3000` o `http://localhost:8080`.

---

## 3. Guía de Personalización del Portafolio

Todos los datos se encuentran organizados en la carpeta `src/js/data/`. Cada archivo cuenta con un esquema de validación en `src/js/schemas/`.

```
src/js/data/
├── profile.json       # Tu nombre, título, tagline, redes sociales y foto
├── about.json         # Tu biografía, especialidades y valores profesionales
├── experience.json    # Historial laboral en orden cronológico inverso
├── skills.json        # Habilidades técnicas categorizadas con porcentajes de dominio
├── projects.json      # Galería de proyectos, tecnologías y resultados cuantificables
├── services.json      # Catálogo de servicios profesionales ofrecidos
├── education.json     # Títulos académicos y certificaciones obtenidas
└── testimonials.json  # Recomendaciones de clientes o empleadores
```

### 3.1 Personalizar Perfil y Hero (`src/js/data/profile.json`)
Edita este archivo para colocar tu información principal:
```json
{
  "nombreCompleto": "Tu Nombre y Apellidos",
  "tituloProfesional": "Tu Cargo o Título Principal",
  "tagline": "Tu propuesta de valor en una o dos frases de alto impacto.",
  "descripcionBreve": "Breve elevator pitch de presentación.",
  "fotoProfesional": "public/images/profile/hero-photo.webp",
  "ctaPrimario": {
    "texto": "Ver Proyectos",
    "destino": "#proyectos"
  },
  "ctaSecundario": {
    "texto": "Contáctame",
    "destino": "#contacto"
  },
  "redesSociales": [
    {
      "nombreRed": "LinkedIn",
      "urlPerfil": "https://linkedin.com/in/tu-usuario",
      "icono": "public/images/icons/linkedin.svg"
    },
    {
      "nombreRed": "GitHub",
      "urlPerfil": "https://github.com/tu-usuario",
      "icono": "public/images/icons/github.svg"
    }
  ]
}
```

### 3.2 Actualizar el Currículum Vitae (CV en PDF)
1. Coloca tu archivo PDF actualizado en la carpeta `public/documents/`.
2. Asigna un nombre con la convención `CV_[Nombre]_[Año].pdf` (ejemplo: `CV_Jose_Cespedes_2024.pdf`).
3. La aplicación detectará automáticamente el enlace de descarga en el Header, el Hero y el Footer.

### 3.3 Agregar o Modificar Proyectos (`src/js/data/projects.json`)
Para añadir un nuevo proyecto a la galería, agrega un nuevo objeto a la lista:
```json
{
  "idProyecto": "proyecto-03",
  "titulo": "Plataforma de Monitoreo Analítico",
  "subtitulo": "Dashboard en tiempo real para métricas de seguridad",
  "categoria": "Análisis de Datos",
  "descripcionBreve": "Dashboard corporativo con visualización de telemetría y alarmas críticas.",
  "descripcionDetallada": "Diseño e implementación de un panel centralizado para procesar streams de datos.",
  "tecnologiasUtilizadas": ["Python", "SQL", "PowerBI", "Docker"],
  "imagenRepresentativa": "public/images/projects/project-03.svg",
  "resultadosObtenidos": [
    "Reducción del 45% en tiempos de detección de anomalías",
    "Automatización de reportes diarios para la dirección"
  ],
  "enlaceDemo": "https://demo.ejemplo.com",
  "enlaceGitHub": "https://github.com/tu-usuario/proyecto-demo",
  "destacado": true
}
```

### 3.4 Actualizar Habilidades Técnicas (`src/js/data/skills.json`)
Las habilidades se dividen en 3 categorías principales:
1. *Tecnologías de la Información*
2. *Análisis de Datos*
3. *Seguridad y Monitoreo*

Puedes modificar el porcentaje (`nivelDominio` entre 0 y 100) para ajustar visualmente la barra de progreso:
```json
{
  "nombre": "JavaScript ES6+",
  "icono": "public/images/icons/skills/javascript.svg",
  "nivelDominio": 90,
  "aniosExperiencia": 5,
  "certificacionesAsociadas": ["JavaScript Specialist"]
}
```

---

## 4. Configuración del Formulario de Contacto (Email)

El formulario de contacto utiliza el servicio desacoplado `ConectorEmail.js`. Para conectar un proveedor real como **EmailJS**:
1. Crea una cuenta gratuita en [EmailJS.com](https://www.emailjs.com/).
2. Configura tu servicio de correo y plantilla.
3. Edita las constantes en `src/js/config/constants.js`:
```javascript
export const EMAIL_CONFIG = {
  SERVICE_ID: "tu_service_id",
  TEMPLATE_ID: "tu_template_id",
  PUBLIC_KEY: "tu_public_key",
  PROVEEDOR: "emailjs" // O 'simulado' para pruebas locales
};
```

---

## 5. Despliegue en Producción

Dado que el portafolio está construido con estándares web universales (HTML5/CSS3/ES6), se puede desplegar gratuitamente en cualquier plataforma de hosting estático:

### 5.1 Despliegue en Vercel
1. Sube tu repositorio a GitHub.
2. Ingresa a [Vercel](https://vercel.com/) y haz clic en **Add New Project**.
3. Selecciona tu repositorio. Vercel detectará el proyecto estático automáticamente.
4. Haz clic en **Deploy**.

### 5.2 Despliegue en Netlify / GitHub Pages
- **Netlify**: Arrastra la carpeta del proyecto a la consola de Netlify Drop o conecta tu repositorio Git.
- **GitHub Pages**: En la configuración del repositorio en GitHub (`Settings` -> `Pages`), selecciona la rama `main` y la carpeta `/ (root)`.

---

## 6. Soporte y Licencia

Este proyecto está licenciado bajo la **Licencia MIT**, lo que permite su uso comercial, modificación y distribución sin costo. Para reportar errores o sugerencias, consulta con el creador original **José Arnulfo Céspedes Albornoz**.
