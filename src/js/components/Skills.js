/**
 * ==========================================================================
 * COMPONENTE: Skills (Sección 4 - Habilidades Técnicas)
 * FUENTE: HU-003, RF-004, CU-003 (§6.4 del pseudocódigo)
 * ==========================================================================
 */

import { SkillBar } from "./ui/SkillBar.js";

export class Skills {
  static renderizar(categorias) {
    const cardsHtml = categorias.map((cat, idx) => {
      const skillsBarsHtml = cat.tecnologias.map(t => SkillBar.renderizar(t)).join("");

      return `
        <div class="skills-category-card reveal-on-scroll stagger-${idx + 1}">
          <div class="skills-category-header">
            <div class="category-icon">
              <img src="${cat.icono}" alt="${cat.nombreCategoria}" width="24" height="24" loading="lazy">
            </div>
            <div>
              <h3 class="category-title">${cat.nombreCategoria}</h3>
              <p style="font-size:var(--fs-xs); color:var(--text-muted); margin:0;">${cat.descripcion}</p>
            </div>
          </div>
          
          <div class="skills-list">
            ${skillsBarsHtml}
          </div>
        </div>
      `;
    }).join("");

    return `
      <section id="habilidades" class="skills-section" aria-labelledby="skills-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Competencias Clave</span>
            <h2 id="skills-title">Habilidades <span class="gradient-text">Técnicas</span></h2>
            <p class="section-subtitle">Dominio clasificado en Tecnologías de la Información, Análisis de Datos y Seguridad Integral.</p>
          </div>

          <div class="skills-grid">
            ${cardsHtml}
          </div>
        </div>
      </section>
    `;
  }
}
