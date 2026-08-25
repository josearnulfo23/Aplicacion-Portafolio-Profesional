/**
 * ==========================================================================
 * SERVICIO: Validacion
 * FUENTE: RF-009, RNF-006, RNF-007 (§9.1 del pseudocódigo)
 * ==========================================================================
 */

export class ServicioValidacion {
  static longitudMinimaMensaje = 10;
  static regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

  static validarNombre(nombre) {
    if (!nombre || typeof nombre !== "string" || nombre.trim().length === 0) {
      return { campo: "nombre", mensaje: "El nombre es obligatorio." };
    }
    if (nombre.trim().length < 2) {
      return { campo: "nombre", mensaje: "El nombre debe tener al menos 2 caracteres." };
    }
    return null;
  }

  static validarEmail(email) {
    if (!email || typeof email !== "string" || email.trim().length === 0) {
      return { campo: "email", mensaje: "El correo electrónico es obligatorio." };
    }
    if (!this.regexEmail.test(email.trim())) {
      return { campo: "email", mensaje: "Ingrese un formato de correo electrónico válido (ejemplo@dominio.com)." };
    }
    return null;
  }

  static validarAsunto(asunto) {
    if (!asunto || typeof asunto !== "string" || asunto.trim().length === 0) {
      return { campo: "asunto", mensaje: "El asunto del mensaje es obligatorio." };
    }
    if (asunto.trim().length < 3) {
      return { campo: "asunto", mensaje: "El asunto debe tener al menos 3 caracteres." };
    }
    return null;
  }

  static validarMensaje(mensaje) {
    if (!mensaje || typeof mensaje !== "string" || mensaje.trim().length === 0) {
      return { campo: "mensaje", mensaje: "El mensaje es obligatorio." };
    }
    if (mensaje.trim().length < this.longitudMinimaMensaje) {
      return { campo: "mensaje", mensaje: `El mensaje debe contener al menos ${this.longitudMinimaMensaje} caracteres.` };
    }
    return null;
  }

  static validarMensajeCompleto(m) {
    const errores = [];
    const errNombre = this.validarNombre(m.nombre);
    if (errNombre) errores.push(errNombre);

    const errEmail = this.validarEmail(m.email);
    if (errEmail) errores.push(errEmail);

    const errAsunto = this.validarAsunto(m.asunto);
    if (errAsunto) errores.push(errAsunto);

    const errMensaje = this.validarMensaje(m.mensaje);
    if (errMensaje) errores.push(errMensaje);

    return errores;
  }

  static sanitizarTexto(entrada) {
    if (!entrada || typeof entrada !== "string") return "";
    return entrada
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#x27;")
      .replace(/\//g, "&#x2F;")
      .trim();
  }
}
