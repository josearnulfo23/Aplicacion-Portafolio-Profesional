/**
 * ==========================================================================
 * ENTIDAD: Servicio
 * FUENTE: HU-010, RF-006, RF-015 (§3.6 del pseudocódigo)
 * ==========================================================================
 */

export class Servicio {
  constructor(data = {}) {
    this.id = data.id || "";
    this.nombreServicio = data.nombreServicio || "";
    this.categoria = data.categoria || "";
    this.descripcion = data.descripcion || "";
    this.icono = data.icono || "";
    this.entregables = data.entregables || [];
    this.ctaTexto = data.ctaTexto || "Solicitar Consulta";
    this.ctaDestino = data.ctaDestino || "#contacto";
  }
}
