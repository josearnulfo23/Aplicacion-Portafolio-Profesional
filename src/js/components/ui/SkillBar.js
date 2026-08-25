/**
 * ==========================================================================
 * COMPONENTE UI: SkillBar
 * FUENTE: HU-003, RF-004 (§7.4 del pseudocódigo)
 * ==========================================================================
 */

export class SkillBar {
  static renderizar(tecnologia) {
    const nivel = tecnologia.obtenerNivel();
    return `
      <div class="skill-item">
        <div class="skill-info">
          <div class="skill-meta">
            ${tecnologia.icono ? `
              <div class="skill-icon-wrap">
                <img src="${tecnologia.icono}" alt="${tecnologia.nombre}" width="20" height="20">
              </div>
            ` : ""}
            <span>${tecnologia.nombre}</span>
          </div>
          <span class="skill-percentage">${nivel}%</span>
        </div>
        <div class="skill-track" role="progressbar" aria-valuenow="${nivel}" aria-valuemin="0" aria-valuemax="100" aria-label="Dominio de ${tecnologia.nombre}">
          <div class="skill-progress" data-target-width="${nivel}"></div>
        </div>
      </div>
    `;
  }
}
