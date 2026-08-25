/**
 * ==========================================================================
 * SERVICIO: Animaciones
 * FUENTE: RF-014, RNF-001 (§9.4 del pseudocódigo)
 * ==========================================================================
 */

export class ServicioAnimaciones {
  static inicializar() {
    if (!this.evaluarRestriccionRendimiento()) {
      // Dispositivo de bajo rendimiento o reduce-motion: revelar todo directamente
      document.querySelectorAll(".reveal-on-scroll").forEach(el => el.classList.add("is-revealed"));
      return;
    }

    this.observarElementosScroll();
    this.observarBarrasHabilidades();
  }

  static evaluarRestriccionRendimiento() {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return false;
    }
    return true;
  }

  static observarElementosScroll() {
    const elementos = document.querySelectorAll(".reveal-on-scroll");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-revealed");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    elementos.forEach((el) => observer.observe(el));
  }

  static observarBarrasHabilidades() {
    const barras = document.querySelectorAll(".skill-progress[data-target-width]");
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target.getAttribute("data-target-width");
            entry.target.style.width = `${target}%`;
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    barras.forEach((b) => observer.observe(b));
  }
}
