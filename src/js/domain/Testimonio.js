/**
 * ==========================================================================
 * ENTIDAD: Testimonio
 * FUENTE: HU-009, RF-007, CU-008 (§3.7 del pseudocódigo)
 * ==========================================================================
 */

export class Testimonio {
  constructor(data = {}) {
    this.id = data.id || "";
    this.textoTestimonio = data.textoTestimonio || "";
    this.nombreRecomendador = data.nombreRecomendador || "";
    this.cargo = data.cargo || "";
    this.empresa = data.empresa || "";
    this.foto = data.foto || "";
    this.valoracion = typeof data.valoracion === "number" ? data.valoracion : 5;
    this.relacionProfesional = data.relacionProfesional || "";
  }
}
