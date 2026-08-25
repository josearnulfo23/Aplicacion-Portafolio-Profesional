// tests/render-check.mjs - Renderiza la app manualmente cargando los módulos
import jsdomPkg from 'jsdom';
const { JSDOM } = jsdomPkg;
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// Cargar todos los módulos manualmente
const repositorio = await import('../src/js/services/RepositorioContenido.js');
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

const fullHTML = `
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

console.log(`📊 HTML renderizado: ${fullHTML.length} caracteres`);
console.log(`📋 Secciones presentes:`);
const secciones = ['inicio', 'sobre-mi', 'experiencia', 'habilidades', 'proyectos', 'servicios', 'educacion', 'testimonios', 'contacto'];
for (const id of secciones) {
  const tiene = fullHTML.includes(`id="${id}"`);
  console.log(`   ${tiene ? '✅' : '❌'} #${id}`);
}

// Crear un DOM temporal para verificar estructura
const dom = new JSDOM(`<!DOCTYPE html><html><body><div id="app">${fullHTML}</div></body></html>`, {
  pretendToBeVisual: true
});

const doc = dom.window.document;
console.log(`\n🎯 DOM final:`);
console.log(`   - Header: ${doc.querySelector('.site-header') ? 'OK' : 'MISSING'}`);
console.log(`   - Main: ${doc.querySelector('#main-content') ? 'OK' : 'MISSING'}`);
console.log(`   - Footer: ${doc.querySelector('.site-footer') ? 'OK' : 'MISSING'}`);
console.log(`   - Secciones <section>: ${doc.querySelectorAll('section[id]').length}`);
console.log(`   - Imágenes con alt: ${Array.from(doc.querySelectorAll('img')).filter(i => i.hasAttribute('alt')).length}/${doc.querySelectorAll('img').length}`);
console.log(`   - Botones CTA: ${doc.querySelectorAll('a.btn, button.btn').length}`);

dom.window.close();