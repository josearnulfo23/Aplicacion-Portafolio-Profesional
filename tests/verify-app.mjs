// Verificación final: simular exactamente lo que hace el navegador al cargar la app
import { JSDOM } from 'jsdom';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');

const dom = new JSDOM(indexHtml, {
  runScripts: 'dangerously',
  pretendToBeVisual: true,
  url: `file:///${path.join(projectRoot, 'index.html').replace(/\\/g, '/')}`
});

const { window } = dom;

// Polyfill de fetch para que cargue los JSON locales
const jsonCache = {};
['profile', 'about', 'experience', 'skills', 'projects', 'services', 'education', 'testimonials'].forEach(name => {
  const content = fs.readFileSync(path.join(projectRoot, `src/js/data/${name}.json`), 'utf8');
  jsonCache[`src/js/data/${name}.json`] = content;
});

window.fetch = async (url) => {
  const cleanUrl = String(url).replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '').replace(/^file:\/\/\//, '');
  const candidates = [cleanUrl, path.join(projectRoot, cleanUrl).replace(/\\/g, '/')];
  for (const c of candidates) {
    if (jsonCache[c]) {
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(jsonCache[c])
      };
    }
    if (fs.existsSync(c) && fs.statSync(c).isFile()) {
      const content = fs.readFileSync(c, 'utf8');
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(content)
      };
    }
  }
  return { ok: false, status: 404, json: async () => ({ error: 'Not found' }) };
};

// Esperar más tiempo para que se ejecuten los scripts de módulo
console.log('Esperando carga de módulos...');
await new Promise(resolve => setTimeout(resolve, 5000));
console.log('Verificando DOM...');

const doc = window.document;
const app = doc.getElementById('app');

console.log('=== ESTADO DEL DOM DESPUÉS DE LA CARGA ===');
console.log(`InnerHTML length: ${app ? app.innerHTML.length : 'NO APP'}`);
console.log(`Sections: ${doc.querySelectorAll('section[id]').length}`);
console.log(`Header: ${doc.querySelector('.site-header') ? 'OK' : 'MISSING'}`);
console.log(`Footer: ${doc.querySelector('.site-footer') ? 'OK' : 'MISSING'}`);
console.log(`Hero title presente: ${doc.body.textContent.includes('José Arnulfo') ? 'OK' : 'MISSING'}`);

const sections = ['inicio', 'acerca', 'experiencia', 'habilidades', 'proyectos', 'servicios', 'educacion', 'testimonios', 'contacto'];
for (const id of sections) {
  const sec = doc.getElementById(id);
  console.log(`Sección #${id}: ${sec ? 'OK' : 'MISSING'}`);
}

dom.window.close();