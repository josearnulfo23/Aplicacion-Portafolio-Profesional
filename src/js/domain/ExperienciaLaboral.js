/**
 * ==========================================================================
 * ENTIDAD: ExperienciaLaboral
 * FUENTE: HU-002, RF-003, CU-002 (§3.3 del pseudocódigo)
 * ==========================================================================
 */

export class ExperienciaLaboral {
  constructor(data = {}) {
    this.id = data.id || "";
    this.cargo = data.cargo || "";
    this.empresa = data.empresa || "";
    this.ubicacion = data.ubicacion || "";
    this.modalidad = data.modalidad || "";
    this.periodoInicio = data.periodoInicio || "";
    this.periodoFin = data.periodoFin || "Presente";
    this.estaVigente = data.estaVigente || this.periodoFin.toLowerCase() === "presente";
    this.descripcion = data.descripcion || "";
    this.responsabilidades = data.responsabilidades || [];
    this.logrosCuantificables = data.logrosCuantificables || [];
    this.tecnologias = data.tecnologias || [];
  }

  compararPorFecha(otra) {
    if (this.estaVigente) return -1;
    if (otra.estaVigente) return 1;
    
    // Parse "MM/YYYY" or "YYYY"
    const parseDate = (str) => {
      if (!str || str.toLowerCase() === "presente") return new Date().getTime();
      const parts = str.split("/");
      if (parts.length === 2) {
        return new Date(parseInt(parts[1], 10), parseInt(parts[0], 10) - 1).getTime();
      }
      return new Date(parseInt(str, 10), 0).getTime();
    };

    return parseDate(otra.periodoFin) - parseDate(this.periodoFin);
  }
}
