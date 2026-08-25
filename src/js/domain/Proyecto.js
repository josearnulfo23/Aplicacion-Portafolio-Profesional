/**
 * ==========================================================================
 * ENTIDAD: Proyecto
 * FUENTE: HU-004, RF-005, CU-004 (§3.5 del pseudocódigo)
 * ==========================================================================
 */

export class Proyecto {
  constructor(data = {}) {
    this.idProyecto = data.idProyecto || "";
    this.titulo = data.titulo || "";
    this.subtitulo = data.subtitulo || "";
    this.categoria = data.categoria || "Desarrollo TI";
    this.descripcionBreve = data.descripcionBreve || "";
    this.descripcionDetallada = data.descripcionDetallada || "";
    this.tecnologiasUtilizadas = data.tecnologiasUtilizadas || [];
    this.imagenRepresentativa = data.imagenRepresentativa || "";
    this.resultadosObtenidos = data.resultadosObtenidos || [];
    this.enlaceDemo = data.enlaceDemo || "#";
    this.enlaceGitHub = data.enlaceGitHub || "";
    this.destacado = Boolean(data.destacado);
    this.metricasImpacto = data.metricasImpacto || [];
  }

  coincideConFiltro(categoriaBuscada) {
    if (!categoriaBuscada || categoriaBuscada.toLowerCase() === "todos") {
      return true;
    }
    return this.categoria.toLowerCase() === categoriaBuscada.toLowerCase();
  }
}
