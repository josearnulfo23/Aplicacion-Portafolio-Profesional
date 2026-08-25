/**
 * ==========================================================================
 * COMPONENTE: Experience (Sección 3 - Experiencia Profesional)
 * FUENTE: HU-002, RF-003, CU-002 (§6.3 del pseudocódigo)
 * ==========================================================================
 */

export class Experience {
  static renderizar(experiencias) {
    const itemsHtml = experiencias.map((exp) => {
      const tagsHtml = (exp.tecnologias || []).map(t => `<span class="tag">${t}</span>`).join(" ");
      const logrosHtml = (exp.logrosCuantificables || []).map(l => `<li><strong>Logro:</strong> ${l}</li>`).join("");
      const respHtml = (exp.responsabilidades || []).map(r => `<li>${r}</li>`).join("");

      return `
        <div class="timeline-item reveal-on-scroll">
          <div class="timeline-dot"></div>
          <div class="timeline-content">
            <div class="timeline-header">
              <div>
                <h3 class="timeline-role">${exp.cargo}</h3>
                <div class="timeline-company">${exp.empresa}</div>
                <div style="font-size:var(--fs-xs); color:var(--text-muted); margin-top:2px;">
                  📍 ${exp.ubicacion} · <span style="color:var(--accent-azure);">${exp.modalidad}</span>
                </div>
              </div>
              <div class="timeline-period">
                🗓️ ${exp.periodoInicio} — ${exp.periodoFin}
              </div>
            </div>

            <p style="color:var(--text-secondary); font-size:var(--fs-sm); margin-bottom:1rem;">
              ${exp.descripcion}
            </p>

            <div style="margin-bottom:0.75rem;">
              <h4 style="font-size:var(--fs-xs); text-transform:uppercase; color:var(--accent-cyan); letter-spacing:0.05em; margin-bottom:0.4rem;">Responsabilidades Principales:</h4>
              <ul class="timeline-bullets">
                ${respHtml}
              </ul>
            </div>

            <div style="margin-bottom:1rem;">
              <h4 style="font-size:var(--fs-xs); text-transform:uppercase; color:var(--accent-cyan); letter-spacing:0.05em; margin-bottom:0.4rem;">Resultados Cuantificables:</h4>
              <ul class="timeline-bullets">
                ${logrosHtml}
              </ul>
            </div>

            <div style="display:flex; flex-wrap:wrap; gap:6px; margin-top:1rem; padding-top:0.75rem; border-top:1px solid rgba(255,255,255,0.06);">
              ${tagsHtml}
            </div>
          </div>
        </div>
      `;
    }).join("");

    return `
      <section id="experiencia" class="experience-section" aria-labelledby="experience-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Historial Laboral</span>
            <h2 id="experience-title">Experiencia <span class="gradient-text">Profesional</span></h2>
            <p class="section-subtitle">Trayectoria técnica y de liderazgo presentada en orden cronológico inverso con logros cuantificables.</p>
          </div>

          <div class="timeline">
            ${itemsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
