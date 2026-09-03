/**
 * ==========================================================================
 * COMPONENTE: Services (Sección 6 - Servicios Profesionales)
 * FUENTE: HU-010, RF-006, RF-015 (§6.6 del pseudocódigo)
 * ==========================================================================
 */

export class Services {
  static renderizar(servicios) {
    const cardsHtml = servicios.map((srv, idx) => {
      const entregablesHtml = srv.entregables.map(ent => `
        <li>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
          <span>${ent}</span>
        </li>
      `).join("");

      return `
        <div class="card service-card reveal-on-scroll stagger-${idx + 1}">
          <div class="service-icon-wrap">
            <img src="${srv.icono}" alt="${srv.nombreServicio}" width="28" height="28" loading="lazy">
          </div>

          <span class="tag" style="margin-bottom:0.75rem; width:fit-content;">${srv.categoria}</span>
          <h3 class="service-title">${srv.nombreServicio}</h3>
          <p class="service-desc">${srv.descripcion}</p>

          <h4 style="font-size:var(--fs-xs); color:var(--accent-cyan); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:0.5rem;">Entregables Clave:</h4>
          <ul class="service-deliverables">
            ${entregablesHtml}
          </ul>

          <a href="${srv.ctaDestino}" class="btn btn-outline btn-sm" style="margin-top:auto;">
            ${srv.ctaTexto} ▹
          </a>
        </div>
      `;
    }).join("");

    return `
      <section id="servicios" class="services-section" aria-labelledby="services-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Propuesta de Valor</span>
            <h2 id="services-title">Servicios <span class="gradient-text">Profesionales</span></h2>
            <p class="section-subtitle">Soluciones de consultoría especializada en ingeniería de software, arquitectura de datos y seguridad.</p>
          </div>

          <div class="services-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
