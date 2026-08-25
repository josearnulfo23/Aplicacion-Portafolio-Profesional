/**
 * ==========================================================================
 * COMPONENTE: Footer
 * FUENTE: RF-013, RF-015, HU-007, §2.7 (§5.4 del pseudocódigo)
 * ==========================================================================
 */

import { SITE_CONFIG } from "../config/constants.js";

export class Footer {
  static renderizar(perfil) {
    const anioActual = new Date().getFullYear();

    const redesHtml = (perfil.redesSociales || []).map(red => `
      <a href="${red.urlPerfil}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="${red.etiqueta || red.nombreRed}">
        <img src="${red.icono}" alt="${red.nombreRed}" width="20" height="20">
      </a>
    `).join("");

    return `
      <footer class="site-footer" role="contentinfo">
        <div class="container">
          <div class="footer-grid">
            <!-- Columna 1: Marca & Biografía Corta -->
            <div class="footer-brand">
              <a href="#inicio" class="brand-logo" aria-label="Volver al inicio">
                <div class="brand-icon">JC</div>
                <div class="brand-title">
                  <span class="brand-name">${perfil.nombreCompleto}</span>
                  <span class="brand-role">TI · Datos · Seguridad</span>
                </div>
              </a>
              <p>
                Especialista en la integración estratégica de arquitecturas de software, telemetría de centros de control y análisis avanzado de datos.
              </p>
              <div style="display:flex; gap:8px; margin-top:16px;">
                ${redesHtml}
              </div>
            </div>

            <!-- Columna 2: Navegación Rápida -->
            <div>
              <h4 class="footer-heading">Navegación</h4>
              <div class="footer-links">
                <a href="#inicio">Inicio</a>
                <a href="#sobre-mi">Sobre Mí</a>
                <a href="#experiencia">Experiencia</a>
                <a href="#habilidades">Habilidades</a>
                <a href="#proyectos">Portafolio</a>
              </div>
            </div>

            <!-- Columna 3: Especialidades -->
            <div>
              <h4 class="footer-heading">Servicios</h4>
              <div class="footer-links">
                <a href="#servicios">Consultoría TI</a>
                <a href="#servicios">Analítica de Datos</a>
                <a href="#servicios">Sistemas de Seguridad</a>
                <a href="#servicios">Auditorías Técnicas</a>
                <a href="#educacion">Certificaciones</a>
              </div>
            </div>

            <!-- Columna 4: Descarga de CV & Contacto Directo -->
            <div>
              <h4 class="footer-heading">Recursos Profesionales</h4>
              <p style="font-size:var(--fs-xs); color:var(--text-muted); margin-bottom:12px;">
                Descarga una copia completa de mi currículum en formato PDF para procesos internos de selección.
              </p>
              <a href="${perfil.botonCV.archivo}" class="btn btn-primary btn-sm js-cv-download" download aria-label="Descargar currículum vitae en PDF">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Descargar CV (PDF)
              </a>
              <div style="margin-top:16px; font-size:var(--fs-xs); color:var(--text-muted);">
                Contacto: <a href="mailto:${SITE_CONFIG.EMAIL}" style="color:var(--accent-azure);">${SITE_CONFIG.EMAIL}</a>
              </div>
            </div>
          </div>

          <!-- Bottom Footer -->
          <div class="footer-bottom">
            <div>
              &copy; ${anioActual} ${perfil.nombreCompleto}. Todos los derechos reservados. Licencia MIT.
            </div>
            <div>
              Diseñado con estándares W3C, HTML5 Semántico, CSS3 &amp; ES6 Modules.
            </div>
          </div>
        </div>

        <!-- Botón Volver Arriba Flotante -->
        <button type="button" class="scroll-top-btn" aria-label="Volver arriba de la página">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>
        </button>
      </footer>
    `;
  }
}
