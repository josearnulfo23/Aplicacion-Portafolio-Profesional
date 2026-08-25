/**
 * ==========================================================================
 * SERVICIO: Navegacion
 * FUENTE: RF-012, RF-014, HU-008, RNF-007 (§9.3 del pseudocódigo)
 * ==========================================================================
 */

export class ServicioNavegacion {
  static inicializar() {
    this.configurarSmoothScroll();
    this.configurarScrollSpy();
    this.configurarHeaderScroll();
    this.configurarBotonIrArriba();
  }

  static desplazarASeccion(idDestino) {
    const selector = idDestino.startsWith("#") ? idDestino : `#${idDestino}`;
    const elemento = document.querySelector(selector);
    if (!elemento) return;

    const headerHeight = document.querySelector(".site-header")?.offsetHeight || 76;
    const elementoTop = elemento.getBoundingClientRect().top + window.pageYOffset - headerHeight + 10;

    window.scrollTo({
      top: elementoTop,
      behavior: "smooth"
    });
  }

  static configurarSmoothScroll() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href^='#']");
      if (!link) return;

      const targetId = link.getAttribute("href");
      if (targetId && targetId !== "#") {
        e.preventDefault();
        this.desplazarASeccion(targetId);

        // Si el drawer móvil está abierto, cerrarlo
        const drawer = document.querySelector(".mobile-drawer");
        const toggle = document.querySelector(".mobile-menu-toggle");
        if (drawer && drawer.classList.contains("open")) {
          drawer.classList.remove("open");
          if (toggle) toggle.setAttribute("aria-expanded", "false");
        }
      }
    });
  }

  static configurarScrollSpy() {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-link[href^='#']");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("id");
            navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }
        });
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );

    sections.forEach((sec) => observer.observe(sec));
  }

  static configurarHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }, { passive: true });
  }

  static configurarBotonIrArriba() {
    const btnTop = document.querySelector(".scroll-top-btn");
    if (!btnTop) return;

    window.addEventListener("scroll", () => {
      if (window.scrollY > 400) {
        btnTop.classList.add("visible");
      } else {
        btnTop.classList.remove("visible");
      }
    }, { passive: true });

    btnTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
