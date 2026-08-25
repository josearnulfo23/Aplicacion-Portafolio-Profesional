/**
 * ==========================================================================
 * COMPONENTE: Testimonials (Sección 8 - Testimonios)
 * FUENTE: HU-009, RF-007, CU-008 (§6.7 del pseudocódigo)
 * ==========================================================================
 */

export class Testimonials {
  static renderizar(testimonios) {
    const cardsHtml = testimonios.map((t, idx) => `
      <div class="card testimonial-card reveal-on-scroll stagger-${idx + 1}">
        <div class="testimonial-quote">
          ${t.textoTestimonio}
        </div>

        <div class="testimonial-author">
          <img class="author-avatar" src="${t.foto}" alt="${t.nombreRecomendador}" width="44" height="44" loading="lazy">
          <div>
            <div class="author-name">${t.nombreRecomendador}</div>
            <div class="author-role">${t.cargo}</div>
            <div style="font-size:var(--fs-xs); color:var(--accent-cyan); font-weight:600;">${t.empresa}</div>
          </div>
        </div>
      </div>
    `).join("");

    return `
      <section id="testimonios" class="testimonials-section" aria-labelledby="testimonials-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Validación Profesional</span>
            <h2 id="testimonials-title">Recomendaciones &amp; <span class="gradient-text">Testimonios</span></h2>
            <p class="section-subtitle">Lo que líderes técnicos y directores corporativos opinan sobre mi trabajo y colaboración.</p>
          </div>

          <div class="testimonials-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
