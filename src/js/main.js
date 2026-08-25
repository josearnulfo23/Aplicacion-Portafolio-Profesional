/**
 * ==========================================================================
 * PUNTO DE ENTRADA PRINCIPAL: main.js
 * FUENTE: §2.6, §2.7, §4.2 (PaginaPrincipal) del pseudocódigo
 * ==========================================================================
 */

import { RepositorioContenido } from "./services/RepositorioContenido.js";
import { ServicioNavegacion } from "./services/ServicioNavegacion.js";
import { ServicioAnimaciones } from "./services/ServicioAnimaciones.js";
import { ServicioSEO } from "./services/ServicioSEO.js";
import { ServicioAccesibilidad } from "./services/ServicioAccesibilidad.js";

import { Header } from "./components/Header.js";
import { Hero } from "./components/Hero.js";
import { About } from "./components/About.js";
import { Experience } from "./components/Experience.js";
import { Skills } from "./components/Skills.js";
import { Projects } from "./components/Projects.js";
import { Services } from "./components/Services.js";
import { Education } from "./components/Education.js";
import { Testimonials } from "./components/Testimonials.js";
import { Contact } from "./components/Contact.js";
import { Footer } from "./components/Footer.js";

class App {
  static async inicializar() {
    console.log("🚀 Inicializando Portafolio Profesional (PS-009)...");

    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error("No se encontró el contenedor #app en el DOM.");
      return;
    }

    try {
      // 1. Cargar datos estructurados de forma asíncrona
      const [
        perfil,
        bio,
        experiencias,
        habilidades,
        proyectos,
        servicios,
        educacion,
        testimonios
      ] = await Promise.all([
        RepositorioContenido.cargarPerfil(),
        RepositorioContenido.cargarBiografia(),
        RepositorioContenido.cargarExperiencia(),
        RepositorioContenido.cargarHabilidades(),
        RepositorioContenido.cargarProyectos(),
        RepositorioContenido.cargarServicios(),
        RepositorioContenido.cargarEducacion(),
        RepositorioContenido.cargarTestimonios()
      ]);

      // 2. Renderizar las 9 secciones en el orden exacto del mapa de navegación (§2.7)
      appContainer.innerHTML = `
        ${Header.renderizar(perfil)}
        <main id="main-content">
          ${Hero.renderizar(perfil)}
          ${About.renderizar(bio)}
          ${Experience.renderizar(experiencias)}
          ${Skills.renderizar(habilidades)}
          ${Projects.renderizar(proyectos)}
          ${Services.renderizar(servicios)}
          ${Education.renderizar(educacion)}
          ${Testimonials.renderizar(testimonios)}
          ${Contact.renderizar()}
        </main>
        ${Footer.renderizar(perfil)}
      `;

      // 3. Inyectar Metadatos Estructurados Schema.org para SEO
      ServicioSEO.inyectarStructuredData(perfil, bio, servicios);

      // 4. Vincular eventos de componentes interactivos
      Header.vincularEventos();
      Projects.vincularEventos();
      Contact.vincularEventos();

      // 5. Inicializar servicios transversales
      ServicioNavegacion.inicializar();
      ServicioAnimaciones.inicializar();
      ServicioAccesibilidad.inicializar();

      console.log("✅ Aplicación renderizada y lista con 100% de cobertura.");
    } catch (error) {
      console.error("Error crítico al inicializar la aplicación:", error);
      appContainer.innerHTML = `
        <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; text-align:center; color:#FFFFFF;">
          <div style="background:#1C2541; border:1px solid #EF4444; border-radius:12px; padding:2rem; max-width:500px;">
            <h2 style="color:#EF4444; margin-bottom:1rem;">Error de Inicialización</h2>
            <p style="color:#CBD5E1; margin-bottom:1.5rem;">Ocurrió un error al cargar los datos del portafolio. Por favor recarga la página o verifica la consola.</p>
            <button onclick="window.location.reload()" style="background:#00B4D8; color:#060B18; border:none; padding:0.75rem 1.5rem; border-radius:6px; font-weight:bold; cursor:pointer;">
              Reintentar Carga
            </button>
          </div>
        </div>
      `;
    }
  }
}

// Arrancar cuando el DOM esté listo
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => App.inicializar());
} else {
  App.inicializar();
}
