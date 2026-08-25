/**
 * ==========================================================================
 * ENTIDAD: MensajeContacto
 * FUENTE: HU-006, RF-009, CU-006, RNF-006 (§3.9 del pseudocódigo)
 * ==========================================================================
 */

import { ServicioValidacion } from "../services/ServicioValidacion.js";

export class MensajeContacto {
  constructor(data = {}) {
    this.nombre = (data.nombre || "").trim();
    this.email = (data.email || "").trim();
    this.asunto = (data.asunto || "").trim();
    this.mensaje = (data.mensaje || "").trim();
    this.tokenCSRF = data.tokenCSRF || "";
  }

  validar() {
    return ServicioValidacion.validarMensajeCompleto(this);
  }

  sanitizar() {
    this.nombre = ServicioValidacion.sanitizarTexto(this.nombre);
    this.email = ServicioValidacion.sanitizarTexto(this.email);
    this.asunto = ServicioValidacion.sanitizarTexto(this.asunto);
    this.mensaje = ServicioValidacion.sanitizarTexto(this.mensaje);
    return this;
  }
}
