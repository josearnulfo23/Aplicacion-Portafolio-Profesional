// tests/render-to-file.mjs - Genera el HTML renderizado completo a un archivo para inspección
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Cargar todos los módulos
const repositorio = await import('../src/js/services/RepositorioContenido.js');
const seo = await import('../src/js/services/ServicioSEO.js');
const headerMod = await import('../src/js/components/Header.js');
const heroMod = await import('../src/js/components/Hero.js');
const aboutMod = await import('../src/js/components/About.js');
const experienceMod = await import('../src/js/components/Experience.js');
const skillsMod = await import('../src/js/components/Skills.js');
const projectsMod = await import('../src/js/components/Projects.js');
const servicesMod = await import('../src/js/components/Services.js');
const educationMod = await import('../src/js/components/Education.js');
const testimonialsMod = await import('../src/js/components/Testimonials.js');
const contactMod = await import('../src/js/components/Contact.js');
const footerMod = await import('../src/js/components/Footer.js');

const [perfil, bio, exp, hab, proy, serv, edu, test] = await Promise.all([
  repositorio.RepositorioContenido.cargarPerfil(),
  repositorio.RepositorioContenido.cargarBiografia(),
  repositorio.RepositorioContenido.cargarExperiencia(),
  repositorio.RepositorioContenido.cargarHabilidades(),
  repositorio.RepositorioContenido.cargarProyectos(),
  repositorio.RepositorioContenido.cargarServicios(),
  repositorio.RepositorioContenido.cargarEducacion(),
  repositorio.RepositorioContenido.cargarTestimonios()
]);

const appHTML = `
  ${headerMod.Header.renderizar(perfil)}
  <main id="main-content">
    ${heroMod.Hero.renderizar(perfil)}
    ${aboutMod.About.renderizar(bio)}
    ${experienceMod.Experience.renderizar(exp)}
    ${skillsMod.Skills.renderizar(hab)}
    ${projectsMod.Projects.renderizar(proy)}
    ${servicesMod.Services.renderizar(serv)}
    ${educationMod.Education.renderizar(edu)}
    ${testimonialsMod.Testimonials.renderizar(test)}
    ${contactMod.Contact.renderizar()}
  </main>
  ${footerMod.Footer.renderizar(perfil)}
`;

// Inyectar en el index.html
const indexPath = path.join(projectRoot, 'index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf8');

// Reemplazar el script de carga con el HTML pre-renderizado
const htmlWithContent = indexHtml.replace(
  '<div id="app"></div>',
  `<div id="app">${appHTML}</div>`
);

// Guardar a un archivo preview
const previewPath = path.join(projectRoot, 'tests/preview.html');
fs.writeFileSync(previewPath, htmlWithContent, 'utf8');

console.log(`✅ HTML renderizado guardado en: ${previewPath}`);
console.log(`📊 Tamaño total: ${htmlWithContent.length} caracteres`);
console.log(`📦 Contenido de la app: ${appHTML.length} caracteres`);

// Generar JSON-LD para SEO (omitido en preview por requerir DOM)
console.log(`✅ HTML renderizado guardado en: ${previewPath}`);