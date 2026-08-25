/**
 * ==========================================================================
 * SERVICIO: Accesibilidad
 * FUENTE: RNF-004 (§9.7 del pseudocódigo)
 * ==========================================================================
 */

export class ServicioAccesibilidad {
  static inicializar() {
    this.configurarAtajosTeclado();
    this.configurarGestionFoco();
  }

  static configurarAtajosTeclado() {
    document.addEventListener("keydown", (e) => {
      // Tecla Escape para cerrar modales o menús móviles
      if (e.key === "Escape") {
        const modal = document.querySelector(".modal-backdrop.open");
        if (modal) {
          const closeBtn = modal.querySelector(".modal-close-btn");
          if (closeBtn) closeBtn.click();
        }

        const drawer = document.querySelector(".mobile-drawer.open");
        if (drawer) {
          const toggle = document.querySelector(".mobile-menu-toggle");
          drawer.classList.remove("open");
          if (toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.focus();
          }
        }
      }
    });
  }

  static configurarGestionFoco() {
    // Asegurar que las imágenes tengan alt descriptivos
    document.querySelectorAll("img:not([alt])").forEach((img) => {
      img.setAttribute("alt", "Imagen descriptiva");
    });
  }

  static atraparFoco(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    modalElement.addEventListener("keydown", (e) => {
      if (e.key !== "Tab") return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    });

    firstElement.focus();
  }
}
