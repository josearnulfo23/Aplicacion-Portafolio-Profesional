/**
 * ==========================================================================
 * COMPONENTE: Hero (Sección 1)
 * FUENTE: HU-001, RF-001, CU-001, §2.7 (§6.1 del pseudocódigo)
 * ==========================================================================
 */

export class Hero {
  static renderizar(perfil) {
    const redesHtml = (perfil.redesSociales || []).map(red => `
      <a href="${red.urlPerfil}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="${red.etiqueta || red.nombreRed}">
        <img src="${red.icono}" alt="${red.nombreRed}" width="20" height="20">
      </a>
    `).join("");

    return `
      <section id="inicio" class="hero-section" aria-label="Presentación principal">
        <div class="hero-glow-bg"></div>
        <div class="container hero-grid">
          <!-- Columna Izquierda: Información de Presentación -->
          <div class="hero-content reveal-on-scroll">
            <div class="hero-greeting">
              <span>●</span> Bienvenido a mi portafolio profesional
            </div>
            
            <h1 class="hero-title">
              Hola, soy <span class="gradient-text">${perfil.nombreCompleto}</span>
            </h1>

            <div class="hero-role">
              ${perfil.tituloProfesional}
            </div>

            <div class="hero-tagline">
              "${perfil.tagline}"
            </div>

            <p class="hero-description">
              ${perfil.descripcionBreve}
            </p>

            <!-- Acciones Principales (CTAs) -->
            <div class="hero-actions">
              <a href="${perfil.ctaPrimario.destino}" class="btn btn-primary btn-lg">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>
                ${perfil.ctaPrimario.texto}
              </a>

              <a href="${perfil.ctaSecundario.destino}" class="btn btn-secondary btn-lg">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                ${perfil.ctaSecundario.texto}
              </a>

              <a href="${perfil.botonCV.archivo}" class="btn btn-outline btn-lg js-cv-download" download aria-label="Descargar currículum vitae en PDF">
                <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                Descargar CV
              </a>
            </div>

            <!-- Enlaces a Redes Sociales en el Hero -->
            <div class="hero-socials">
              <span style="font-size:var(--fs-xs); color:var(--text-muted); margin-right:8px; font-weight:600; text-transform:uppercase;">Conectar:</span>
              ${redesHtml}
            </div>
          </div>

          <!-- Columna Derecha: Imagen Profesional Vectorial de Alto Impacto -->
          <div class="hero-image-wrap reveal-on-scroll stagger-2">
            <img src="${perfil.fotoProfesional}" alt="Fotografía Profesional de ${perfil.nombreCompleto}" width="380" height="380" loading="eager">
          </div>
        </div>
      </section>
    `;
  }
}
