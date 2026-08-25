# PSEUDOCÓDIGO DE LA APLICACIÓN
## Landing Page — Portafolio Profesional

> **Solicitud:** PS-07 — Creación de pseudocódigo para aplicación web landing page portafolio profesional
> **Solicitante:** José Arnulfo Céspedes Albornoz
> **Versión del artefacto:** 1.0 — **Fecha de elaboración:** 19/08/2026

| Campo | Valor |
|---|---|
| **Documento fuente (única fuente de verdad)** | `especificiones-prompt-claude-sonnet-necesidad3.mkd` (v1.0 — 17/08/2026) |
| **Stack de referencia** | **Opción 1 (Recomendada):** React.js + Next.js 14 · Tailwind CSS · Framer Motion · React Hook Form + EmailJS · Hosting Vercel |
| **Tipo de artefacto** | **PSEUDOCÓDIGO** — no se genera código en ningún lenguaje de programación estándar |
| **Trazabilidad** | Cada bloque cita sus fuentes del documento de especificación: `HU-xx` (historias de usuario), `CU-xx` (casos de uso), `RF-xx` (requisitos funcionales), `RNF-xx` (requisitos no funcionales), `§2.x` (sección del documento) |

> [!CAUTION]
> **Restricción cumplida:** este documento contiene EXCLUSIVAMENTE pseudocódigo estructurado y comentado.
> Todo lo aquí descrito proviene única y exclusivamente del documento de especificación; no se introduce ningún
> elemento, funcionalidad o argumento ajeno a dicha fuente.

---

## ÍNDICE

