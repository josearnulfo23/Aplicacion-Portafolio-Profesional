/**
 * ==========================================================================
 * COMPONENTE UI: Modal
 * FUENTE: RF-005, CU-004, RNF-004 (§7.3 del pseudocódigo)
 * ==========================================================================
 */

import { ServicioAccesibilidad } from "../../services/ServicioAccesibilidad.js";

export class Modal {
  static modalBackdrop = null;
  static elementoQueAbrio = null;

  static inicializar() {
    if (this.modalBackdrop) return;

    this.modalBackdrop = document.createElement("div");
    this.modalBackdrop.className = "modal-backdrop";
    this.modalBackdrop.setAttribute("role", "dialog");
    this.modalBackdrop.setAttribute("aria-modal", "true");
    this.modalBackdrop.setAttribute("aria-hidden", "true");

    this.modalBackdrop.innerHTML = `
      <div class="modal-dialog" role="document">
        <div class="modal-header">
          <h3 class="modal-title" id="modal-title-text" style="color:var(--text-primary);">Detalle de Proyecto</h3>
          <button type="button" class="modal-close-btn" aria-label="Cerrar ventana emergente">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="modal-body" id="modal-body-content">
          <!-- Contenido dinámico -->
        </div>
      </div>
    `;

    document.body.appendChild(this.modalBackdrop);

    // Eventos de cierre
    const closeBtn = this.modalBackdrop.querySelector(".modal-close-btn");
    closeBtn.addEventListener("click", () => this.cerrar());

    this.modalBackdrop.addEventListener("click", (e) => {
      if (e.target === this.modalBackdrop) {
        this.cerrar();
      }
    });
  }

  static abrirDetalleProyecto(proyecto, elementoDisparador = null) {
    this.inicializar();
    this.elementoQueAbrio = elementoDisparador;

    const titleEl = document.getElementById("modal-title-text");
    const bodyEl = document.getElementById("modal-body-content");

    titleEl.textContent = proyecto.titulo;

    const tagsHtml = proyecto.tecnologiasUtilizadas
      .map(t => `<span class="tag tag-accent">${t}</span>`)
      .join(" ");

    const resultadosHtml = proyecto.resultadosObtenidos
      .map(r => `<li>▹ ${r}</li>`)
      .join("");

    const metricasHtml = proyecto.metricasImpacto && proyecto.metricasImpacto.length > 0
      ? `
        <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(140px, 1fr)); gap:12px; margin:20px 0;">
          ${proyecto.metricasImpacto.map(m => `
            <div style="background:rgba(0,180,216,0.1); border:1px solid rgba(72,202,228,0.2); border-radius:8px; padding:12px; text-align:center;">
              <div style="font-size:1.4rem; font-weight:800; color:var(--accent-cyan); font-family:var(--font-heading);">${m.valor}</div>
              <div style="font-size:0.75rem; color:var(--text-muted); text-transform:uppercase;">${m.indicador}</div>
            </div>
          `).join("")}
        </div>
      ` : "";

    bodyEl.innerHTML = `
      <img class="modal-image" src="${proyecto.imagenRepresentativa}" alt="${proyecto.titulo}">
      <div style="margin-bottom:16px;">
        <span class="tag" style="margin-bottom:12px;">${proyecto.categoria}</span>
        <h4 style="color:var(--accent-azure); margin-top:8px; margin-bottom:12px;">${proyecto.subtitulo}</h4>
        <p style="color:var(--text-secondary); line-height:1.7;">${proyecto.descripcionDetallada}</p>
      </div>

      ${metricasHtml}

      <div style="margin:20px 0;">
        <h4 style="color:var(--text-primary); font-size:var(--fs-base); margin-bottom:8px;">Resultados y Logros Obtenidos:</h4>
        <ul style="color:var(--text-secondary); display:flex; flex-direction:column; gap:8px;">
          ${resultadosHtml}
        </ul>
      </div>

      <div style="margin:20px 0;">
        <h4 style="color:var(--text-primary); font-size:var(--fs-base); margin-bottom:8px;">Tecnologías Utilizadas:</h4>
        <div style="display:flex; flex-wrap:wrap; gap:8px;">
          ${tagsHtml}
        </div>
      </div>

      <div style="display:flex; gap:12px; margin-top:24px; padding-top:16px; border-top:1px solid rgba(255,255,255,0.08);">
        ${proyecto.enlaceGitHub ? `
          <a href="${proyecto.enlaceGitHub}" target="_blank" rel="noopener noreferrer" class="btn btn-secondary btn-sm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
            Ver en GitHub
          </a>
        ` : ""}
      </div>
    `;

    this.modalBackdrop.classList.add("open");
    this.modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";

    ServicioAccesibilidad.atraparFoco(this.modalBackdrop);
  }

  static cerrar() {
    if (!this.modalBackdrop) return;
    this.modalBackdrop.classList.remove("open");
    this.modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";

    if (this.elementoQueAbrio && typeof this.elementoQueAbrio.focus === "function") {
      this.elementoQueAbrio.focus();
    }
  }
}
