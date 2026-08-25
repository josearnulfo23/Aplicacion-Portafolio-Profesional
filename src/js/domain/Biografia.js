/**
 * ==========================================================================
 * ENTIDAD: Biografia
 * FUENTE: RF-002 (§3.2 del pseudocódigo)
 * ==========================================================================
 */

export class Biografia {
  constructor(data = {}) {
    this.biografiaProfesional = data.biografiaProfesional || "";
    this.parrafos = data.parrafos || [];
    this.areasEspecializacion = data.areasEspecializacion || [];
    this.valoresProfesionales = data.valoresProfesionales || [];
    this.estadisticasClave = data.estadisticasClave || [];
    this.imagenComplementaria = data.imagenComplementaria || "";
  }

  validarLongitud() {
    const palabras = this.biografiaProfesional.trim().split(/\s+/).length;
    return palabras >= 50;
  }
}
