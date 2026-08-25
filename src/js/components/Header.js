/**
 * ==========================================================================
 * COMPONENTE: Header
 * FUENTE: RF-012, HU-008, §2.7 (§5.2 del pseudocódigo)
 * ==========================================================================
 */

import { Navigation } from "./Navigation.js";
import { SITE_CONFIG } from "../config/constants.js";
import { ServicioAnalitica } from "../services/ServicioAnalitica.js";

export class Header {
  static renderizar(perfil) {
    const navItemsDesktop = Navigation.renderizar(false);
    const navItemsMobile = Navigation.renderizar(true);

    return `
      <header class="site-header" role="banner">
        <div class="container header-container">
          <!-- Logo & Marca -->
          <a href="#inicio" class="brand-logo" aria-label="Ir al inicio del portafolio">
            <div class="brand-icon">JC</div>
            <div class="brand-title">
              <span class="brand-name">${SITE_CONFIG.TITULO_CORTO}</span>
              <span class="brand-role">TI · Datos · Seguridad</span>
            </div>
          </a>

          <!-- Menú de Navegación Desktop -->
          <nav class="nav-menu" role="navigation" aria-label="Navegación principal">
            ${navItemsDesktop}
          </nav>

          <!-- Acciones del Header (CTA CV y Contacto) -->
          <div class="header-actions">
            <a href="${perfil.botonCV.archivo}" class="btn btn-outline btn-sm desktop-only js-cv-download" download aria-label="Descargar currículum vitae en PDF">
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar CV
            </a>
            
            <a href="#contacto" class="btn btn-primary btn-sm desktop-only">
              Contacto
            </a>

            <!-- Botón Hamburguesa Móvil -->
            <button type="button" class="mobile-menu-toggle" aria-label="Abrir menú de navegación móvil" aria-expanded="false" aria-controls="mobile-drawer-menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>

        <!-- Drawer Menú Móvil -->
        <div class="mobile-drawer" id="mobile-drawer-menu" role="navigation" aria-label="Navegación móvil">
          ${navItemsMobile}
          <div style="display:flex; flex-direction:column; gap:12px; margin-top:20px;">
            <a href="${perfil.botonCV.archivo}" class="btn btn-outline js-cv-download" download>
              <svg class="btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar Currículum (PDF)
            </a>
            <a href="#contacto" class="btn btn-primary">
              Contáctame Ahora
            </a>
          </div>
        </div>
      </header>
    `;
  }

  static vincularEventos() {
    const toggle = document.querySelector(".mobile-menu-toggle");
    const drawer = document.querySelector(".mobile-drawer");

    if (toggle && drawer) {
      toggle.addEventListener("click", () => {
        const isOpen = drawer.classList.toggle("open");
        toggle.setAttribute("aria-expanded", String(isOpen));
      });
    }

    // Registro de eventos analíticos de descarga de CV
    document.querySelectorAll(".js-cv-download").forEach(btn => {
      btn.addEventListener("click", () => {
        ServicioAnalitica.registrarDescargaCV();
      });
    });
  }
}
