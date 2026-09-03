/**
 * ==========================================================================
 * PUNTO DE ENTRADA PRINCIPAL: main.js
 * FUENTE: §2.6, §2.7, §4.2 (PaginaPrincipal) del pseudocódigo
 * Versión 2.0.2: Fix refresco — landing re-renderiza tras cada edición admin.
 * El panel ya no reconstruye toda la app de forma que cierre el modal;
 * en su lugar invalida caché → recarga bundle → re-renderiza secciones.
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
import { AdminPanel } from "./components/AdminPanel.js";

export class App {
  static _isInitializing = false;
  static _lastData = null;

  static async inicializar() {
    if (this._isInitializing) return;
    this._isInitializing = true;
    console.log("🚀 Inicializando Portafolio Profesional v2.0.2...");

    const appContainer = document.getElementById("app");
    if (!appContainer) {
      console.error("No se encontró el contenedor #app en el DOM.");
      this._isInitializing = false;
      return;
    }

    const savedTheme = localStorage.getItem("portafolio_theme") || "dark";
    document.documentElement.setAttribute("data-theme", savedTheme);

    try {
      await RepositorioContenido.cargarTodo();
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
      this._lastData = { perfil, bio, experiencias, habilidades, proyectos, servicios, educacion, testimonios };

      this._renderLanding(appContainer, this._lastData);

      Header.vincularEventos();
      Projects.vincularEventos();
      Contact.vincularEventos();
      AdminPanel.vincularEventos();
      AdminPanel.setUpdateCallback(() => App.recargarTrasEdicionAdmin());

      ServicioNavegacion.inicializar();
      ServicioAnimaciones.inicializar();
      ServicioAccesibilidad.inicializar();

      // Re-inyectar SEO con datos frescos
      ServicioSEO.inyectarStructuredData(perfil, bio, servicios);

      console.log("✅ Aplicación v2.0.2 renderizada con datos dinámicos SQLite.");
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
    } finally {
      this._isInitializing = false;
    }
  }

  /**
   * Refresca SOLO la landing (Header/Hero/About...Footer) sin destruir el modal Admin.
   * Se llama tras cada POST/PUT/DELETE exitoso del panel.
   */
  static async recargarTrasEdicionAdmin() {
    // Invalida y recarga bundle fresco con cache-bust
    RepositorioContenido.invalidarCache();
    await RepositorioContenido.cargarTodo();
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
    this._lastData = { perfil, bio, experiencias, habilidades, proyectos, servicios, educacion, testimonios };

    const appContainer = document.getElementById("app");
    if (!appContainer) return;

    // Guardar estado del modal Admin para no cerrarlo
    const adminModal = document.getElementById("admin-modal");
    const adminWasOpen = adminModal && adminModal.style.display !== "none";
    const adminScrollTop = adminModal ? adminModal.scrollTop : 0;

    this._renderLanding(appContainer, this._lastData);

    // Re-vincular eventos (Header, Projects, Contact, Admin)
    Header.vincularEventos();
    Projects.vincularEventos();
    Contact.vincularEventos();
    // AdminPanel ya existe: re-vincular flotante y si estaba abierto, mantenerlo
    AdminPanel.vincularEventos();
    // El Dashboard se recarga por separado en AdminPanel.cargarYRenderDashboard() después de este callback
    // Restaurar apertura del modal si el usuario estaba editando
    if (adminWasOpen) {
      const restored = document.getElementById("admin-modal");
      if (restored) {
        restored.style.display = "flex";
        document.body.style.overflow = "hidden";
        restored.scrollTop = adminScrollTop;
      }
    }
    ServicioNavegacion.inicializar();
    ServicioAnimaciones.inicializar();
    ServicioSEO.inyectarStructuredData(perfil, bio, servicios);
    console.log("🔄 Landing refrescada tras edición admin — secciones actualizadas desde SQLite.");
  }

  static _renderLanding(appContainer, data) {
    const { perfil, bio, experiencias, habilidades, proyectos, servicios, educacion, testimonios } = data;
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
          ${Contact.renderizar(perfil)}
        </main>
        ${Footer.renderizar(perfil)}
        ${AdminPanel.renderizar()}
      `;
  }
}

// Arrancar cuando el DOM esté listo
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => App.inicializar());
  } else {
    App.inicializar();
  }
}
