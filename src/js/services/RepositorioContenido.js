/**
 * ==========================================================================
 * MÓDULO: RepositorioContenido (v2.0 Dinámico con SQLite / Fallback JSON)
 * FUENTE: §2.6, §2.9, RNF-008, RNF-009 (§4.1 del pseudocódigo)
 * ==========================================================================
 */

import { PerfilProfesional } from "../domain/PerfilProfesional.js";
import { Biografia } from "../domain/Biografia.js";
import { ExperienciaLaboral } from "../domain/ExperienciaLaboral.js";
import { CategoriaHabilidad } from "../domain/Habilidad.js";
import { Proyecto } from "../domain/Proyecto.js";
import { Servicio } from "../domain/Servicio.js";
import { EducacionYCertificacion } from "../domain/EducacionYCertificacion.js";
import { Testimonio } from "../domain/Testimonio.js";

export class RepositorioContenido {
  static _bundle = null;

  static async cargarTodo() {
    const esNode = typeof window === 'undefined' || typeof window.document === 'undefined';

    if (!esNode) {
      try {
        const response = await fetch('/api/content/all');
        if (response.ok) {
          const resJson = await response.json();
          if (resJson && resJson.success && resJson.data) {
            this._bundle = resJson.data;
            return this._bundle;
          }
        }
      } catch (err) {
        console.warn('[RepositorioContenido] API SQLite no disponible, usando fallback local:', err.message);
      }
    }

    return null;
  }

  static async cargarJSON(rutaRelativa) {
    const esNode = typeof window === 'undefined' || typeof window.document === 'undefined';

    if (esNode) {
      const fs = await import('node:fs');
      const path = await import('node:path');
      const url = await import('node:url');

      const __filename = url.fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      const projectRoot = path.resolve(__dirname, '..', '..', '..');

      const filePath = path.join(projectRoot, rutaRelativa);
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
      } catch (err) {
        console.warn(`[RepositorioContenido] Advertencia al cargar ${rutaRelativa}:`, err.message);
        return null;
      }
    }

    try {
      const response = await fetch(rutaRelativa);
      if (!response.ok) {
        throw new Error(`Error HTTP ${response.status} al cargar ${rutaRelativa}`);
      }
      return await response.json();
    } catch (err) {
      console.warn(`[RepositorioContenido] Advertencia al cargar ${rutaRelativa}:`, err.message);
      return null;
    }
  }

  static async cargarPerfil() {
    if (this._bundle && this._bundle.profile) {
      return new PerfilProfesional(this._bundle.profile);
    }
    const raw = await this.cargarJSON("src/js/data/profile.json");
    return new PerfilProfesional(raw || {});
  }

  static async cargarBiografia() {
    if (this._bundle && this._bundle.about) {
      return new Biografia(this._bundle.about);
    }
    const raw = await this.cargarJSON("src/js/data/about.json");
    return new Biografia(raw || {});
  }

  static async cargarExperiencia() {
    if (this._bundle && this._bundle.experience) {
      const lista = this._bundle.experience.map(item => new ExperienciaLaboral(item));
      return lista.sort((a, b) => a.compararPorFecha(b));
    }
    const raw = await this.cargarJSON("src/js/data/experience.json");
    const lista = (raw || []).map(item => new ExperienciaLaboral(item));
    return lista.sort((a, b) => a.compararPorFecha(b));
  }

  static async cargarHabilidades() {
    if (this._bundle && this._bundle.skills) {
      return this._bundle.skills.map(cat => new CategoriaHabilidad(cat));
    }
    const raw = await this.cargarJSON("src/js/data/skills.json");
    return (raw || []).map(cat => new CategoriaHabilidad(cat));
  }

  static async cargarProyectos() {
    if (this._bundle && this._bundle.projects) {
      return this._bundle.projects.map(p => new Proyecto(p));
    }
    const raw = await this.cargarJSON("src/js/data/projects.json");
    return (raw || []).map(p => new Proyecto(p));
  }

  static async cargarServicios() {
    if (this._bundle && this._bundle.services) {
      return this._bundle.services.map(s => new Servicio(s));
    }
    const raw = await this.cargarJSON("src/js/data/services.json");
    return (raw || []).map(s => new Servicio(s));
  }

  static async cargarEducacion() {
    if (this._bundle && this._bundle.education) {
      return new EducacionYCertificacion(this._bundle.education);
    }
    const raw = await this.cargarJSON("src/js/data/education.json");
    return new EducacionYCertificacion(raw || {});
  }

  static async cargarTestimonios() {
    if (this._bundle && this._bundle.testimonials) {
      return this._bundle.testimonials.map(t => new Testimonio(t));
    }
    const raw = await this.cargarJSON("src/js/data/testimonials.json");
    return (raw || []).map(t => new Testimonio(t));
  }

  static invalidarCache() {
    this._bundle = null;
  }
}
