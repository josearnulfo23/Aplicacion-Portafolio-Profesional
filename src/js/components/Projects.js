/**
 * ==========================================================================
 * COMPONENTE: Projects (Sección 5 - Portafolio de Proyectos)
 * FUENTE: HU-004, RF-005, CU-004, RF-015 (§6.5 del pseudocódigo)
 * ==========================================================================
 */

import { Modal } from "./ui/Modal.js";

export class Projects {
  static proyectosData = [];

  static renderizar(proyectos) {
    this.proyectosData = proyectos;

    const categorias = ["Todos", "Seguridad y Control", "Análisis de Datos", "Desarrollo TI"];
    const tabsHtml = categorias.map((cat, idx) => `
      <button type="button" class="tab-btn js-project-filter ${idx === 0 ? 'active' : ''}" data-filter="${cat}">
        ${cat}
      </button>
    `).join("");

    const cardsHtml = proyectos.map((p, idx) => this.renderizarCard(p, idx)).join("");

    return `
      <section id="proyectos" class="projects-section" aria-labelledby="projects-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Casos de Éxito</span>
            <h2 id="projects-title">Portafolio de <span class="gradient-text">Proyectos</span></h2>
            <p class="section-subtitle">Soluciones implementadas con impacto cuantificable en arquitectura, telemetría y analítica.</p>
          </div>

          <!-- Filtros por Categoría (RF-005, CU-004) -->
          <div class="tabs-container reveal-on-scroll">
            ${tabsHtml}
          </div>

          <!-- Grid de Proyectos -->
          <div class="projects-grid" id="projects-grid-container">
            ${cardsHtml}
          </div>

          <div style="text-align:center; margin-top:var(--spacing-2xl);" class="reveal-on-scroll">
            <a href="https://github.com/jose-cespedes" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-lg">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              Ver más repositorios en GitHub
            </a>
          </div>
        </div>
      </section>
    `;
  }

  static renderizarCard(p, idx) {
    const tagsHtml = p.tecnologiasUtilizadas.slice(0, 4).map(t => `<span class="tag">${t}</span>`).join(" ");

    return `
      <article class="card project-card reveal-on-scroll stagger-${(idx % 4) + 1}" data-category="${p.categoria}" data-project-id="${p.idProyecto}">
        <div class="project-thumbnail">
          <img src="${p.imagenRepresentativa}" alt="Miniatura de ${p.titulo}" width="600" height="360" loading="lazy">
          <span class="project-badge-category">${p.categoria}</span>
        </div>

        <h3 class="project-title">${p.titulo}</h3>
        <p class="project-desc">${p.descripcionBreve}</p>

        <div class="project-tags">
          ${tagsHtml}
        </div>

        <div class="project-footer">
          <button type="button" class="btn btn-outline btn-sm js-open-modal" data-project-id="${p.idProyecto}" aria-label="Ver detalles completos del proyecto ${p.titulo}">
            Ver Caso de Estudio ▹
          </button>
          
          ${p.enlaceGitHub ? `
            <a href="${p.enlaceGitHub}" target="_blank" rel="noopener noreferrer" class="social-icon-btn" aria-label="Código fuente en GitHub">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            </a>
          ` : ""}
        </div>
      </article>
    `;
  }

  static vincularEventos() {
    // Filtros por categoría (CU-004 flujo alternativo)
    const filterBtns = document.querySelectorAll(".js-project-filter");
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const categoria = btn.getAttribute("data-filter");
        const cards = document.querySelectorAll(".project-card");

        cards.forEach(card => {
          const cardCat = card.getAttribute("data-category");
          if (!categoria || categoria === "Todos" || cardCat.toLowerCase() === categoria.toLowerCase()) {
            card.style.display = "flex";
          } else {
            card.style.display = "none";
          }
        });
      });
    });

    // Apertura de modal de detalle
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".js-open-modal");
      if (!openBtn) return;

      const id = openBtn.getAttribute("data-project-id");
      const proyecto = this.proyectosData.find(p => p.idProyecto === id);
      if (proyecto) {
        Modal.abrirDetalleProyecto(proyecto, openBtn);
      }
    });
  }
}
