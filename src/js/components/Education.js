/**
 * ==========================================================================
 * COMPONENTE: Education (Sección 7 - Educación y Certificaciones)
 * FUENTE: RF-008, §2.7 (§6.8 del pseudocódigo)
 * ==========================================================================
 */

export class Education {
  static renderizar(dataEducacion) {
    const titulosHtml = dataEducacion.titulosAcademicos.map(tit => `
      <div class="card" style="margin-bottom:var(--spacing-lg);">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:8px;">
          <div>
            <h3 style="font-size:var(--fs-lg); color:var(--text-primary); font-weight:700;">${tit.tituloAcademico}</h3>
            <div style="color:var(--accent-cyan); font-size:var(--fs-sm); font-weight:600;">${tit.institucion}</div>
          </div>
          <span class="tag tag-accent">${tit.anio}</span>
        </div>
        <p style="font-size:var(--fs-sm); color:var(--text-muted); line-height:1.6; margin:0;">
          ${tit.descripcion}
        </p>
      </div>
    `).join("");

    const certsHtml = dataEducacion.certificaciones.map((cert, idx) => `
      <div class="cert-card reveal-on-scroll stagger-${(idx % 4) + 1}">
        <img class="cert-badge" src="${cert.badgeDigital}" alt="Badge de ${cert.nombre}" width="48" height="48" loading="lazy">
        <div>
          <div class="cert-name">${cert.nombre}</div>
          <div class="cert-issuer">${cert.entidadCertificadora} · <span style="color:var(--text-muted);">${cert.anio}</span></div>
        </div>
      </div>
    `).join("");

    return `
      <section id="educacion" class="education-section" aria-labelledby="education-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Formación &amp; Credenciales</span>
            <h2 id="education-title">Educación &amp; <span class="gradient-text">Certificaciones</span></h2>
            <p class="section-subtitle">Respaldos académicos y credenciales internacionales que certifican mi especialización técnica.</p>
          </div>

          <div class="education-grid">
            <!-- Columna Izquierda: Formación Académica -->
            <div class="reveal-on-scroll">
              <h3 style="font-size:var(--fs-xl); color:var(--text-primary); margin-bottom:var(--spacing-lg); display:flex; align-items:center; gap:8px;">
                🎓 Formación Universitaria
              </h3>
              ${titulosHtml}
            </div>

            <!-- Columna Derecha: Badges de Certificación -->
            <div class="reveal-on-scroll stagger-2">
              <h3 style="font-size:var(--fs-xl); color:var(--text-primary); margin-bottom:var(--spacing-lg); display:flex; align-items:center; gap:8px;">
                📜 Certificaciones Internacionales
              </h3>
              <div class="certifications-list">
                ${certsHtml}
              </div>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}