1. [Convenciones de escritura del pseudocódigo](#0-convenciones-de-escritura-del-pseudocódigo)
2. [Visión de arquitectura en capas](#1-visión-de-arquitectura-en-capas)
3. [Jerarquía de clases, objetos y componentes](#2-jerarquía-de-clases-objetos-y-componentes)
4. [Capa de dominio — Entidades, atributos y métodos](#3-capa-de-dominio--entidades-atributos-y-métodos)
5. [Capa de datos — Repositorio de contenido (JSON)](#4-capa-de-datos--repositorio-de-contenido-json)
6. [Capa de componentes — Estructura (layout)](#5-capa-de-componentes--estructura-layout)
7. [Capa de componentes — Secciones](#6-capa-de-componentes--secciones)
8. [Capa de componentes — UI reutilizable](#7-capa-de-componentes--ui-reutilizable)
9. [Capa de componentes — Comunes](#8-capa-de-componentes--comunes)
10. [Capa de servicios y conectores](#9-capa-de-servicios-y-conectores)
11. [Capa de configuración, entorno y despliegue](#10-capa-de-configuración-entorno-y-despliegue)
12. [Pseudocódigo de los flujos de casos de uso (CU-001 a CU-008)](#11-pseudocódigo-de-los-flujos-de-casos-de-uso)
13. [Matriz de trazabilidad pseudocódigo ↔ especificación](#12-matriz-de-trazabilidad-pseudocódigo--especificación)
14. [Argumentación técnica del pseudocódigo](#13-argumentación-técnica-del-pseudocódigo)

---

## 0. CONVENCIONES DE ESCRITURA DEL PSEUDOCÓDIGO

> **FUENTE:** RNF-008 (nomenclatura consistente, modularización, comentarios descriptivos); solicitud PS-07 (tareas 11 y formato de salida).

Se establecen las siguientes convenciones para garantizar lectura uniforme del pseudocódigo:

```texto
►  ESTRUCTURAS DE DECLARACIÓN:
   ENTIDAD        → define una clase/dominio de datos con atributos y métodos
   COMPONENTE     → define una pieza de interfaz (layout, sección, UI, común)
   SERVICIO       → define lógica de negocio transversal (validación, SEO, analítica…)
   CONECTOR       → define integración con un servicio externo (EmailJS, GA4, Vercel)
   MÓDULO         → define agrupaciones de configuración, datos o flujos
   FLUJO          → define un proceso de extremo a extremo (caso de uso)

►  ESTRUCTURAS DE CONTROL:
   SI … ENTONCES … SI_NO … FIN_SI
   SEGÚN … CASO … OTRO_CASO … FIN_SEGÚN
   MIENTRAS … HACER … FIN_MIENTRAS
   PARA CADA … HASTA … FIN_PARA
   INTENTAR … CAPTURAR_ERROR … FIN_INTENTAR   (manejo de flujos alternativos/errores)

►  ELEMENTOS AUXILIARES:
   EVENTO         → reacción a interacción del usuario (clic, scroll, envío, carga)
   FUNCIÓN/PROCEDIMIENTO → unidad de comportamiento con entrada y retorno
   ENTRADAS/ESTADO INTERNO/SALIDAS → contrato de datos de cada componente
   ►  → comentario explicativo (todas las partes van comentadas, sin excepción)
   /* … */ → bloque de comentario de cabecera

►  NOTACIÓN DE TRAZABILIDAD:
   Cada bloque declara sus líneas FUENTE y su ARCHIVO DE REFERENCIA,
   tomado de la estructura de directorios de la Opción 1 (§2.6 del documento).
```

---

## 1. VISIÓN DE ARQUITECTURA EN CAPAS

> **FUENTE:** §2.6 Arquitectura recomendada (Opción 1); justificación de estructura: "Separación de concerns, Data-driven, Escalable, Mantenible".

```texto
┌─────────────────────────────────────────────────────────────────────┐
│  CAPA 1 · DOMINIO        Entidades con atributos y métodos,          │
│                          derivadas 1:1 de los archivos JSON de       │
│                          src/data y de los elementos de los RF       │
├─────────────────────────────────────────────────────────────────────┤
│  CAPA 2 · DATOS          Repositorio de contenido estático JSON      │
│                          (data-driven: fácil actualización)          │
├─────────────────────────────────────────────────────────────────────┤
│  CAPA 3 · COMPONENTES    layout / sections / ui / common,            │
│                          jerarquizados según el árbol de directorios │
├─────────────────────────────────────────────────────────────────────┤
│  CAPA 4 · SERVICIOS      validación, email, descarga CV, navegación, │
│  Y CONECTORES            animación, SEO, analítica, accesibilidad,   │
│                          rendimiento, responsividad, seguridad       │
├─────────────────────────────────────────────────────────────────────┤
│  CAPA 5 · CONFIGURACIÓN  package.json, vercel.json, variables de     │
│  Y DESPLIEGUE            entorno, flujo CI/CD Vercel, mantenimiento  │
└─────────────────────────────────────────────────────────────────────┘
```

> **Nota sobre bases de datos:** conforme al documento de especificación, esta aplicación **no usa base de datos**.
> La persistencia del contenido es estática y data-driven (archivos JSON en `src/data/`); el único servicio
> externo transaccional es el conector de correo (EmailJS). (FUENTE: §2.6 "Data-driven: JSON para fácil
> actualización de contenido"; RNF-009 "Base de datos: (si aplica)".)

---

## 2. JERARQUÍA DE CLASES, OBJETOS Y COMPONENTES

> **FUENTE:** §2.6 Estructura de Directorios (Opción 1 — Next.js); §2.7 Mapa de navegación.
> La jerarquía reproduce exactamente la composición declarada en el documento de especificación.

```texto
APLICACIÓN (src/app)
│
├── LAYOUT RAÍZ (layout.tsx)  ── compone toda la página
│   ├── METADATOS SEO (metadata.ts)          ── RNF-005
│   ├── ESTILOS GLOBALES (globals.css)       ── RNF-010
│   ├── COMPONENTE Header (layout)           ── RF-012
│   │   └── COMPONENTE Navigation (layout)   ── RF-012
│   ├── PÁGINA PRINCIPAL (page.tsx)  ── ensambla las 9 secciones (§2.7)
│   │   ├── SECCIÓN Hero                     ── HU-001, RF-001
│   │   ├── SECCIÓN SobreMí                  ── RF-002
│   │   ├── SECCIÓN Experiencia              ── HU-002, RF-003
│   │   ├── SECCIÓN Habilidades              ── HU-003, RF-004
│   │   ├── SECCIÓN Proyectos                ── HU-004, RF-005
│   │   ├── SECCIÓN Servicios                ── HU-010, RF-006
│   │   ├── SECCIÓN Educación                ── RF-008
│   │   ├── SECCIÓN Testimonios              ── HU-009, RF-007
│   │   └── SECCIÓN Contacto                 ── HU-006, RF-009
│   └── COMPONENTE Footer (layout)           ── RF-013
│
├── COMPONENTES UI (ui/) ── reutilizados por las secciones
│   ├── Button · Card · Modal · SkillBar · ProjectCard
│
├── COMPONENTES COMUNES (common/)
│   ├── SocialLinks · DownloadCV · ScrollToTop
│
├── DOMINIO (data/) ── objetos de contenido JSON
│   ├── PerfilProfesional · ExperienciaLaboral · Habilidad · Proyecto
│   ├── Servicio · Testimonio · EducacionYCertificacion · MensajeContacto
│
└── SERVICIOS (lib/)
    ├── constants · utils · validators
    └── CONECTORES EXTERNOS: EmailJS · Google Analytics 4
```

---

## 3. CAPA DE DOMINIO — ENTIDADES, ATRIBUTOS Y MÉTODOS

> **FUENTE:** §2.6 (archivos JSON de `src/data/`); elementos declarados en RF-001 a RF-011; criterios de
> aceptación de HU-001 a HU-010. Cada atributo se deriva literalmente de un elemento del documento.

### 3.1 ENTIDAD PerfilProfesional

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: PerfilProfesional
   FUENTE:  HU-001 (Presentación Personal), RF-001 (Sección Hero),
            CU-001 (Explorar Perfil Profesional), §2.7 (Hero)
   PROPÓSITO: Datos de presentación de la sección Hero: quién es
              el profesional y qué hace, visible en los primeros
              3 segundos de carga (criterio HU-001).
   ───────────────────────────────────────────────────────────── */
ENTIDAD PerfilProfesional

    ATRIBUTOS
        nombreCompleto     : texto   ► Nombre completo (ej. "José Céspedes Albornoz", §2.8)
                                      ► Se renderiza como H1 con tamaño destacado (RF-001)
        tituloProfesional  : texto   ► Subtítulo descriptivo del cargo/perfil (RF-001)
        tagline            : texto   ► Frase de valor de 1-2 líneas (RF-001)
        fotoProfesional    : imagen  ► Fotografía profesional de alta resolución (RF-001)
                                      ► Formato WebP según RNF-001 (optimización de imágenes)
        descripcionBreve   : texto   ► Elevator pitch: descripción breve (HU-001)
        ctaPrimario        : texto   ► Uno de: "Contáctame" | "Ver Proyectos" (RF-001, RF-015)
        redesSociales      : lista<RedSocial> ► Redes visibles en Hero (§2.7 mapa de navegación)

    MÉTODOS
        FUNCIÓN presentar() : contenidoVista
            ► Devuelve la vista Hero: nombre (H1), título (subtítulo),
            ► tagline, foto profesional, CTA primario y enlaces de redes
        FIN FUNCIÓN

        FUNCIÓN obtenerCTA() : texto
            ► Retorna el texto del CTA primario ("Contáctame" o "Ver Proyectos")
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.2 ENTIDAD Biografia

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: Biografia
   FUENTE:  RF-002 (Sección "Sobre Mí")
   PROPÓSITO: Presentación extendida del profesional.
   ───────────────────────────────────────────────────────────── */
ENTIDAD Biografia

    ATRIBUTOS
        biografiaProfesional   : texto   ► Biografía de 200-300 palabras (RF-002)
        areasEspecializacion   : lista<texto> ► Áreas de especialización (RF-002)
        valoresProfesionales   : lista<texto> ► Valores profesionales (RF-002)
        imagenComplementaria   : imagen  ► Imagen complementaria — OPCIONAL (RF-002)

    MÉTODOS
        FUNCIÓN validarLongitud() : lógico
            ► Verifica que biografiaProfesional tenga entre 200 y 300 palabras
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.3 ENTIDAD ExperienciaLaboral

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: ExperienciaLaboral
   FUENTE:  HU-002 (Visualización de Experiencia), RF-003,
            CU-002 (Revisar Experiencia Laboral)
   ARCHIVO DE REFERENCIA: src/data/experience.json
   PROPÓSITO: Trayectoria laboral presentada como timeline visual.
   ───────────────────────────────────────────────────────────── */
ENTIDAD ExperienciaLaboral

    ATRIBUTOS
        cargo                 : texto   ► Cargo desempeñado (RF-003)
        empresa               : texto   ► Empresa (RF-003)
        periodoInicio         : fecha   ► Mes/año de inicio (RF-003)
        periodoFin            : fecha | "Presente" ► Mes/año de fin o "presente" (RF-003)
        responsabilidades     : lista<texto> ► Descripción de responsabilidades (RF-003)
        logrosCuantificables  : lista<texto> ► Logros con métricas; 3-5 viñetas (RF-003, HU-002)

    MÉTODOS
        FUNCIÓN estaVigente() : lógico
            ► Retorna VERDADERO si periodoFin = "Presente"
        FIN FUNCIÓN

        FUNCIÓN compararPorFecha(otra: ExperienciaLaboral) : entero
            ► Soporte para ORDEN CRONOLÓGICO INVERSO: la más reciente primero (RF-003)
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.4 ENTIDADES CategoriaHabilidad y Tecnologia

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: CategoriaHabilidad  /  Tecnologia
   FUENTE:  HU-003 (Exploración de Habilidades Técnicas), RF-004,
            CU-003 (Evaluar Habilidades Técnicas)
   ARCHIVO DE REFERENCIA: src/data/skills.json
   PROPÓSITO: Competencias categorizadas con nivel de dominio visual.
   ───────────────────────────────────────────────────────────── */
ENTIDAD CategoriaHabilidad

    ATRIBUTOS
        nombreCategoria : enumerado
            ► TI_TECNOLOGIAS_INFORMACION   (Categoría 1, RF-004:
              lenguajes de programación, frameworks, herramientas de desarrollo)
            ► ANALISIS_DATOS               (Categoría 2, RF-004:
              herramientas analíticas, visualización, metodologías)
            ► SEGURIDAD_MONITOREO          (Categoría 3, RF-004:
              sistemas de control, plataformas de monitoreo, protocolos de seguridad)
        tecnologias     : lista<Tecnologia>
        ► Presentación: Tabs/Accordion por categoría (§2.7 mapa de navegación)

    MÉTODOS
        FUNCIÓN obtenerTecnologias() : lista<Tecnologia>
            ► Retorna las tecnologías de la categoría para su visualización
        FIN FUNCIÓN

FIN ENTIDAD

ENTIDAD Tecnologia

    ATRIBUTOS
        nombre                : texto    ► Tecnología específica (RF-004)
        icono                 : imagen   ► Ícono representativo (HU-003: "tecnologías específicas con íconos")
                                          ► Ruta de referencia: public/images/icons/skills (§2.6)
        nivelDominio          : porcentaje ► Nivel de dominio visual: barras o porcentajes (HU-003, RF-004)
        certificacionesAsociadas : lista<texto> ► Certificaciones asociadas a la tecnología (RF-004)

    MÉTODOS
        FUNCIÓN obtenerNivel() : porcentaje
            ► Valor 0-100 usado por la barra de habilidad (SkillBar)
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.5 ENTIDAD Proyecto

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: Proyecto
   FUENTE:  HU-004 (Revisión de Portafolio), RF-005, CU-004
            (Examinar Portafolio de Proyectos), §2.7 (modal de detalle)
   ARCHIVO DE REFERENCIA: src/data/projects.json
   PROPÓSITO: Galería de proyectos con detalle ampliado.
   ───────────────────────────────────────────────────────────── */
ENTIDAD Proyecto

    ATRIBUTOS
        idProyecto           : texto    ► Identificador único del proyecto
        imagenRepresentativa : imagen   ► Imagen del proyecto (public/images/projects/project-NN.webp, §2.6)
        titulo               : texto    ► Título del proyecto (RF-005)
        descripcionBreve     : texto    ► Descripción breve para la tarjeta (RF-005)
        tecnologiasUtilizadas: lista<etiqueta> ► Tags de tecnologías (RF-005)
        enlaceDetalleODemo   : URL      ► Enlace a detalle o demo (RF-005, CU-004 flujo alternativo)
        categoria            : texto    ► Categoría usada por los filtros opcionales (RF-005)
        resultadosObtenidos  : texto    ► Resultados mostrados en la vista detallada (HU-004, CU-004)

    MÉTODOS
        FUNCIÓN coincideConFiltro(categoriaBuscada: texto) : lógico
            ► Soporte del flujo alternativo "usuario filtra por categoría" (CU-004, RF-005)
        FIN FUNCIÓN

        FUNCIÓN abrirDetalle() : contenidoVista
            ► Abre el detalle en MODAL (CU-004: descripción, tecnologías y resultados)
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.6 ENTIDAD Servicio

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: Servicio
   FUENTE:  HU-010 (Conocer Servicios Ofrecidos), RF-006,
            RF-015 (CTA "Solicitar consulta")
   ARCHIVO DE REFERENCIA: src/data/services.json
   PROPÓSITO: Listado de servicios profesionales ofrecidos.
   ───────────────────────────────────────────────────────────── */
ENTIDAD Servicio

    ATRIBUTOS
        nombreServicio : enumerado
            ► CONSULTORIA_TI                (RF-006: "Consultoría en TI")
            ► ANALISIS_DATOS                (RF-006: "Análisis de datos")
            ► IMPLEMENTACION_SEGURIDAD      (RF-006: "Implementación de sistemas de seguridad")
            ► AUDITORIAS_TECNICAS           (RF-006: "Auditorías técnicas")
        descripcion    : texto   ► Descripción breve de cada servicio (HU-010, RF-006)
        icono          : imagen  ► Iconografía representativa (HU-010, RF-006)
        ctaConsulta    : acción  ► CTA "Solicitar consulta" hacia la sección Contacto (RF-015)

    MÉTODOS
        FUNCIÓN solicitarConsulta() : acción
            ► Desplaza al usuario a la sección de contacto (conversión)
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.7 ENTIDAD Testimonio

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: Testimonio
   FUENTE:  HU-009 (Lectura de Testimonios), RF-007, CU-008
   ARCHIVO DE REFERENCIA: src/data/testimonials.json
   PROPÓSITO: Recomendaciones de empleadores/clientes.
   ───────────────────────────────────────────────────────────── */
ENTIDAD Testimonio

    ATRIBUTOS
        textoTestimonio    : texto   ► Texto del testimonio (RF-007)
        nombreRecomendador : texto   ► Nombre de quien recomienda (HU-009, RF-007)
        cargo              : texto   ► Cargo del recomendador (HU-009, RF-007)
        empresa            : texto   ► Empresa — "si es posible" (HU-009, RF-007)
        foto               : imagen  ► Foto del recomendador — OPCIONAL (RF-007)

    MÉTODOS
        FUNCIÓN presentarComo() : enumerado
            ► Formato de presentación: TARJETA o SLIDER (RF-007: "Slider o grid")
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.8 ENTIDAD EducacionYCertificacion

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: EducacionYCertificacion
   FUENTE:  RF-008 (Sección "Educación y Certificaciones"), §2.7
   ARCHIVO DE REFERENCIA: src/data/education.json
   PROPÓSITO: Formación académica y certificaciones profesionales.
   ───────────────────────────────────────────────────────────── */
ENTIDAD EducacionYCertificacion

    ATRIBUTOS
        tituloAcademico   : texto   ► Título académico (RF-008)
        institucion       : texto   ► Institución educativa (RF-008)
        anio              : entero  ► Año de obtención (RF-008)
        certificaciones   : lista<Certificacion>
            ► Certificaciones relevantes (RF-008)
            ► Cada certificación incluye: nombre, entidadCertificadora,
              badgeDigital (si aplica) (RF-008)

    MÉTODOS
        FUNCIÓN presentarCronologicamente() : contenidoVista
            ► Timeline académico (§2.7: "Timeline académico, Badges de certificaciones")
        FIN FUNCIÓN

FIN ENTIDAD

ENTIDAD Certificacion

    ATRIBUTOS
        nombre              : texto   ► Nombre de la certificación (RF-008)
        entidadCertificadora: texto   ► Entidad que la otorga (RF-008)
        badgeDigital        : imagen | VACÍO ► Badge digital — solo si aplica (RF-008)

FIN ENTIDAD
```

### 3.9 ENTIDAD MensajeContacto

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: MensajeContacto
   FUENTE:  HU-006 (Contacto Directo), RF-009 (Formulario de Contacto),
            CU-006 (Enviar Mensaje de Contacto), RNF-006 (Seguridad)
   PROPÓSITO: Mensaje enviado por un visitante/cliente al profesional.
   ───────────────────────────────────────────────────────────── */
ENTIDAD MensajeContacto

    ATRIBUTOS
        nombre  : texto   ► Obligatorio (RF-009)
        email   : texto   ► Obligatorio, con validación de formato (RF-009)
        asunto  : texto   ► Obligatorio (RF-009)
        mensaje : texto   ► Obligatorio, textarea, con longitud mínima (RF-009)

    MÉTODOS
        FUNCIÓN validar() : lista<ErrorValidacion>
            ► Aplica las validaciones de RF-009 (campos obligatorios,
            ► formato de email, longitud mínima de mensaje)
        FIN FUNCIÓN

        PROCEDIMIENTO sanitizar()
            ► Sanitización de inputs antes del envío (RNF-006)
        FIN PROCEDIMIENTO

FIN ENTIDAD
```

### 3.10 ENTIDAD RedSocial

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: RedSocial
   FUENTE:  HU-007 (Conexión en Redes Sociales), RF-011, CU-007
   PROPÓSITO: Perfiles profesionales enlazados desde header y footer.
   ───────────────────────────────────────────────────────────── */
ENTIDAD RedSocial

    ATRIBUTOS
        nombreRed : enumerado
            ► LINKEDIN     (obligatorio, RF-011)
            ► GITHUB       (obligatorio, RF-011)
            ► TWITTER_X    (opcional, RF-011)
            ► MEDIUM_BLOG  (opcional, RF-011)
        urlPerfil : URL      ► Enlace al perfil profesional
        icono     : imagen   ► Ícono reconocible de la red (HU-007)
        ubicacion : enumerado ► {HEADER, FOOTER} — posicionamiento visible (HU-007, RF-011)

    MÉTODOS
        FUNCIÓN abrir() : acción
            ► Abre el perfil EN NUEVA PESTAÑA (HU-007, RF-011, CU-007 paso 3)
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.11 ENTIDAD ConfiguracionSitio

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: ConfiguracionSitio
   FUENTE:  RNF-002 (breakpoints), RNF-005 (SEO), RNF-010 (estética),
            RF-010 (patrón de nombre del CV), RF-012 (menú), HU-005
   ARCHIVO DE REFERENCIA: src/lib/constants.ts
   PROPÓSITO: Constantes centrales de diseño, SEO y navegación.
   ───────────────────────────────────────────────────────────── */
ENTIDAD ConfiguracionSitio

    ATRIBUTOS
        tituloSEO       : texto   ► "José Céspedes - [Título Profesional] | Portafolio" (RNF-005)
        descripcionSEO  : texto   ► Meta description de 150-160 caracteres (RNF-005)
        paletaColores   : lista<color>
            ► Profesional: azules, grises, blancos; máximo 3-4 colores (RNF-010)
        tipografias     : lista<fuente>
            ► Google Fonts: Roboto, Open Sans, Montserrat (RNF-010)
        breakpoints     : enumerado
            ► MOBILE (320px-767px) · TABLET (768px-1023px)
            ► DESKTOP (1024px-1440px) · LARGE_DESKTOP (>1440px)   (RNF-002)
        seccionesNavegacion : lista<texto>
            ► [Inicio, Sobre Mí, Experiencia, Habilidades, Proyectos,
                Servicios, Contacto]  (RF-012)
        patronArchivoCV : texto   ► "CV_[Nombre]_[Año].pdf" (RF-010)
        ejemploArchivoCV: texto   ► "CV_Jose_Cespedes_2024.pdf" (§2.6, carpeta documents)
        tamanioMaximoCV : entero  ► Menor a 2 MB (HU-005: "Tamaño optimizado <2MB")
        rutaDocumentos  : texto   ► "/public/documents/" (§2.6)
        tamanoMinimoToque : entero ► 44x44 px — touch targets en móvil (HU-008, RNF-002)
        tipografiaBase  : entero  ► >16px en cuerpo (RNF-007: "Tipografía >16px, line-height 1.5")

    MÉTODOS
        FUNCIÓN obtenerBreakpoint(anchoPantalla: entero) : enumerado
            ► Determina el breakpoint activo según RNF-002
        FIN FUNCIÓN

FIN ENTIDAD
```

### 3.12 ENTIDAD EventoAnalitico

```texto
/* ─────────────────────────────────────────────────────────────
   ENTIDAD: EventoAnalitico
   FUENTE:  RNF-012 (Analytics y Monitoreo), §2.10 (Métricas de éxito),
            RNF-006 (privacidad: no tracking sin consentimiento)
   PROPÓSITO: Eventos de conversión y métricas a medir con GA4.
   ───────────────────────────────────────────────────────────── */
ENTIDAD EventoAnalitico

    ATRIBUTOS
        tipoEvento : enumerado
            ► DESCARGA_CV        (conversión: descargas de CV, §2.10)
            ► ENVIO_FORMULARIO   (conversión: envíos de formulario, §2.10)
        consentimientoOtorgado : lógico
            ► No se registra tracking sin consentimiento (RNF-006)
        metricasKPI : enumerado
            ► TASA_REBOTE · TIEMPO_EN_PAGINA · CONVERSIONES · FUENTES_TRAFICO (RNF-012)

    MÉTODOS
        FUNCIÓN registrar() : acción
            ► Envía el evento a Google Analytics 4 (RNF-012)
        FIN FUNCIÓN

FIN ENTIDAD
```

---

## 4. CAPA DE DATOS — REPOSITORIO DE CONTENIDO (JSON)

> **FUENTE:** §2.6 (src/data/*.json; justificación "Data-driven: JSON para fácil actualización de contenido");
> §2.9 Estrategia de Mantenimiento (editar JSON para nuevos proyectos, experiencia y certificaciones);
> RNF-009 (estructura compatible con Headless CMS futuro).

### 4.1 MÓDULO RepositorioContenido

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: RepositorioContenido
   FUENTE:  §2.6 (data-driven), §2.9 (mantenimiento de contenido),
            RNF-008 (modularización), RNF-009 (escalabilidad)
   ARCHIVO DE REFERENCIA: src/data/*.json
   PROPÓSITO: Capa única de acceso al contenido de la página.
              Sustituye a una base de datos: el contenido se edita
              en JSON sin tocar los componentes.
   ───────────────────────────────────────────────────────────── */
MÓDULO RepositorioContenido

    ► Archivos de datos declarados en §2.6:
    FUENTES DE DATOS
        experience.json   → lista<ExperienciaLaboral>
        skills.json       → lista<CategoriaHabilidad>
        projects.json     → lista<Proyecto>
        services.json     → lista<Servicio>
        testimonials.json → lista<Testimonio>
        education.json    → lista<EducacionYCertificacion>

    FUNCIÓN cargarExperiencia() : lista<ExperienciaLaboral>
        ► Lee experience.json y lo convierte en objetos del dominio
        ► ORDENA en orden cronológico inverso (RF-003)
    FIN FUNCIÓN

    FUNCIÓN cargarHabilidades() : lista<CategoriaHabilidad>
        ► Lee skills.json con sus 3 categorías (RF-004)
    FIN FUNCIÓN

    FUNCIÓN cargarProyectos() : lista<Proyecto>
        ► Lee projects.json para la galería (RF-005)
    FIN FUNCIÓN

    FUNCIÓN cargarServicios() : lista<Servicio>
        ► Lee services.json (RF-006)
    FIN FUNCIÓN

    FUNCIÓN cargarTestimonios() : lista<Testimonio>
        ► Lee testimonials.json (RF-007)
    FIN FUNCIÓN

    FUNCIÓN cargarEducacion() : lista<EducacionYCertificacion>
        ► Lee education.json (RF-008)
    FIN FUNCIÓN

    ► Mantenimiento declarado en §2.9:
    ► - Nuevos proyectos      → editar projects.json   (frecuencia mensual)
    ► - Experiencia laboral   → editar experience.json (frecuencia mensual)
    ► - Certificaciones       → editar education.json  (frecuencia mensual)

FIN MÓDULO
```

### 4.2 COMPONENTE PaginaPrincipal (page.tsx)

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: PaginaPrincipal
   FUENTE:  §2.6 (src/app/page.tsx), §2.7 (Mapa de navegación:
            orden de las secciones 1 a 9)
   PROPÓSITO: Ensamblar la landing page en el orden definido por
              el mapa de navegación del documento.
   ───────────────────────────────────────────────────────────── */
COMPONENTE PaginaPrincipal

    ENTRADAS
        (ninguna — el contenido se obtiene del RepositorioContenido)

    PROCEDIMIENTO renderizar()
        ► Compone las secciones en el orden del mapa de navegación (§2.7):
        ►   1. Hero       2. SobreMí         3. Experiencia
        ►   4. Habilidades 5. Proyectos       6. Servicios
        ►   7. Educación   8. Testimonios     9. Contacto
        contenido := RepositorioContenido
        mostrar SeccionHero(datosPerfil)
        mostrar SeccionSobreMi(datosBiografia)
        mostrar SeccionExperiencia(contenido.cargarExperiencia())
        mostrar SeccionHabilidades(contenido.cargarHabilidades())
        mostrar SeccionProyectos(contenido.cargarProyectos())
        mostrar SeccionServicios(contenido.cargarServicios())
        mostrar SeccionEducacion(contenido.cargarEducacion())
        mostrar SeccionTestimonios(contenido.cargarTestimonios())
        mostrar SeccionContacto()
    FIN PROCEDIMIENTO

FIN COMPONENTE
```

---

## 5. CAPA DE COMPONENTES — ESTRUCTURA (layout)

> **FUENTE:** §2.6 (src/components/layout/: Header.tsx, Footer.tsx, Navigation.tsx).

### 5.1 COMPONENTE LayoutRaiz

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: LayoutRaiz
   FUENTE:  §2.6 (src/app/layout.tsx), RNF-004 (estructura semántica
            HTML5), RNF-005 (SEO en cabecera)
   PROPÓSITO: Esqueleto semántico de la aplicación: cabecera,
              contenido principal y pie de página.
   ───────────────────────────────────────────────────────────── */
COMPONENTE LayoutRaiz

    ENTRADAS
        hijos : contenido  ► Página o páginas de la aplicación

    PROCEDIMIENTO renderizar()
        ► Estructura semántica HTML5 (RNF-004):
        estructura := <html>                       ► atributo de idioma
                       <head>
                          MetadatosSEO             ► provistos por Módulo Metadatos (§4.2 anterior)
                          fuentes tipográficas      ► Google Fonts: Roboto/Open Sans/Montserrat (RNF-010)
                       </head>
                       <body>
                          <Header />                ► RF-012
                          <main> hijos </main>      ► secciones de PaginaPrincipal
                          <Footer />                ► RF-013
                       </body>
        devolver estructura
    FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 5.2 COMPONENTE Header

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Header
   FUENTE:  RF-012 (Navegación Principal), HU-008 (Navegación
            Responsiva), §2.7 (HEADER Sticky), §2.8 (adaptaciones)
   ARCHIVO DE REFERENCIA: src/components/layout/Header.tsx
   PROPÓSITO: Barra superior fija con logo, menú, redes y CTA.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Header

    ENTRADAS
        configuracion  : ConfiguracionSitio
        redes          : lista<RedSocial>      ► ubicación: HEADER (RF-011)

    ESTADO INTERNO
        menuMovilAbierto : lógico               ► estado inicial: FALSO

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. Logo/Nombre → enlace a inicio (RF-012)
            ► 2. Componente Navigation          ► ítems del menú (RF-012)
            ► 3. Botón CTA destacado            ► "Descargar CV" (§2.7 sketch header)
            ► 4. Íconos de redes sociales       ► HU-007 (header)
            ► 5. SI anchoPantalla ≤ 767px ENTONCES
            ►       mostrar BotonHamburguesa (menú colapsado, §2.8 mobile)
            ►    SI_NO
            ►       mostrar menú completo       ► comportamiento sticky en desktop (RF-012)
            ►    FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alHacerClicEnHamburguesa()
            ► Conmuta menuMovilAbierto (abrir/cerrar menú móvil, HU-008)
            ► Actualiza atributo aria-expanded (RNF-004: aria labels donde corresponda)
        FIN EVENTO

        EVENTO alHacerClicEnItemMenu(destino)
            ► Navegación con smooth scroll hacia la sección destino (RF-014)
            ► SI menuMovilAbierto ENTONCES cerrar menú
            ► Cierre automático para continuar la lectura
        FIN EVENTO

FIN COMPONENTE
```

### 5.3 COMPONENTE Navigation

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Navigation
   FUENTE:  RF-012 (menú items), RNF-007 (3 clics máximo),
            RF-014 (smooth scroll)
   ARCHIVO DE REFERENCIA: src/components/layout/Navigation.tsx
   PROPÓSITO: Menú de navegación con los 7 ítems declarados.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Navigation

    ENTRADAS
        itemsMenu : lista<texto>
            ► Inicio · Sobre Mí · Experiencia · Habilidades ·
              Proyectos · Servicios · Contacto   (RF-012)
        estaAbierto : lógico   ► estado del menú en móvil (desde Header)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► PARA CADA item HASTA fin de itemsMenu HACER
            ►    mostrar enlace → sección correspondiente
            ► FIN_PARA
            ► SI NO estaAbierto Y anchoPantalla ≤ 767px ENTONCES
            ►    ocultar ítems (visible solo con menú hamburguesa, HU-008)
            ► FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alHacerClicEnItem(item)
            ► Smooth scroll a la sección (RF-014)
            ► Garantiza acceso a cualquier sección en ≤ 3 clics (RNF-007)
        FIN EVENTO

FIN COMPONENTE
```

### 5.4 COMPONENTE Footer

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Footer
   FUENTE:  RF-013 (Footer Informativo), RF-015 (CTA "Descargar CV"
            en footer), HU-007 (redes en footer), §2.7 (FOOTER)
   ARCHIVO DE REFERENCIA: src/components/layout/Footer.tsx
   PROPÓSITO: Pie de página con información complementaria.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Footer

    ENTRADAS
        configuracion : ConfiguracionSitio
        redes         : lista<RedSocial>   ► ubicación: FOOTER (RF-011)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. Copyright con año actualizado        (RF-013)
            ►    ► El checklist pre-deploy exige "Actualizar fecha en footer" (§2.9)
            ► 2. Enlaces rápidos a secciones          (RF-013)
            ► 3. Íconos de redes sociales             (RF-013, HU-007)
            ► 4. Email de contacto                    (RF-013)
            ► 5. Mensaje de tecnologías usadas        (RF-013 — OPCIONAL)
            ► 6. BotonDescargarCV                     (RF-015: CTA "Descargar CV" en footer)
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

---

## 6. CAPA DE COMPONENTES — SECCIONES

> **FUENTE:** §2.6 (src/components/sections/: Hero, About, Experience, Skills, Projects, Services,
> Testimonials, Education, Contact); §2.7 (contenido de cada sección); RF-001 a RF-009.

### 6.1 COMPONENTE SeccionHero

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionHero
   FUENTE:  HU-001, RF-001, CU-001, RF-015 (CTAs del hero),
            §2.7 (Hero), RNF-001 (imágenes WebP + lazy loading)
   ARCHIVO DE REFERENCIA: src/components/sections/Hero.tsx
   PROPÓSITO: Presentación inicial visible en los primeros
              3 segundos de carga (criterio de aceptación HU-001).
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionHero

    ENTRADAS
        perfil : PerfilProfesional
        redes  : lista<RedSocial>          ► redes visibles en Hero (§2.7)

    ESTADO INTERNO
        estadoFoto : enumerado { CARGANDO, CARGADA, ERROR }
            ► estado inicial: CARGANDO
            ► soporta los flujos alternativos de CU-001

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. Nombre completo como H1 de tamaño destacado       (RF-001)
            ► 2. Título profesional como subtítulo descriptivo     (RF-001)
            ► 3. Tagline: frase de valor en 1-2 líneas             (RF-001)
            ► 4. Foto profesional de alta resolución:
            ►    SEGÚN estadoFoto HACER
            ►      CASO CARGANDO → mostrar PLACEHOLDER
            ►                      ► CU-001 flujo alternativo: "Conexión lenta: mostrar placeholder"
            ►      CASO CARGADA  → mostrar imagen WebP (RNF-001)
            ►      CASO ERROR    → mostrar mensaje "reintentar"
            ►                      ► CU-001 flujo alternativo: "Error de carga: mensaje de reintentar"
            ►    FIN_SEGÚN
            ► 5. CTA primario: "Contáctame" | "Ver Proyectos"      (RF-001, RF-015)
            ►    ► Lleva a la sección Contacto o a la galería de proyectos
            ► 6. Íconos de redes sociales                          (§2.7)
        FIN PROCEDIMIENTO

        EVENTO alTerminarCargaDeFoto()
            ► estadoFoto := CARGADA
            ► ► La foto es el LCP de la sección: debe cumplir < 2.5 s (RNF-001)
        FIN EVENTO

        EVENTO alFallarCargaDeFoto()
            ► estadoFoto := ERROR → se muestra opción de reintentar (CU-001)
        FIN EVENTO

FIN COMPONENTE
```

### 6.2 COMPONENTE SeccionSobreMi

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionSobreMi
   FUENTE:  RF-002 (Sección "Sobre Mí"), §2.7 (Sobre Mí),
            §2.8 (imagen + texto 60% en desktop)
   ARCHIVO DE REFERENCIA: src/components/sections/About.tsx
   PROPÓSITO: Presentación extendida del profesional.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionSobreMi

    ENTRADAS
        biografia : Biografia

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. Biografía profesional de 200-300 palabras   (RF-002)
            ► 2. Áreas de especialización como listado       (RF-002)
            ► 3. Valores profesionales                       (RF-002)
            ► 4. SI biografia.imagenComplementaria EXISTE ENTONCES
            ►       mostrar imagen complementaria            (RF-002 — opcional)
            ►    FIN_SI
            ► ► Responsivo: 1 columna en móvil, texto a 60% en desktop (§2.8)
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 6.3 COMPONENTE SeccionExperiencia

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionExperiencia
   FUENTE:  HU-002, RF-003, CU-002, §2.7 (Timeline vertical),
            §2.8 (timeline simple en móvil)
   ARCHIVO DE REFERENCIA: src/components/sections/Experience.tsx
   PROPÓSITO: Timeline de la trayectoria laboral.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionExperiencia

    ENTRADAS
        experiencias : lista<ExperienciaLaboral>   ► ya ordenadas
                          ► ORDEN CRONOLÓGICO INVERSO (RF-003)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Timeline visual vertical (§2.7)
            ► PARA CADA experiencia HASTA fin de experiencias HACER
            ►    1. Cargo y empresa                            (RF-003)
            ►    2. Período: "mes/año - mes/año" o "presente"  (RF-003)
            ►    3. Responsabilidades principales              (RF-003)
            ►    4. Logros cuantificables: 3-5 viñetas         (RF-003, HU-002)
            ► FIN_PARA
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 6.4 COMPONENTE SeccionHabilidades

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionHabilidades
   FUENTE:  HU-003, RF-004, CU-003, §2.7 (Tabs/Accordion por
            categoría + skill bars)
   ARCHIVO DE REFERENCIA: src/components/sections/Skills.tsx
   PROPÓSITO: Visualización categorizada de competencias técnicas.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionHabilidades

    ENTRADAS
        categorias : lista<CategoriaHabilidad>
            ► 1. Tecnologías de la Información
            ► 2. Análisis de Datos
            ► 3. Seguridad y Monitoreo           (RF-004)

    ESTADO INTERNO
        categoriaActiva : entero ► índice de la categoría visible
                          ► presentación en Tabs/Accordion (§2.7)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► PARA CADA categoria HASTA fin de categorias HACER
            ►    SI categoria.índice = categoriaActiva ENTONCES
            ►       mostrar tecnologías de la categoría
            ►       PARA CADA tecnologia HASTA fin HACER
            ►          mostrar nombre + ícono            (HU-003)
            ►          mostrar SkillBar(nivelDominio)    (HU-003: barras/porcentajes)
            ►          SI tecnologia.certificacionesAsociadas EXISTEN ENTONCES
            ►             mostrar certificaciones asociadas (RF-004)
            ►          FIN_SI
            ►       FIN_PARA
            ►    FIN_SI
            ► FIN_PARA
        FIN PROCEDIMIENTO

        EVENTO alSeleccionarCategoria(indice)
            ► categoriaActiva := indice
            ► ► Permite al usuario evaluar las 3 categorías (CU-003)
        FIN EVENTO

FIN COMPONENTE
```

### 6.5 COMPONENTE SeccionProyectos

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionProyectos
   FUENTE:  HU-004, RF-005, CU-004, RF-015 (CTA "Ver más proyectos"),
            §2.7 (grid 3 columnas, filtros, modal, CTA GitHub),
            §2.8 (1 columna móvil / 2 tablet / 3-4 desktop)
   ARCHIVO DE REFERENCIA: src/components/sections/Projects.tsx
   PROPÓSITO: Galería de proyectos con filtros y detalle modal.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionProyectos

    ENTRADAS
        proyectos : lista<Proyecto>

    ESTADO INTERNO
        filtroCategoria   : texto | VACÍO   ► filtro activo; VACÍO = "todos" (RF-005 opcional)
        proyectoEnDetalle : Proyecto | VACÍO ► proyecto abierto en modal (CU-004)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. SI filtros habilitados ENTONCES  ► RF-005: "Filtros por categoría (opcional)"
            ►       mostrar controles de filtro por categoría
            ►    FIN_SI
            ► 2. Grid responsivo de TarjetaProyecto:
            ►    ► 1 columna móvil · 2 tablet · 3 desktop · 4 large (§2.7, §2.8)
            ►    PARA CADA proyecto HASTA fin de proyectos HACER
            ►       SI proyecto.coincideConFiltro(filtroCategoria) ENTONCES
            ►          mostrar TarjetaProyecto(proyecto)
            ►       FIN_SI
            ►    FIN_PARA
            ► 3. CTA "Ver más proyectos"        (RF-015)
            ►    y CTA "Ver más en GitHub"      (§2.7 mapa de navegación)
            ► 4. SI proyectoEnDetalle ≠ VACÍO ENTONCES
            ►       mostrar Modal(proyectoEnDetalle)
            ►       ► Contenido del modal: descripción, tecnologías y resultados (CU-004)
            ►    FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alSeleccionarProyecto(proyecto)
            ► proyectoEnDetalle := proyecto → abre vista detallada en modal (CU-004 paso 3-4)
        FIN EVENTO

        EVENTO alCambiarFiltro(categoria)
            ► filtroCategoria := categoria
            ► ► Flujo alternativo de CU-004: "Usuario filtra por categoría"
        FIN EVENTO

        EVENTO alCerrarDetalle()
            ► proyectoEnDetalle := VACÍO
        FIN EVENTO

FIN COMPONENTE
```

### 6.6 COMPONENTE SeccionServicios

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionServicios
   FUENTE:  HU-010, RF-006, RF-015 (CTA "Solicitar consulta"),
            §2.7 (cards icon + descripción)
   ARCHIVO DE REFERENCIA: src/components/sections/Services.tsx
   PROPÓSITO: Listado de servicios profesionales ofrecidos.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionServicios

    ENTRADAS
        servicios : lista<Servicio>
            ► Consultoría en TI · Análisis de datos
            ► Implementación de sistemas de seguridad · Auditorías técnicas (RF-006)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► PARA CADA servicio HASTA fin de servicios HACER
            ►    mostrar Card con:
            ►      1. Ícono representativo                (RF-006, HU-010)
            ►      2. Nombre del servicio                 (RF-006)
            ►      3. Descripción breve                   (HU-010)
            ►      4. CTA "Solicitar consulta"            (RF-015)
            ►         ► dirige a la sección Contacto
            ► FIN_PARA
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 6.7 COMPONENTE SeccionTestimonios

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionTestimonios
   FUENTE:  HU-009, RF-007, CU-008
   ARCHIVO DE REFERENCIA: src/components/sections/Testimonials.tsx
   PROPÓSITO: Recomendaciones de empleadores/clientes.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionTestimonios

    ENTRADAS
        testimonios : lista<Testimonio>

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Formato: SLIDER o GRID de tarjetas (RF-007)
            ► PARA CADA testimonio HASTA fin de testimonios HACER
            ►    1. Texto del testimonio                    (RF-007)
            ►    2. Nombre del recomendador                 (HU-009, RF-007)
            ►    3. Cargo y empresa                         (HU-009, RF-007)
            ►    4. SI testimonio.foto EXISTE ENTONCES
            ►          mostrar foto del recomendador        (RF-007 — opcional)
            ►       FIN_SI
            ► FIN_PARA
        FIN PROCEDIMIENTO

        ► Interacción de slider (si aplica): navegación entre tarjetas
        ► con controles accesibles por teclado (RNF-004)

FIN COMPONENTE
```

### 6.8 COMPONENTE SeccionEducacion

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionEducacion
   FUENTE:  RF-008, §2.7 (Timeline académico + badges)
   ARCHIVO DE REFERENCIA: src/components/sections/Education.tsx
   PROPÓSITO: Formación académica y certificaciones.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionEducacion

    ENTRADAS
        educacion : lista<EducacionYCertificacion>

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Timeline académico (§2.7)
            ► PARA CADA registro HASTA fin de educacion HACER
            ►    1. Título académico                       (RF-008)
            ►    2. Institución                            (RF-008)
            ►    3. Año                                    (RF-008)
            ►    4. PARA CADA certificacion HASTA fin HACER
            ►          mostrar certificación + entidad certificadora (RF-008)
            ►          SI certificacion.badgeDigital EXISTE ENTONCES
            ►             mostrar badge digital            (RF-008 — si aplica)
            ►          FIN_SI
            ►       FIN_PARA
            ► FIN_PARA
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 6.9 COMPONENTE SeccionContacto

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: SeccionContacto
   FUENTE:  HU-006, RF-009, CU-006, §2.7 (formulario + información
            de contacto directo), RNF-006 (protección CSRF,
            validación cliente y servidor, sanitización)
   ARCHIVO DE REFERENCIA: src/components/sections/Contact.tsx
   PROPÓSITO: Canal de comunicación directa con el profesional.
   ───────────────────────────────────────────────────────────── */
COMPONENTE SeccionContacto

    ENTRADAS
        (ninguna directa — usa ServicioValidacion y ConectorEmail)

    ESTADO INTERNO
        formulario : MensajeContacto        ► campos: nombre, email, asunto, mensaje (RF-009)
        estadoEnvio : enumerado { INACTIVO, VALIDANDO, ENVIANDO, ENVIADO, ERROR }
            ► estado inicial: INACTIVO
            ► ► estados de carga y éxito/error exigidos por RF-009 y §2.7 (Feedback Visual)
        listaErrores : lista<ErrorValidacion>

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► 1. Formulario con campos (RF-009):
            ►      nombre (requerido) · email (requerido) · asunto (requerido)
            ►      mensaje (requerido, textarea) · botón enviar
            ►    ► Accesible: etiquetas y aria en cada campo (RNF-004)
            ► 2. SI listaErrores NO VACÍA ENTONCES
            ►       mostrar mensajes de error claros por campo (RNF-007)
            ►    FIN_SI
            ► 3. SEGÚN estadoEnvio HACER
            ►      CASO ENVIANDO → mostrar indicador de carga (§2.7: loading states)
            ►      CASO ENVIADO  → mostrar mensaje de confirmación de envío (RF-009)
            ►      CASO ERROR    → mostrar mensaje de error y opción de reintentar (CU-006)
            ►    FIN_SEGÚN
            ► 4. Canales alternativos de contacto: email, teléfono, LinkedIn
            ►    ► HU-006: "Múltiples canales alternativos (email, teléfono, LinkedIn)"
        FIN PROCEDIMIENTO

        EVENTO alEnviarFormulario()
            ► ► FLUJO PRINCIPAL DE CU-006 (pasos 4 a 7):
            ► 1. estadoEnvio := VALIDANDO
            ► 2. listaErrores := formulario.validar()
            ►    ► Validación CLIENTE: obligatorios, formato email, longitud mínima (RF-009)
            ► 3. SI listaErrores NO VACÍA ENTONCES
            ►       estadoEnvio := ERROR
            ►       ► CU-006 flujo alternativo: "Validación falla: mostrar errores"
            ►       TERMINAR EVENTO
            ►    FIN_SI
            ► 4. formulario.sanitizar()                  ► sanitización de inputs (RNF-006)
            ► 5. estadoEnvio := ENVIANDO
            ► 6. resultado := ConectorEmail.enviarMensaje(formulario)
            ►    ► Incluye validación SERVIDOR y protección CSRF (RNF-006)
            ► 7. SI resultado = EXITO ENTONCES
            ►       estadoEnvio := ENVIADO
            ►       mostrar confirmación                 (CU-006 paso 7)
            ►       EventoAnalitico.registrar(ENVIO_FORMULARIO)  ► conversión (RNF-012)
            ►    SI_NO
            ►       estadoEnvio := ERROR
            ►       ► CU-006 flujo alternativo: "Error de envío: mensaje de error y reintentar"
            ►    FIN_SI
        FIN EVENTO

FIN COMPONENTE
```

---

## 7. CAPA DE COMPONENTES — UI REUTILIZABLE

> **FUENTE:** §2.6 (src/components/ui/: Button, Card, Modal, SkillBar, ProjectCard);
> §2.7 Principios de Diseño UX (Ley de Similaridad, Feedback Visual); HU-008; RNF-004.

### 7.1 COMPONENTE Boton

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Boton
   FUENTE:  RF-014 (hover effects en botones), RF-015 (diseño
            consistente, destacado, contrastante), HU-008 (touch
            targets ≥44px), RNF-007 (feedback visual), RNF-010
   ARCHIVO DE REFERENCIA: src/components/ui/Button.tsx
   PROPÓSITO: Botón único y consistente para todos los CTA.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Boton

    ENTRADAS
        texto      : texto
        variante   : enumerado { PRIMARIO, SECUNDARIO }
            ► CTA primario/secundario del Hero (RF-001, §2.8)
        accion     : acción   ► comportamiento al hacer clic
        esDestacado: lógico   ► botón CTA destacado del header (RF-012)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Estilo idéntico en todo el sitio (Ley de Similaridad, §2.7)
            ► Color contrastante con la paleta (RF-015: destacado, contrastante;
              RNF-010: contraste adecuado)
            ► Área interactiva mínima: 44x44 px en móvil (HU-008, RNF-002)
            ► Hover visible al pasar el cursor (RF-014, §2.7 feedback visual)
            ► Foco visible para navegación por teclado (RNF-004)
        FIN PROCEDIMIENTO

        EVENTO alHacerClic()
            ► ejecutar accion  ► p. ej. descargar CV, ir a sección, abrir enlace
        FIN EVENTO

FIN COMPONENTE
```

### 7.2 COMPONENTE Tarjeta

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Tarjeta
   FUENTE:  RF-014 (hover effects en cards), §2.7 (cards de
            proyectos con formato uniforme)
   ARCHIVO DE REFERENCIA: src/components/ui/Card.tsx
   PROPÓSITO: Contenedor visual uniforme para proyectos,
              servicios y testimonios.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Tarjeta

    ENTRADAS
        contenido : contenido   ► texto, imagen, botones internos
        variante  : enumerado { PROYECTO, SERVICIO, TESTIMONIO }

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Formato uniforme en todo el sitio (§2.7: cards con formato uniforme)
            ► Efecto hover suave (RF-014)
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 7.3 COMPONENTE Modal

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: Modal
   FUENTE:  RF-005 (vista detallada en modal), CU-004 (sistema
            muestra detalle modal/página), RNF-004 (navegación
            por teclado completa, aria labels)
   ARCHIVO DE REFERENCIA: src/components/ui/Modal.tsx
   PROPÓSITO: Vista de detalle superpuesta para el proyecto
              seleccionado.
   ───────────────────────────────────────────────────────────── */
COMPONENTE Modal

    ENTRADAS
        contenido : contenido    ► detalle del proyecto: descripción,
                                  ► tecnologías y resultados (CU-004)
        estaAbierto : lógico
        alCerrar    : acción

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► SI estaAbierto ENTONCES
            ►    mostrar fondo oscurecido (backdrop)
            ►    mostrar panel con contenido
            ►    ► Atributos aria para anunciar el diálogo (RNF-004)
            ► FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alPresionarTeclaEscape()
            ► cerrar modal ► navegación por teclado completa (RNF-004)
        FIN EVENTO

        EVENTO alHacerClicEnFondo()
            ► cerrar modal
        FIN EVENTO

        EVENTO alCerrarModal()
            ► mover el foco de vuelta a la tarjeta que lo abrió (RNF-004)
            ► ejecutar alCerrar
        FIN EVENTO

FIN COMPONENTE
```

### 7.4 COMPONENTE BarraHabilidad

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: BarraHabilidad
   FUENTE:  HU-003 (nivel de dominio visual: barras, porcentajes),
            RF-004, §2.7 (skill bars con nivel)
   ARCHIVO DE REFERENCIA: src/components/ui/SkillBar.tsx
   PROPÓSITO: Representación visual del nivel de dominio de una
              tecnología.
   ───────────────────────────────────────────────────────────── */
COMPONENTE BarraHabilidad

    ENTRADAS
        nombreTecnologia : texto
        nivelDominio     : porcentaje   ► valor 0-100

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Mostrar nombre de la tecnología + ícono (HU-003)
            ► Mostrar barra con relleno proporcional a nivelDominio
            ► Mostrar porcentaje numérico junto a la barra (HU-003)
            ► ► Texto alternativo para lectores de pantalla (RNF-004)
        FIN PROCEDIMIENTO

FIN COMPONENTE
```

### 7.5 COMPONENTE TarjetaProyecto

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: TarjetaProyecto
   FUENTE:  RF-005 (elementos de cada proyecto), HU-004,
            CU-004, RNF-001 (imágenes WebP + lazy loading)
   ARCHIVO DE REFERENCIA: src/components/ui/ProjectCard.tsx
   PROPÓSITO: Tarjeta individual dentro del grid de proyectos.
   ───────────────────────────────────────────────────────────── */
COMPONENTE TarjetaProyecto

    ENTRADAS
        proyecto : Proyecto
        alSeleccionar : acción   ► abre el modal de detalle

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Usa Tarjeta (variante PROYECTO)
            ► 1. Imagen representativa (WebP, lazy loading → RNF-001)
            ► 2. Título del proyecto                       (RF-005)
            ► 3. Descripción breve                         (RF-005)
            ► 4. Tags de tecnologías utilizadas            (RF-005)
            ► 5. Enlace a detalle o demo                   (RF-005, HU-004)
        FIN PROCEDIMIENTO

        EVENTO alHacerClicEnTarjeta()
            ► alSeleccionar(proyecto) ► dispara el modal (CU-004 paso 3)
        FIN EVENTO

FIN COMPONENTE
```

---

## 8. CAPA DE COMPONENTES — COMUNES

> **FUENTE:** §2.6 (src/components/common/: SocialLinks, DownloadCV, ScrollToTop).

### 8.1 COMPONENTE EnlacesRedes

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: EnlacesRedes
   FUENTE:  HU-007, RF-011, CU-007, RNF-006 (apertura segura)
   ARCHIVO DE REFERENCIA: src/components/common/SocialLinks.tsx
   PROPÓSITO: Íconos enlazados a los perfiles profesionales,
              reutilizados en Header, Hero y Footer.
   ───────────────────────────────────────────────────────────── */
COMPONENTE EnlacesRedes

    ENTRADAS
        redes     : lista<RedSocial>
        ubicacion : enumerado { HEADER, FOOTER, HERO }
            ► posicionamiento visible (HU-007: header/footer; §2.7: hero)

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► PARA CADA red HASTA fin de redes HACER
            ►    mostrar ícono reconocible de la red (HU-007)
            ►    ► LinkedIn y GitHub son obligatorios; Twitter/X y
            ►      Medium/Blog son opcionales (RF-011)
            ► FIN_PARA
        FIN PROCEDIMIENTO

        EVENTO alHacerClicEnRed(red)
            ► red.abrir() → abre el perfil EN NUEVA PESTAÑA (HU-007, RF-011, CU-007)
        FIN EVENTO

FIN COMPONENTE
```

### 8.2 COMPONENTE BotonDescargarCV

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: BotonDescargarCV
   FUENTE:  HU-005, RF-010, CU-005, RF-015 (múltiples ubicaciones),
            §2.9 (mantenimiento trimestral del PDF)
   ARCHIVO DE REFERENCIA: src/components/common/DownloadCV.tsx
   PROPÓSITO: Botón destacado que inicia la descarga del CV.
   ───────────────────────────────────────────────────────────── */
COMPONENTE BotonDescargarCV

    ENTRADAS
        configuracion : ConfiguracionSitio   ► patrón de nombre y ruta del PDF

    ESTADO INTERNO
        estadoDescarga : enumerado { INACTIVA, DESCARGANDO, ERROR }

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► Botón destacado (RF-010: "Botón destacado (múltiples ubicaciones)")
            ► Ubicaciones: Header · Hero-CTA · Footer (§2.7, §2.8, RF-015)
            ► Archivo referenciado: "CV_[Nombre]_[Año].pdf" (RF-010)
            ►   ejemplo declarado: CV_Jose_Cespedes_2024.pdf (§2.6)
            ► SI estadoDescarga = ERROR ENTONCES
            ►    mostrar mensaje de error con opción de reintentar (CU-005)
            ► FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alHacerClic()
            ► ► FLUJO PRINCIPAL DE CU-005 (pasos 2 a 4):
            ► 1. estadoDescarga := DESCARGANDO
            ► 2. iniciar descarga del PDF desde configuracion.rutaDocumentos
            ► 3. INTENTAR
            ►       SI archivo.seEntregaCorrectamente ENTONCES
            ►          ► Archivo se guarda en el dispositivo del usuario (CU-005)
            ►          ► Verificación: PDF < 2 MB (HU-005)
            ►          estadoDescarga := INACTIVA
            ►          EventoAnalitico.registrar(DESCARGA_CV) ► conversión (RNF-012)
            ►       FIN_SI
            ►    CAPTURAR_ERROR
            ►       estadoDescarga := ERROR
            ►       ► CU-005 flujo alternativo: "Error de descarga: mostrar mensaje
            ►         y reintentar"
            ►    FIN_INTENTAR
        FIN EVENTO

FIN COMPONENTE
```

### 8.3 COMPONENTE BotonIrArriba

```texto
/* ─────────────────────────────────────────────────────────────
   COMPONENTE: BotonIrArriba
   FUENTE:  §2.6 (src/components/common/ScrollToTop.tsx),
            RF-014 (smooth scroll), RNF-007 (usabilidad)
   ARCHIVO DE REFERENCIA: src/components/common/ScrollToTop.tsx
   PROPÓSITO: Retorno rápido al inicio de la página.
   ───────────────────────────────────────────────────────────── */
COMPONENTE BotonIrArriba

    ESTADO INTERNO
        esVisible : lógico   ► FALSO al inicio

    COMPORTAMIENTO
        PROCEDIMIENTO renderizar()
            ► SI esVisible ENTONCES mostrar botón "subir"
            ► FIN_SI
        FIN PROCEDIMIENTO

        EVENTO alDesplazarPagina(posicion)
            ► esVisible := (posicion supera la altura del Hero)
            ► ► Evita "dead ends" en páginas largas (§2.7: Eliminación de dead ends)
        FIN EVENTO

        EVENTO alHacerClic()
            ► smooth scroll hasta el inicio de la página (RF-014)
        FIN EVENTO

FIN COMPONENTE
```

---

## 9. CAPA DE SERVICIOS Y CONECTORES

> **FUENTE:** §2.6 (src/lib/: constants.ts, utils.ts, validators.ts); §2.6 Opción 1 (EmailJS);
> RNF-001 a RNF-012. Esta capa centraliza la lógica transversal reutilizada por los componentes.

### 9.1 SERVICIO Validacion

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Validacion
   FUENTE:  RF-009 (validaciones del formulario), RNF-006
            (validación cliente y servidor, sanitización),
            RNF-007 (mensajes de error claros)
   ARCHIVO DE REFERENCIA: src/lib/validators.ts
   PROPÓSITO: Reglas de validación de los campos de contacto.
   ───────────────────────────────────────────────────────────── */
SERVICIO Validacion

    FUNCIÓN validarNombre(nombre: texto) : ErrorValidacion | VACÍO
        ► SI nombre está vacío ENTONCES
        ►    devolver error "El nombre es obligatorio"      (RF-009)
        ► SI_NO devolver VACÍO
        ► FIN_SI
    FIN FUNCIÓN

    FUNCIÓN validarEmail(email: texto) : ErrorValidacion | VACÍO
        ► SI email está vacío ENTONCES devolver error "El email es obligatorio"
        ► SI_NO SI formato(email) NO es email válido ENTONCES
        ►    devolver error "Formato de email no válido"    (RF-009: formato válido)
        ► SI_NO devolver VACÍO
        ► FIN_SI FIN_SI
    FIN FUNCIÓN

    FUNCIÓN validarAsunto(asunto: texto) : ErrorValidacion | VACÍO
        ► SI asunto está vacío ENTONCES devolver error "El asunto es obligatorio"
        ► SI_NO devolver VACÍO
        ► FIN_SI
    FIN FUNCIÓN

    FUNCIÓN validarMensaje(mensaje: texto) : ErrorValidacion | VACÍO
        ► SI mensaje está vacío ENTONCES
        ►    devolver error "El mensaje es obligatorio"     (RF-009)
        ► SI_NO SI longitud(mensaje) < longitudMinima ENTONCES
        ►    devolver error "El mensaje es demasiado corto" (RF-009: longitud mínima)
        ► SI_NO devolver VACÍO
        ► FIN_SI FIN_SI
    FIN FUNCIÓN

    FUNCIÓN validarMensajeCompleto(m: MensajeContacto) : lista<ErrorValidacion>
        ► Combina las cuatro validaciones anteriores (campos: nombre, email, asunto, mensaje)
        ► ► Se ejecuta en CLIENTE (antes de enviar) y en SERVIDOR (al recibir) → RNF-006
    FIN FUNCIÓN

    FUNCIÓN sanitizarTexto(entrada: texto) : texto
        ► Elimina caracteres no permitidos / contenido inyectado (RNF-006: sanitización de inputs)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.2 CONECTOR Email

```texto
/* ─────────────────────────────────────────────────────────────
   CONECTOR: Email
   FUENTE:  §2.6 Opción 1 (React Hook Form + EmailJS: "Sin backend
            para emails"), RF-009 (EmailJS, Formspree, backend),
            CU-006, RNF-006 (rate limiting, protección CSRF)
   VARIABLES DE ENTORNO (declaradas en §2.9 Paso 3):
      NEXT_PUBLIC_EMAIL_SERVICE_ID  ·  NEXT_PUBLIC_EMAIL_TEMPLATE_ID
      NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
   PROPÓSITO: Único conector transaccional externo de la aplicación:
              entrega el mensaje de contacto al email del profesional.
   ───────────────────────────────────────────────────────────── */
CONECTOR Email

    FUNCIÓN enviarMensaje(mensaje: MensajeContacto) : resultado { EXITO, ERROR }
        ► 1. Verificar límite de envíos por tiempo → RATE LIMITING
        ►    ► RNF-006: "Rate limiting (prevenir spam)"
        ► 2. Adjuntar token de protección CSRF al envío (RNF-006)
        ► 3. Validación SERVIDOR de los campos (RNF-006: validación cliente y servidor)
        ► 4. Construir plantilla de correo con los datos:
        ►      nombre, email, asunto, mensaje (RF-009)
        ► 5. INTENTAR
        ►       enviar mediante EmailJS usando las credenciales de entorno
        ►       ► SERVICE_ID, TEMPLATE_ID, PUBLIC_KEY (§2.9 Paso 3)
        ►       SI respuesta = satisfactoria ENTONCES devolver EXITO
        ►    CAPTURAR_ERROR
        ►       ► CU-006 flujo alternativo: "Error de envío: mensaje de error y reintentar"
        ►       devolver ERROR
        ►    FIN_INTENTAR
    FIN FUNCIÓN

    ► Nota de diseño (RF-009): el conector está AISLADO del componente Contacto,
    ► de modo que puede sustituirse por Formspree o por un backend propio
    ► sin modificar la interfaz (RF-009: "EmailJS, Formspree, backend").

FIN CONECTOR
```

### 9.3 SERVICIO Navegacion

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Navegacion
   FUENTE:  RF-012 (menú fijo, sticky), RF-014 (smooth scroll),
            HU-008 (menú hamburguesa), RNF-007 (3 clics máximo)
   ARCHIVO DE REFERENCIA: src/lib/utils.ts
   PROPÓSITO: Comportamientos transversales de navegación.
   ───────────────────────────────────────────────────────────── */
SERVICIO Navegacion

    FUNCIÓN desplazarASeccion(destino: texto)
        ► Smooth scroll hasta la sección destino (RF-014)
        ► ► Usada por: menú, CTAs del Hero, CTA "Solicitar consulta"
    FIN FUNCIÓN

    FUNCIÓN conmutarMenuMovil(estadoActual: lógico) : lógico
        ► Abre/cierra el menú hamburguesa en móvil (HU-008)
        ► Devuelve el nuevo estado del menú
    FIN FUNCIÓN

    FUNCIÓN abrirEnNuevaPestana(url: URL)
        ► Abre redes sociales y enlaces externos en nueva pestaña (HU-007, RF-011)
    FIN FUNCIÓN

    FUNCIÓN verificarReglaTresClics(origen, destino) : lógico
        ► Comprueba que cualquier información sea alcanzable en ≤ 3 clics (RNF-007)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.4 SERVICIO Animaciones

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Animaciones
   FUENTE:  RF-014 (scroll reveal, hover, smooth scroll,
            transiciones suaves; RESTRICCIÓN: no afectar rendimiento),
            §2.6 Opción 1 (Framer Motion: scroll-triggered animations),
            RNF-001 (tiempos de carga)
   PROPÓSITO: Efectos visuales que mejoran UX sin degradar
              el rendimiento.
   ───────────────────────────────────────────────────────────── */
SERVICIO Animaciones

    FUNCIÓN animarAparicionAlDesplazar(elemento)
        ► Scroll reveal en secciones (RF-014)
        ► Animación disparada por scroll (Framer Motion, §2.6)
    FIN FUNCIÓN

    FUNCIÓN animarHover(elemento)
        ► Hover effects en botones y cards (RF-014)
    FIN FUNCIÓN

    FUNCIÓN animarTransicion(elemento, tipo)
        ► Transiciones suaves entre estados (RF-014)
    FIN FUNCIÓN

    FUNCIÓN evaluarRestriccionRendimiento() : lógico
        ► ► RESTRICCIÓN OBLIGATORIA DE RF-014: "No afectar rendimiento"
        ► SI dispositivo es de gama baja O conexión es lenta ENTONCES
        ►    desactivar animaciones no esenciales
        ►    ► Protege FCP < 1.5 s y TTI < 3.5 s (RNF-001)
        ►    devolver FALSO
        ► SI_NO devolver VERDADERO
        ► FIN_SI
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.5 SERVICIO SEO

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: SEO
   FUENTE:  RNF-005 (meta tags, estructura, Schema.org),
            §2.6 (metadata.ts), §2.6 (robots.txt, sitemap en public/)
   ARCHIVO DE REFERENCIA: src/app/metadata.ts · public/robots.txt
   PROPÓSITO: Visibilidad e indexación de la página en buscadores.
   ───────────────────────────────────────────────────────────── */
SERVICIO SEO

    FUNCIÓN generarMetadatos() : metadatos
        ► 1. Title: "José Céspedes - [Título Profesional] | Portafolio" (RNF-005)
        ► 2. Description: 150-160 caracteres                       (RNF-005)
        ► 3. Open Graph para redes sociales                        (RNF-005)
        ► 4. Twitter Cards                                         (RNF-005)
        ► 5. Markup Schema.org de tipo Person/Professional         (RNF-005)
        ► 6. Jerarquía de headings H1-H6 correcta                  (RNF-005)
        ► ► H1 único: nombre en el Hero (RF-001); H2 por sección
    FIN FUNCIÓN

    FUNCIÓN generarSitemap() : archivo
        ► sitemap.xml con las URLs semánticas de las secciones (RNF-005)
    FIN FUNCIÓN

    FUNCIÓN generarRobots() : archivo
        ► robots.txt para permitir indexación (RNF-005, §2.6 public/robots.txt)
    FIN FUNCIÓN

    ► Soporte estructural: Next.js aporta SSR/SSG para SEO (§2.6 justificación
    ► de la Opción 1: "Next.js: SEO crítico para visibilidad en búsquedas")

FIN SERVICIO
```

### 9.6 SERVICIO Analitica

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Analitica
   FUENTE:  RNF-012 (GA4, Search Console, Lighthouse CI),
            §2.10 (métricas y KPIs), RNF-006 (privacidad:
            no tracking sin consentimiento)
   PROPÓSITO: Medición de comportamiento y conversiones.
   ───────────────────────────────────────────────────────────── */
SERVICIO Analitica

    FUNCIÓN inicializar()
        ► 1. SI usuario NO ha otorgado consentimiento ENTONCES
        ►       no activar tracking ► RNF-006: "No tracking sin consentimiento"
        ►       TERMINAR FUNCIÓN
        ►    FIN_SI
        ► 2. Cargar Google Analytics 4 (RNF-012)
    FIN FUNCIÓN

    FUNCIÓN registrarEvento(evento: EventoAnalitico)
        ► SI evento.consentimientoOtorgado = VERDADERO ENTONCES
        ►    enviar evento a GA4
        ►    ► Conversiones medidas: descargas de CV y envíos de formulario (§2.10)
        ► FIN_SI
    FIN FUNCIÓN

    FUNCIÓN recopilarMetricas() : metricas
        ► Métricas clave (RNF-012): tasa de rebote, tiempo en página,
        ► conversiones (descargas CV, envíos formulario), fuentes de tráfico
    FIN FUNCIÓN

    FUNCIÓN auditarRendimiento()
        ► Lighthouse CI continuo (RNF-012) contra los KPIs de §2.10:
        ► carga < 3 s · performance > 90 · SEO > 95 · accesibilidad > 90
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.7 SERVICIO Accesibilidad

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Accesibilidad
   FUENTE:  RNF-004 (WCAG 2.1 Nivel AA: contraste 4.5:1,
            navegación por teclado, alt, semántica HTML5, aria,
            formularios accesibles; testing Lighthouse/axe)
   PROPÓSITO: Garantías de accesibilidad aplicadas en toda la app.
   ───────────────────────────────────────────────────────────── */
SERVICIO Accesibilidad

    FUNCIÓN verificarContraste(colorTexto, colorFondo) : lógico
        ► Contraste mínimo 4.5:1 (RNF-004)
    FIN FUNCIÓN

    FUNCIÓN verificarNavegacionTeclado()
        ► Todos los elementos interactivos alcanzables con teclado (RNF-004)
        ► Incluye: menú, modal (Escape, foco), slider, formulario
    FIN FUNCIÓN

    FUNCIÓN validarTextoAlternativo(imagen) : lógico
        ► Etiquetas alt en todas las imágenes (RNF-004)
    FIN FUNCIÓN

    FUNCIÓN validarAriaLabels(componente) : lógico
        ► Aria labels donde corresponda (RNF-004)
        ► Ej.: menuAbierto ↔ aria-expanded; modal ↔ role="dialog"
    FIN FUNCIÓN

    FUNCIÓN auditar()
        ► Ejecuta Lighthouse y axe DevTools (RNF-004 testing)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.8 SERVICIO Rendimiento

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Rendimiento
   FUENTE:  RNF-001 (carga <3s, FCP <1.5s, LCP <2.5s, TTI <3.5s;
            WebP + lazy loading; minificación CSS/JS), RNF-012
            (Lighthouse CI), §2.10 (KPIs)
   PROPÓSITO: Garantizar los tiempos de carga exigidos.
   ───────────────────────────────────────────────────────────── */
SERVICIO Rendimiento

    FUNCIÓN optimizarImagenes()
        ► Convierte/usa formato WebP (RNF-001)
        ► Aplica lazy loading a imágenes fuera del primer viewport (RNF-001)
    FIN FUNCIÓN

    FUNCIÓN minificarRecursos()
        ► Minificación de CSS y JavaScript en el build (RNF-001)
        ► ► En la Opción 1 lo realiza automáticamente el build de Next.js (§2.6)
    FIN FUNCIÓN

    FUNCIÓN medirMetricasCarga() : metricas
        ► Devuelve: tiempo carga inicial, FCP, LCP, TTI (RNF-001)
        ► ► Objetivos: < 3 s · < 1.5 s · < 2.5 s · < 3.5 s
    FIN FUNCIÓN

    FUNCIÓN verificarCoreWebVitals() : lógico
        ► Valida Core Web Vitals óptimos (RNF-005: Performance)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.9 SERVICIO Responsividad

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Responsividad
   FUENTE:  RNF-002 (breakpoints, mobile-first, touch 44px),
            §2.8 (adaptaciones por dispositivo: 1/2/3-4 columnas,
            tipografía por rango), HU-008
   PROPÓSITO: Adaptación del diseño a los 4 rangos de pantalla.
   ───────────────────────────────────────────────────────────── */
SERVICIO Responsividad

    FUNCIÓN obtenerBreakpoint(ancho: entero) : enumerado
        ► SEGÚN ancho HACER
        ►   CASO 320-767   → MOBILE
        ►   CASO 768-1023  → TABLET
        ►   CASO 1024-1440 → DESKTOP
        ►   OTRO_CASO      → LARGE_DESKTOP   ► >1440 (RNF-002)
        ► FIN_SEGÚN
    FIN FUNCIÓN

    FUNCIÓN obtenerColumnasGrid(seccion) : entero
        ► Proyectos: 1 columna (móvil) · 2 (tablet) · 3 (desktop) · 4 (large)
        ► ► §2.7 (grid 3 columnas) y §2.8 (cards 1/2/3-4 columnas)
    FIN FUNCIÓN

    FUNCIÓN obtenerTipografiaBase(breakpoint) : entero
        ► 14-16px móvil · 16px tablet · 16-18px desktop (§2.8)
        ► ► Mínimo global: >16px en cuerpo y line-height 1.5 (RNF-007)
    FIN FUNCIÓN

    FUNCIÓN verificarTouchTargets() : lógico
        ► Botones y enlaces ≥ 44x44 px en móvil (HU-008, RNF-002)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.10 SERVICIO Seguridad

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Seguridad
   FUENTE:  RNF-006 (HTTPS, CSRF, rate limiting, sanitización,
            headers de seguridad), RNF-011 (HTTPS automático Vercel)
   PROPÓSITO: Protección del formulario y de la comunicación.
   ───────────────────────────────────────────────────────────── */
SERVICIO Seguridad

    FUNCIÓN configurarHTTPS()
        ► Certificado SSL/TLS obligatorio (RNF-006)
        ► ► Vercel lo entrega automáticamente (RNF-011 / §2.6 Vercel: HTTPS automático)
    FIN FUNCIÓN

    FUNCIÓN configurarHeadersSeguridad() : headers
        ► Content-Security-Policy      (RNF-006)
        ► X-Frame-Options              (RNF-006)
        ► X-Content-Type-Options       (RNF-006)
    FIN FUNCIÓN

    FUNCIÓN protegerFormulario()
        ► Token CSRF en cada envío     (RNF-006)
        ► Rate limiting anti-spam      (RNF-006)
        ► Sanitización de inputs       (RNF-006)
        ► Validación cliente y servidor (RNF-006)
    FIN FUNCIÓN

FIN SERVICIO
```

### 9.11 SERVICIO Utilidades

```texto
/* ─────────────────────────────────────────────────────────────
   SERVICIO: Utilidades
   FUENTE:  §2.6 (src/lib/utils.ts), RNF-008 (modularización)
   ARCHIVO DE REFERENCIA: src/lib/utils.ts
   PROPÓSITO: Funciones auxiliares compartidas por los componentes.
   ───────────────────────────────────────────────────────────── */
SERVICIO Utilidades

    FUNCIÓN formatearPeriodo(inicio: fecha, fin: fecha | "Presente") : texto
        ► Produce "mes/año - mes/año" o "mes/año - presente" (RF-003)
    FIN FUNCIÓN

    FUNCIÓN construirNombreArchivoCV(patron, nombre, anio) : texto
        ► Aplica el patrón "CV_[Nombre]_[Año].pdf" (RF-010)
    FIN FUNCIÓN

    FUNCIÓN validarTamanioArchivo(archivo, maximoMB) : lógico
        ► Verifica CV < 2 MB (HU-005)
    FIN FUNCIÓN

FIN SERVICIO
```

---

## 10. CAPA DE CONFIGURACIÓN, ENTORNO Y DESPLIEGUE

> **FUENTE:** §2.9 Control de Versiones y Deployment (archivos de configuración, variables de entorno,
> pasos de despliegue en Vercel, estrategia de mantenimiento).

### 10.1 MÓDULO ConfiguracionPaquete (package.json)

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: ConfiguracionPaquete
   FUENTE:  §2.9 (package.json — scripts esenciales)
   ARCHIVO DE REFERENCIA: package.json
   PROPÓSITO: Comandos de desarrollo, compilación y despliegue.
   ───────────────────────────────────────────────────────────── */
MÓDULO ConfiguracionPaquete

    COMANDOS (scripts declarados en §2.9)
        dev    → "next dev"     ► servidor de desarrollo local
        build  → "next build"   ► compilación de producción (incluye minificación, RNF-001)
        start  → "next start"   ► servir el build de producción
        lint   → "next lint"    ► verificación estática de código (RNF-008)
        export → "next export"  ► exportación estática (si se requiere)

FIN MÓDULO
```

### 10.2 MÓDULO ConfiguracionVercel (vercel.json)

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: ConfiguracionVercel
   FUENTE:  §2.9 (vercel.json — configuración de hosting)
   ARCHIVO DE REFERENCIA: vercel.json
   PROPÓSITO: Ajustes del hosting en Vercel.
   ───────────────────────────────────────────────────────────── */
MÓDULO ConfiguracionVercel

    CONFIGURACIÓN
        comandoDeBuild    : "npm run build"
        directorioDeSalida: ".next"
        comandoDeDesarrollo: "npm run dev"
        framework         : "nextjs"

FIN MÓDULO
```

### 10.3 MÓDULO VariablesDeEntorno

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: VariablesDeEntorno
   FUENTE:  §2.9 Paso 3 (Variables de Entorno — si aplica)
   PROPÓSITO: Credenciales del conector de email, fuera del código.
   ───────────────────────────────────────────────────────────── */
MÓDULO VariablesDeEntorno

    VARIABLES (solo para el Conector Email, §2.9)
        NEXT_PUBLIC_EMAIL_SERVICE_ID   ► identificador del servicio EmailJS
        NEXT_PUBLIC_EMAIL_TEMPLATE_ID  ► identificador de la plantilla del correo
        NEXT_PUBLIC_EMAILJS_PUBLIC_KEY ► clave pública de EmailJS
    ► Almacenadas como variables de entorno de Vercel (NUNCA en el código)

FIN MÓDULO
```

### 10.4 MÓDULO IgnoradosPorGit (.gitignore)

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: IgnoradosPorGit
   FUENTE:  §2.9 (archivo .gitignore)
   ARCHIVO DE REFERENCIA: .gitignore
   PROPÓSITO: Excluir del versionamiento los artefactos locales.
   ───────────────────────────────────────────────────────────── */
MÓDULO IgnoradosPorGit

    PATRONES A EXCLUIR (lista declarada en §2.9)
        node_modules/   ► dependencias instaladas
        .next/          ► build de Next.js
        out/            ► exportación estática
        .env.local      ► variables de entorno locales (seguridad, RNF-006)
        .DS_Store       ► archivos del sistema macOS
        *.log           ► archivos de registro
        .vercel         ► configuración local de Vercel

FIN MÓDULO
```

### 10.5 FLUJO DespliegueContinuo

```texto
/* ─────────────────────────────────────────────────────────────
   FLUJO: DespliegueContinuo
   FUENTE:  §2.9 (Deployment Recomendado Vercel — Pasos 1 a 4;
            Workflow de Desarrollo paso 9: "Deploy automático")
   PROPÓSITO: Publicación automática de cada cambio en main.
   ───────────────────────────────────────────────────────────── */
FLUJO DespliegueContinuo

    ► PASO 1 — Conectar repositorio (§2.9):
    ►   crear cuenta en Vercel → conectar GitHub → importar repositorio
    ►   → Vercel detecta Next.js automáticamente
    ► PASO 2 — Configuración (§2.9):
    ►   Framework Preset: Next.js · Build Command: npm run build
    ►   Output Directory: .next · Install Command: npm install
    ► PASO 3 — Variables de entorno EmailJS (si aplica, §2.9)
    ► PASO 4 — Dominio personalizado: "josecespedes.com"
    ►   comprar dominio → Vercel: Settings → Domains → agregar → configurar DNS

    ► DISPARADOR AUTOMÁTICO:
    ►   push a la rama "main" → Vercel ejecuta el build → publica (Workflow paso 9)
    ► ► Garantiza HTTPS automático y CDN global (RNF-011, §2.6 Vercel)

FIN FLUJO
```

### 10.6 PROCEDIMIENTO MantenimientoPeriodico

```texto
/* ─────────────────────────────────────────────────────────────
   PROCEDIMIENTO: MantenimientoPeriodico
   FUENTE:  §2.9 (Estrategia de Mantenimiento: frecuencias y
            checklist pre-deploy)
   PROPÓSITO: Rutinas de actualización de contenido y código.
   ───────────────────────────────────────────────────────────── */
PROCEDIMIENTO MantenimientoPeriodico

    ► CONTENIDO (frecuencia MENSUAL, §2.9):
    ►   nuevos proyectos    → editar src/data/projects.json
    ►   experiencia laboral → editar src/data/experience.json
    ►   certificaciones     → editar src/data/education.json
    ► CV (frecuencia TRIMESTRAL, §2.9):
    ►   reemplazar /public/documents/CV_*.pdf (nombre según RF-010)
    ► DEPENDENCIAS (frecuencia MENSUAL, §2.9):
    ►   npm outdated → npm update → commit "chore: Update dependencies"

    ► CHECKLIST PRE-DEPLOY (§2.9) — ejecutar SIEMPRE antes de publicar:
    ►   1. Testing local: npm run build && npm run start
    ►   2. Validar formulario de contacto
    ►   3. Verificar links externos (redes sociales)
    ►   4. Lighthouse audit > 90 en todas las métricas (KPIs §2.10)
    ►   5. Cross-browser testing (Chrome, Firefox, Safari, Edge — RNF-003)
    ►   6. Mobile responsiveness (RNF-002)
    ►   7. Actualizar fecha en footer (RF-013)

FIN PROCEDIMIENTO
```

### 10.7 MÓDULO ControlDeVersiones

```texto
/* ─────────────────────────────────────────────────────────────
   MÓDULO: ControlDeVersiones
   FUENTE:  §2.9 (Branching Model GitHub Flow simplificado,
            Conventional Commits, Workflow de Desarrollo)
   PROPÓSITO: Convenciones de ramas y commits del proyecto.
   ───────────────────────────────────────────────────────────── */
MÓDULO ControlDeVersiones

    ESTRUCTURA DE RAMAS (declarada en §2.9)
        main              ► producción, siempre deployable
        develop           ► integración de features
        feature/*         ► nuevas funcionalidades
        fix/*             ► corrección de bugs
        hotfix/*          ► correcciones urgentes en producción

    PREFIJOS DE COMMIT (Conventional Commits, §2.9)
        feat · fix · style · docs · refactor · perf · test

    FLUJO DE TRABAJO (resumen del workflow de §2.9):
        1. crear rama feature → 2. desarrollo local (npm run dev)
        3. commits frecuentes → 4. push al remoto
        5. Pull Request a develop → 6. merge a develop
        7. testing de integración → 8. merge a main + tag v1.0.0
        9. deploy automático en Vercel

FIN MÓDULO
```

---

## 11. PSEUDOCÓDIGO DE LOS FLUJOS DE CASOS DE USO

> **FUENTE:** §2.3 (CU-001 a CU-008, con actores, precondiciones, flujos principales, flujos
> alternativos y postcondiciones). Cada flujo reproduce literalmente la tabla del documento.

### 11.1 FLUJO CU-001 — Explorar Perfil Profesional

```texto
FLUJO ExplorarPerfilProfesional
    ACTOR: VA, RC, ED, CC, PP        PRECONDICIÓN: acceso a internet y navegador

    ► FLUJO PRINCIPAL (pasos 1-5 del documento):
    1. Usuario accede a la URL
    2. Sistema carga página Hero
    3. Usuario visualiza nombre y título
    4. Usuario lee presentación personal
    5. Sistema muestra foto profesional

    ► FLUJOS ALTERNATIVOS:
    SI conexión es lenta ENTONCES
       mostrar PLACEHOLDER de la foto   ► "Conexión lenta: mostrar placeholder"
    FIN_SI
    SI la carga falla ENTONCES
       mostrar mensaje de REINTENTAR    ► "Error de carga: mensaje de reintentar"
    FIN_SI

    POSTCONDICIÓN: usuario tiene comprensión inicial del perfil
FIN FLUJO
```

### 11.2 FLUJO CU-002 — Revisar Experiencia Laboral

```texto
FLUJO RevisarExperienciaLaboral
    ACTOR: RC, ED                    PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario hace scroll o clic en "Experiencia"
    2. Sistema muestra timeline
    3. Usuario revisa cargos y períodos
    4. Usuario lee responsabilidades y logros

    POSTCONDICIÓN: usuario conoce la trayectoria profesional
FIN FLUJO
```

### 11.3 FLUJO CU-003 — Evaluar Habilidades Técnicas

```texto
FLUJO EvaluarHabilidadesTecnicas
    ACTOR: RC, ED, PP                PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario navega a la sección "Habilidades"
    2. Sistema muestra categorías (TI, Análisis, Seguridad)
    3. Usuario visualiza tecnologías y nivel
    4. Usuario identifica certificaciones

    POSTCONDICIÓN: usuario tiene claridad sobre las competencias técnicas
FIN FLUJO
```

### 11.4 FLUJO CU-004 — Examinar Portafolio de Proyectos

```texto
FLUJO ExaminarPortafolioProyectos
    ACTOR: ED, CC, PP                PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario accede a la sección "Proyectos"
    2. Sistema muestra galería
    3. Usuario selecciona un proyecto
    4. Sistema muestra detalle (modal/página)
    5. Usuario lee descripción, tecnologías y resultados

    ► FLUJOS ALTERNATIVOS:
    SI usuario activa filtro por categoría ENTONCES
       Sistema filtra la galería              ► "Usuario filtra por categoría"
    FIN_SI
    SI usuario elige enlace externo ENTONCES
       abrir demo externa en nueva pestaña    ► "Usuario accede a demo externa"
    FIN_SI

    POSTCONDICIÓN: usuario evalúa la calidad del trabajo
FIN FLUJO
```

### 11.5 FLUJO CU-005 — Descargar Currículum Vitae

```texto
FLUJO DescargarCurriculimVitae
    ACTOR: RC, ED                    PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario localiza el botón "Descargar CV"
    2. Usuario hace clic
    3. Sistema inicia la descarga del PDF
    4. Archivo se guarda en el dispositivo

    ► FLUJO ALTERNATIVO:
    SI la descarga falla ENTONCES
       mostrar mensaje de error y opción de REINTENTAR
       ► "Error de descarga: mostrar mensaje y reintentar"
    FIN_SI

    POSTCONDICIÓN: usuario tiene el CV para revisión offline
FIN FLUJO
```

### 11.6 FLUJO CU-006 — Enviar Mensaje de Contacto

```texto
FLUJO EnviarMensajeContacto
    ACTOR: RC, ED, CC                PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario navega a "Contacto"
    2. Sistema muestra formulario
    3. Usuario completa campos (nombre, email, asunto, mensaje)
    4. Usuario envía el formulario
    5. Sistema valida los datos
    6. Sistema envía el email (Conector Email)
    7. Sistema muestra confirmación

    ► FLUJOS ALTERNATIVOS:
    SI la validación falla ENTONCES
       mostrar errores por campo
       ► "Validación falla: mostrar errores"
    FIN_SI
    SI el envío falla ENTONCES
       mostrar mensaje de error y opción de REINTENTAR
       ► "Error de envío: mensaje de error y reintentar"
    FIN_SI

    POSTCONDICIÓN: mensaje enviado al profesional
FIN FLUJO
```

### 11.7 FLUJO CU-007 — Conectar en Redes Sociales

```texto
FLUJO ConectarRedesSociales
    ACTOR: VA, RC, ED, CC, PP        PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario localiza los íconos de redes sociales
    2. Usuario hace clic en la red deseada
    3. Sistema abre el perfil en NUEVA PESTAÑA

    POSTCONDICIÓN: usuario accede al perfil en la red social
FIN FLUJO
```

### 11.8 FLUJO CU-008 — Leer Testimonios

```texto
FLUJO LeerTestimonios
    ACTOR: ED, CC                    PRECONDICIÓN: usuario en la página

    ► FLUJO PRINCIPAL:
    1. Usuario navega a "Testimonios"
    2. Sistema muestra tarjetas/slider
    3. Usuario lee las recomendaciones
    4. Usuario identifica recomendador y empresa

    POSTCONDICIÓN: usuario tiene referencias del profesional
FIN FLUJO
```

---

## 12. MATRIZ DE TRAZABILIDAD PSEUDOCÓDIGO ↔ ESPECIFICACIÓN

> **FUENTE:** conjunto del documento de especificación. La matriz demuestra que cada módulo del
> pseudocódigo proviene de un requerimiento documentado y que ningún requerimiento queda sin cubrir.

| # | Módulo del pseudocódigo | Historias de usuario | Casos de uso | Requisitos funcionales | Requisitos no funcionales |
|---|---|---|---|---|---|
| 1 | ENTIDAD PerfilProfesional | HU-001 | CU-001 | RF-001, RF-015 | RNF-001 |
| 2 | ENTIDAD Biografia | — | — | RF-002 | — |
| 3 | ENTIDAD ExperienciaLaboral | HU-002 | CU-002 | RF-003 | — |
| 4 | ENTIDAD CategoriaHabilidad / Tecnologia | HU-003 | CU-003 | RF-004 | — |
| 5 | ENTIDAD Proyecto | HU-004 | CU-004 | RF-005 | — |
| 6 | ENTIDAD Servicio | HU-010 | — | RF-006, RF-015 | — |
| 7 | ENTIDAD Testimonio | HU-009 | CU-008 | RF-007 | — |
| 8 | ENTIDAD EducacionYCertificacion | — | — | RF-008 | — |
| 9 | ENTIDAD MensajeContacto | HU-006 | CU-006 | RF-009 | RNF-006 |
| 10 | ENTIDAD RedSocial | HU-007 | CU-007 | RF-011 | — |
| 11 | ENTIDAD ConfiguracionSitio | HU-005, HU-008 | — | RF-010, RF-012 | RNF-002, RNF-005, RNF-007, RNF-010 |
| 12 | ENTIDAD EventoAnalitico | — | — | — | RNF-006, RNF-012 |
| 13 | MÓDULO RepositorioContenido | — | — | — | RNF-008, RNF-009 |
| 14 | COMPONENTE PaginaPrincipal / LayoutRaiz | — | — | — | RNF-004, RNF-005 |
| 15 | COMPONENTE Header / Navigation | HU-008 | — | RF-012 | RNF-004, RNF-007 |
| 16 | COMPONENTE Footer | HU-007 | — | RF-013, RF-015 | — |
| 17 | COMPONENTE SeccionHero | HU-001 | CU-001 | RF-001, RF-014, RF-015 | RNF-001, RNF-004 |
| 18 | COMPONENTE SeccionSobreMi | — | — | RF-002 | — |
| 19 | COMPONENTE SeccionExperiencia | HU-002 | CU-002 | RF-003 | — |
| 20 | COMPONENTE SeccionHabilidades | HU-003 | CU-003 | RF-004 | — |
| 21 | COMPONENTE SeccionProyectos | HU-004 | CU-004 | RF-005, RF-015 | — |
| 22 | COMPONENTE SeccionServicios | HU-010 | — | RF-006, RF-015 | — |
| 23 | COMPONENTE SeccionTestimonios | HU-009 | CU-008 | RF-007 | — |
| 24 | COMPONENTE SeccionEducacion | — | — | RF-008 | — |
| 25 | COMPONENTE SeccionContacto | HU-006 | CU-006 | RF-009 | RNF-004, RNF-006, RNF-007 |
| 26 | COMPONENTES UI (Boton, Tarjeta, Modal, BarraHabilidad, TarjetaProyecto) | HU-008 | CU-004 | RF-005, RF-014, RF-015 | RNF-001, RNF-004, RNF-007, RNF-010 |
| 27 | COMPONENTES COMUNES (EnlacesRedes, BotonDescargarCV, BotonIrArriba) | HU-005, HU-007 | CU-005, CU-007 | RF-010, RF-011, RF-014, RF-015 | RNF-007, RNF-012 |
| 28 | SERVICIO Validacion | HU-006 | CU-006 | RF-009 | RNF-006, RNF-007 |
| 29 | CONECTOR Email (EmailJS) | HU-006 | CU-006 | RF-009 | RNF-006 |
| 30 | SERVICIO Navegacion | HU-008 | — | RF-012, RF-014 | RNF-007 |
| 31 | SERVICIO Animaciones | — | — | RF-014 | RNF-001 |
| 32 | SERVICIO SEO | — | — | — | RNF-005 |
| 33 | SERVICIO Analitica | — | — | — | RNF-006, RNF-012 |
| 34 | SERVICIO Accesibilidad | — | — | — | RNF-004 |
| 35 | SERVICIO Rendimiento | — | — | — | RNF-001, RNF-005, RNF-012 |
| 36 | SERVICIO Responsividad | HU-008 | — | — | RNF-002, RNF-007 |
| 37 | SERVICIO Seguridad | HU-006 | CU-006 | RF-009 | RNF-006, RNF-011 |
| 38 | SERVICIO Utilidades | HU-005 | — | RF-003, RF-010 | — |
| 39 | Configuración (package.json, vercel.json, .gitignore, variables de entorno) | — | — | — | RNF-006, RNF-011 |
| 40 | FLUJO DespliegueContinuo / Mantenimiento / ControlDeVersiones | — | — | — | RNF-008, RNF-011 |
| 41 | FLUJOS CU-001 a CU-008 | HU-001…HU-010 | CU-001…CU-008 | RF-001…RF-011 | — |

**Verificación de cobertura:** 10/10 historias de usuario · 8/8 casos de uso · 15/15 requisitos
funcionales · 12/12 requisitos no funcionales, todos referenciados por al menos un módulo del pseudocódigo.

---

## 13. ARGUMENTACIÓN TÉCNICA DEL PSEUDOCÓDIGO

> Argumentación ordenada, numerada y con sangría, conforme al formato de salida exigido por la solicitud PS-07.

### 1. Cumplimiento estricto de las restricciones de la solicitud

   1. **Solo pseudocódigo.**
      - El artefacto no contiene código en ningún lenguaje de programación estándar.
      - Se utilizan exclusivamente estructuras de pseudocódigo: ENTIDAD, COMPONENTE, SERVICIO,
        CONECTOR, FLUJO, SI/ENTONCES/SI_NO, PARA CADA, SEGÚN, INTENTAR/CAPTURAR_ERROR.
   2. **Única fuente de verdad.**
      - Todo bloque declara sus líneas de trazabilidad (`FUENTE`) contra el documento
        `especificiones-prompt-claude-sonnet-necesidad3.mkd`.
      - No se introdujo ninguna funcionalidad, entidad ni comportamiento ajeno al documento.
   3. **Todo comentado, sin excepción.**
      - Cada entidad, componente, servicio, conector, módulo y flujo incluye comentario de cabecera
        (propósito + fuentes) y comentarios de línea (`►`) en cada paso relevante.

### 2. Estructuración en capas (sección 1 del pseudocódigo)

   1. **Justificación tomada del propio documento:**
      - La justificación de la estructura de directorios de la Opción 1 exige: *"Separación de
        concerns", "Data-driven", "Escalable" y "Mantenible"* (§2.6).
      - El pseudocódigo traduce esa misma filosofía a 5 capas: Dominio → Datos → Componentes →
        Servicios → Configuración/Despliegue.
   2. **Beneficio directo:**
      - Cada capa cumple una responsabilidad única, lo que facilita actualizar contenido sin tocar
        componentes (capa de datos) o cambiar el proveedor de correo sin tocar la interfaz
        (conector aislado).

### 3. Diseño del dominio (sección 3 del pseudocódigo)

   1. **Correspondencia 1:1 con los datos declarados:**
      - Las 12 entidades se derivan literalmente de los 6 archivos JSON de `src/data/` (§2.6) y de
        los elementos de los RF-001 a RF-011.
      - Ejemplos verificables: los 3 valores de `CategoriaHabilidad` provienen de RF-004; los 4
        valores de `Servicio` provienen de RF-006; el patrón `CV_[Nombre]_[Año].pdf` proviene de
        RF-010 y su ejemplo `CV_Jose_Cespedes_2024.pdf` de §2.6.
   2. **Métodos del dominio justificados:**
      - `compararPorFecha` (orden cronológico inverso) → RF-003.
      - `coincideConFiltro` (filtros por categoría) → RF-005 y CU-004 flujo alternativo.
      - `validar()` y `sanitizar()` en MensajeContacto → RF-009 y RNF-006.
      - `registrar()` en EventoAnalitico → RNF-012 y métricas de §2.10.

### 4. Decisión de persistencia: JSON en lugar de base de datos

   1. **Lo que dice el documento:**
      - La arquitectura declara "Data-driven: JSON para fácil actualización de contenido" (§2.6).
      - El plan de mantenimiento indica editar `projects.json`, `experience.json` y
        `education.json` mensualmente (§2.9).
      - RNF-009 deja la base de datos condicionada: *"(si aplica) Esquema normalizado"*.
   2. **Consecuencia en el pseudocódigo:**
      - No se modeló ninguna base de datos: sería inventar un elemento que la especificación no
        exige.
      - El Módulo `RepositorioContenido` es la única vía de acceso al contenido, dejando preparado
        el camino hacia un Headless CMS futuro (RNF-009: "CMS-ready").

### 5. Aislamiento del conector de correo (sección 9.2)

   1. **Lo que dice el documento:**
      - RF-009 admite tres mecanismos de envío: *"EmailJS, Formspree, backend"*.
      - La Opción 1 recomienda EmailJS ("Sin backend para emails").
   2. **Decisión del pseudocódigo:**
      - `Conector Email` se modela como pieza independiente del componente `SeccionContacto`.
      - Si el usuario decidiera migrar a Formspree o a un backend propio, solo cambia el conector;
        el formulario, las validaciones y los mensajes de confirmación permanecen intactos.

### 6. Validación en dos capas (cliente y servidor)

   1. **Lo que dice el documento:**
      - RNF-006 exige explícitamente: "Validación cliente y servidor".
   2. **Consecuencia en el pseudocódigo:**
      - `SeccionContacto` ejecuta la validación en cliente para feedback inmediato (RNF-007:
        "Mensajes de error claros").
      - `Conector Email` repite la validación y la sanitización en el lado del servicio antes de
        enviar (RNF-006), junto con rate limiting y token CSRF.

### 7. Animaciones condicionadas al rendimiento (sección 9.4)

   1. **Lo que dice el documento:**
      - RF-014 exige animaciones (scroll reveal, hover, smooth scroll, transiciones suaves) pero
        con una **restricción explícita: "No afectar rendimiento"**.
      - RNF-001 fija topes duros: carga < 3 s, FCP < 1.5 s, LCP < 2.5 s, TTI < 3.5 s.
   2. **Consecuencia en el pseudocódigo:**
      - `Servicio Animaciones` incluye la función `evaluarRestriccionRendimiento()`, que desactiva
        animaciones no esenciales cuando el dispositivo o la conexión no lo permiten.
      - Así se cumplen simultáneamente RF-014 y RNF-001 sin contradicción.

### 8. SEO como servicio central (sección 9.5)

   1. **Lo que dice el documento:**
      - RNF-005 lista: title con el patrón "José Céspedes - [Título Profesional] | Portafolio",
        description de 150-160 caracteres, Open Graph, Twitter Cards, sitemap.xml, robots.txt,
        jerarquía H1-H6 y Schema.org Person/Professional.
      - La argumentación técnica de la Opción 1 justifica Next.js por su SSR/SSG para SEO.
   2. **Consecuencia en el pseudocódigo:**
      - El `SERVICIO SEO` (referencia `metadata.ts`, `robots.txt`, sitemap) concentra los 6
        elementos del RNF-005 en un único lugar auditable.

### 9. Analítica orientada a conversión (sección 9.6)

   1. **Lo que dice el documento:**
      - RNF-012 define las herramientas (GA4, Search Console, Lighthouse CI) y las métricas clave.
      - §2.10 fija como KPIs: "Descargas de CV: 10+ / mes (GA Events)" y "Envíos de Formulario:
        5+ / mes (GA Events)".
      - RNF-006 impone: "No tracking sin consentimiento".
   2. **Consecuencia en el pseudocódigo:**
      - La `ENTIDAD EventoAnalitico` modela solo los dos eventos de conversión documentados:
        DESCARGA_CV y ENVIO_FORMULARIO.
      - `inicializar()` y `registrar()` verifican el consentimiento antes de cualquier tracking.

### 10. Accesibilidad transversal (sección 9.7)

   1. **Lo que dice el documento:**
      - RNF-004 (WCAG 2.1 AA): contraste 4.5:1, navegación por teclado completa, alt en imágenes,
        semántica HTML5, aria labels, formularios accesibles.
   2. **Consecuencia en el pseudocódigo:**
      - Las garantías de accesibilidad se aplican en tres niveles:
          - Componentes (ej.: `Modal` con cierre por Escape y retorno de foco; `Boton` con foco
            visible; hamburguesa con `aria-expanded`).
          - Servicio central (`SERVICIO Accesibilidad`) para verificación y auditoría.
          - Checklist de despliegue (auditoría Lighthouse en el pre-deploy, §2.9).

### 11. Responsividad conforme a los 4 breakpoints (sección 9.9)

   1. **Lo que dice el documento:**
      - RNF-002 define los rangos exactos (320-767 / 768-1023 / 1024-1440 / >1440), el enfoque
        mobile-first y los touch targets de 44x44 px.
      - §2.8 define columnas por dispositivo (1/2/3-4) y tipografía por rango (14-16px / 16px /
        16-18px).
   2. **Consecuencia en el pseudocódigo:**
      - `SERVICIO Responsividad` traduce literalmente esas reglas; los componentes de sección
        (ej.: `SeccionProyectos`) las invocan al componer sus grids.

### 12. Seguridad y privacidad en el único punto transaccional (sección 9.10)

   1. **Lo que dice el documento:**
      - RNF-006: HTTPS obligatorio, protección CSRF, rate limiting, sanitización de inputs,
        headers de seguridad (CSP, X-Frame-Options, X-Content-Type-Options) y no tracking sin
        consentimiento.
   2. **Consecuencia en el pseudocódigo:**
      - `SERVICIO Seguridad` agrupa las 4 garantías; el flujo CU-006 muestra el orden real de
        aplicación (validar → sanitizar → enviar con CSRF y rate limiting → confirmar).

### 13. Trazabilidad y cobertura total (sección 12)

   1. **Resultado de la matriz:**
      - 10/10 historias de usuario, 8/8 casos de uso, 15/15 requisitos funcionales y
        12/12 requisitos no funcionales quedan referenciados por al menos un módulo del
        pseudocódigo.
      - Ningún módulo del pseudocódigo carece de referencia al documento fuente.

### 14. Notas de fidelidad al documento fuente

   1. **Variaciones internas del documento que se respetaron tal cual:**
      - El árbol de directorios ubica `tailwind.config.js` en `src/styles/`; el pseudocódigo lo
        respeta sin reubicarlo.
      - El patrón de nombre del CV es `CV_[Nombre]_[Año].pdf` (RF-010) y el ejemplo concreto del
        árbol es `CV_Jose_Cespedes_2024.pdf` (§2.6); ambos se citan.
      - El menú de RF-012 lista 7 ítems (Inicio, Sobre Mí, Experiencia, Habilidades, Proyectos,
        Servicios, Contacto), mientras que la página tiene 9 secciones (§2.7 añade Educación y
        Testimonios, accesibles por scroll); el pseudocódigo mantiene el menú con los 7 ítems
        declarados en RF-012.
      - En la sección Proyectos conviven dos CTAs en el documento: "Ver más proyectos" (RF-015) y
        "Ver más en GitHub" (§2.7); ambos se modelaron, citando cada fuente.
   2. **Alcance del modelo de datos:**
      - La especificación no define valores concretos de contenido (empresas, fechas, tecnologías
        específicas, textos reales); por lo tanto el pseudocódigo define estructuras y reglas,
        nunca datos inventados.

---

## CIERRE — SOLICITUD DE APROBACIÓN

> [!NOTE]
> **Restricción 3 de la solicitud PS-07:** finalizada la tarea, se solicita al usuario la confirmación
> de aprobación y continuación del desarrollo.

**Entregable:** `pseudocodigo-landing-page-portafolio-PS-07.md`

**Resumen del artefacto:**

- 13 secciones estructuradas: convenciones, arquitectura en capas, jerarquía de clases/objetos,
  dominio (12 entidades), datos, componentes (layout + 9 secciones + 5 UI + 3 comunes),
  servicios y conectores (11), configuración y despliegue, flujos de los 8 casos de uso y
  matriz de trazabilidad.
- 100 % de cobertura verificada: 10/10 HU · 8/8 CU · 15/15 RF · 12/12 RNF.
- Cero código de programación: solo pseudocódigo comentado y trazable.


**FIN DEL DOCUMENTO DE PSEUDOCÓDIGO — PS-07 v1.0**
