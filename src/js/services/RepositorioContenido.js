/**
 * ==========================================================================
 * MÓDULO: RepositorioContenido
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
  static async cargarJSON(rutaRelativa) {
    // Detectar entorno: Node.js (sin window ni fetch global de navegador)
    const esNode = typeof window === 'undefined' || typeof window.document === 'undefined';

    if (esNode) {
      // Cargar desde filesystem en entorno Node (usado por los tests)
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

    // Entorno navegador: usar fetch
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
    const raw = await this.cargarJSON("src/js/data/profile.json");
    return new PerfilProfesional(raw || {});
  }

  static async cargarBiografia() {
    const raw = await this.cargarJSON("src/js/data/about.json");
    return new Biografia(raw || {});
  }

  static async cargarExperiencia() {
    const raw = await this.cargarJSON("src/js/data/experience.json");
    const lista = (raw || []).map(item => new ExperienciaLaboral(item));
    // Orden cronológico inverso garantizado (RF-003)
    return lista.sort((a, b) => a.compararPorFecha(b));
  }

  static async cargarHabilidades() {
    const raw = await this.cargarJSON("src/js/data/skills.json");
    return (raw || []).map(cat => new CategoriaHabilidad(cat));
  }

  static async cargarProyectos() {
    const raw = await this.cargarJSON("src/js/data/projects.json");
    return (raw || []).map(p => new Proyecto(p));
  }

  static async cargarServicios() {
    const raw = await this.cargarJSON("src/js/data/services.json");
    return (raw || []).map(s => new Servicio(s));
  }

  static async cargarEducacion() {
    const raw = await this.cargarJSON("src/js/data/education.json");
    return new EducacionYCertificacion(raw || {});
  }

  static async cargarTestimonios() {
    const raw = await this.cargarJSON("src/js/data/testimonials.json");
    return (raw || []).map(t => new Testimonio(t));
  }
}
