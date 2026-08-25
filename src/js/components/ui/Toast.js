/**
 * ==========================================================================
 * COMPONENTE UI: Toast
 * Feedback visual instantáneo para notificaciones
 * ==========================================================================
 */

export class Toast {
  static getContainer() {
    let container = document.querySelector(".toast-container");
    if (!container) {
      container = document.createElement("div");
      container.className = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  static mostrar(mensaje, tipo = "success", duracionMs = 4000) {
    const container = this.getContainer();
    const toast = document.createElement("div");
    toast.className = `toast toast-${tipo}`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "polite");

    const iconSvg = tipo === "success" 
      ? `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00FFC2" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>`
      : `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>`;

    toast.innerHTML = `
      <div>${iconSvg}</div>
      <div style="flex-grow:1;">${mensaje}</div>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateX(100%)";
      toast.style.transition = "all 0.3s ease";
      setTimeout(() => toast.remove(), 300);
    }, duracionMs);
  }

  static exito(mensaje) {
    this.mostrar(mensaje, "success");
  }

  static error(mensaje) {
    this.mostrar(mensaje, "error");
  }
}
