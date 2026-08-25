/**
 * ==========================================================================
 * COMPONENTE: About (Sección 2 - Sobre Mí)
 * FUENTE: RF-002 (§6.2 del pseudocódigo)
 * ==========================================================================
 */

export class About {
  static renderizar(bio) {
    const parrafosHtml = (bio.parrafos || []).map(p => `
      <p style="color:var(--text-secondary); line-height:1.75; margin-bottom:1rem;">${p}</p>
    `).join("");

    const statsHtml = (bio.estadisticasClave || []).map(stat => `
      <div class="stat-card">
        <div class="stat-number">${stat.cifra}</div>
        <div class="stat-label">${stat.etiqueta}</div>
      </div>
    `).join("");

    const valoresHtml = (bio.valoresProfesionales || []).map(val => `
      <div class="value-card">
        <div class="value-title">${val.valor}</div>
        <div class="value-desc">${val.descripcion}</div>
      </div>
    `).join("");

    return `
      <section id="sobre-mi" class="about-section" aria-labelledby="about-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Trayectoria &amp; Visión</span>
            <h2 id="about-title">Sobre <span class="gradient-text">Mí</span></h2>
            <p class="section-subtitle">Conoce mi enfoque profesional, valores de trabajo y las estadísticas que respaldan mi experiencia.</p>
          </div>

          <div class="about-grid">
            <!-- Columna Izquierda: Biografía y Valores -->
            <div class="about-content reveal-on-scroll">
              <div class="card" style="margin-bottom: var(--spacing-xl);">
                <h3 style="color:var(--accent-cyan); margin-bottom:1rem; font-size:var(--fs-xl);">Perfil Multidisciplinario</h3>
                ${parrafosHtml}
              </div>

              <h4 style="color:var(--text-primary); margin-bottom:0.75rem;">Valores Profesionales</h4>
              <div class="values-grid">
                ${valoresHtml}
              </div>
            </div>

            <!-- Columna Derecha: Ilustración Técnica y Estadísticas -->
            <div class="about-visual reveal-on-scroll stagger-2">
              <div style="margin-bottom: var(--spacing-xl); display:flex; justify-content:center;">
                <img src="${bio.imagenComplementaria || 'public/images/profile/about-illustration.svg'}" alt="Ecosistema de TI, Analítica y Seguridad" width="480" height="380" loading="lazy">
              </div>

              <h4 style="color:var(--text-primary); margin-bottom:0.75rem; text-align:center;">Métricas de Impacto Acumuladas</h4>
              <div class="about-stats">
                ${statsHtml}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
