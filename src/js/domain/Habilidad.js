/**
 * ==========================================================================
 * ENTIDADES: CategoriaHabilidad & Tecnologia
 * FUENTE: HU-003, RF-004, CU-003 (§3.4 del pseudocódigo)
 * ==========================================================================
 */

export class Tecnologia {
  constructor(data = {}) {
    this.nombre = data.nombre || "";
    this.icono = data.icono || "";
    this.nivelDominio = typeof data.nivelDominio === "number" ? data.nivelDominio : 80;
    this.aniosExperiencia = data.aniosExperiencia || 1;
    this.certificacionesAsociadas = data.certificacionesAsociadas || [];
  }

  obtenerNivel() {
    return Math.max(0, Math.min(100, this.nivelDominio));
  }
}

export class CategoriaHabilidad {
  constructor(data = {}) {
    this.id = data.id || "";
    this.nombreCategoria = data.nombreCategoria || "";
    this.descripcion = data.descripcion || "";
    this.icono = data.icono || "";
    this.tecnologias = (data.tecnologias || []).map(t => new Tecnologia(t));
  }

  obtenerTecnologias() {
    return this.tecnologias;
  }
}
