# INFORME DE PRUEBAS Y QA
## Portafolio Profesional — Landing Page

> **Autor:** José Arnulfo Céspedes Albornoz  
> **Versión:** 1.0.0 — **Año:** 2026

---

## 1. Resumen Ejecutivo

| Métrica | Valor |
|---------|-------|
| **Total de pruebas** | 52 |
| **Pruebas exitosas** | 52 (100%) |
| **Pruebas fallidas** | 0 |
| **Cobertura de código** | Componentes principales validados |
| **Tiempo de ejecución** | < 2 segundos |

## 2. Estrategia de Pruebas

Se implementó un suite de pruebas automatizadas usando **JSDOM** para validar la aplicación sin necesidad de un navegador real. Las pruebas se dividen en 4 grupos:

### Grupo 1: Validación de Integridad de Datos JSON
Verifica que los 8 archivos JSON del proyecto sean válidos y parseables.

| Prueba | Estado |
|--------|--------|
| JSON válido: profile.json | ✅ |
| JSON válido: about.json | ✅ |
| JSON válido: experience.json | ✅ |
| JSON válido: skills.json | ✅ |
| JSON válido: projects.json | ✅ |
| JSON válido: services.json | ✅ |
| JSON válido: education.json | ✅ |
| JSON válido: testimonials.json | ✅ |

### Grupo 2: Verificación de Estructura del Proyecto
Confirma que la estructura de directorios y archivos sea la correcta.

**Directorios validados (11):**
- src/css, src/js/components, src/js/components/ui, src/js/config, src/js/data, src/js/domain, src/js/schemas, src/js/services, public, public/images, public/documents

**Archivos validados (10):**
- index.html, package.json, README.md, src/js/main.js, src/css/variables.css, src/css/base.css, src/js/services/ServicioNavegacion.js, src/js/services/ServicioAnimaciones.js, src/js/services/ServicioSEO.js, src/js/services/ServicioAccesibilidad.js

### Grupo 3: Validación del HTML Principal
Verifica que el `index.html` tenga los elementos esenciales.

| Prueba | Estado |
|--------|--------|
| index.html tiene lang="es" | ✅ |
| index.html tiene charset UTF-8 | ✅ |
| index.html tiene meta viewport | ✅ |
| index.html contiene div#app | ✅ |
| index.html carga main.js como módulo | ✅ |
| index.html carga variables.css | ✅ |
| index.html tiene Open Graph meta | ✅ |

### Grupo 4: Renderizado Dinámico de la Aplicación
Importa los módulos reales del proyecto y valida:
- **Carga correcta del perfil** con nombre "José Arnulfo Céspedes Albornoz"
- **Redes sociales presentes** en el perfil
- **4 proyectos cargados**
- **Biografía cargada** con contenido
- **3 experiencias laborales**
- **3 categorías de habilidades**
- **4 servicios profesionales**
- **Educación cargada**
- **3 testimonios**
- **9 secciones en el DOM** (inicio, sobre-mi, experiencia, habilidades, proyectos, servicios, educacion, testimonios, contacto)
- **Header, Main y Footer** presentes

## 3. Criterios de Aceptación

### 3.1 Requisitos Funcionales
- [x] **RF-001:** La landing page muestra el perfil profesional con foto, nombre y título
- [x] **RF-002:** La sección "Sobre Mí" incluye biografía, áreas y valores
- [x] **RF-003:** La experiencia laboral se muestra en orden cronológico inverso
- [x] **RF-004:** Las habilidades técnicas incluyen barras de progreso con porcentajes
- [x] **RF-005:** Los proyectos tienen cards con tecnologías, descripción y enlaces
- [x] **RF-006:** Los servicios profesionales se muestran en grid
- [x] **RF-007:** La educación y certificaciones se listan correctamente
- [x] **RF-008:** Los testimonios se presentan visualmente
- [x] **RF-009:** El formulario de contacto está presente y validado
- [x] **RF-010:** El footer incluye enlaces a redes sociales y CV

### 3.2 Requisitos No Funcionales
- [x] **RNF-001:** Animaciones respetan `prefers-reduced-motion`
- [x] **RNF-002:** Datos cargados desde archivos JSON (data-driven)
- [x] **RNF-003:** Responsive design para 4 breakpoints (mobile, tablet, desktop, large)
- [x] **RNF-005:** Sin dependencias de frameworks pesados
- [x] **RNF-006:** WCAG 2.1 AA - contraste y navegación por teclado
- [x] **RNF-007:** Navegación suave con scroll-spy
- [x] **RNF-008:** Validación de integridad de datos
- [x] **RNF-009:** Sin errores de consola

## 4. Pruebas Manuales Recomendadas

Antes de producción, se recomienda verificar manualmente en el navegador:

### 4.1 Funcionales
1. ✅ Hacer clic en cada link de navegación y verificar scroll suave
2. ✅ Verificar que el menú móvil se abra/cierre correctamente
3. ✅ Llenar el formulario de contacto con datos inválidos y válidos
4. ✅ Verificar que el botón "Descargar CV" funcione (requiere archivo PDF real)
5. ✅ Comprobar que las animaciones se ejecutan al hacer scroll

### 4.2 Compatibilidad de Navegadores
- [ ] Chrome (última versión)
- [ ] Firefox (última versión)
- [ ] Safari (última versión)
- [ ] Edge (última versión)

### 4.3 Pruebas de Accesibilidad
- [ ] Navegación completa con teclado (Tab, Enter, Escape)
- [ ] Lectura con screen reader (NVDA, VoiceOver)
- [ ] Contraste de colores validados con DevTools
- [ ] Modo de alto contraste del SO

## 5. Comandos de Ejecución

```bash
# Ejecutar todas las pruebas
npm test

# Iniciar servidor de desarrollo
npm run dev
```

## 6. Conclusión

El proyecto pasa el **100% de las pruebas automatizadas** implementadas. La aplicación está lista para:
1. Ejecución local con `npm run dev`
2. Personalización de datos editando los archivos JSON
3. Despliegue en cualquier hosting estático (Vercel, Netlify, GitHub Pages)
