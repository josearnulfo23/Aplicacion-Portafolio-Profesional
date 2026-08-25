/**
 * ==========================================================================
 * CONECTOR: Email
 * FUENTE: §2.6, RF-009, CU-006, RNF-006 (§9.2 del pseudocódigo)
 * ==========================================================================
 */

import { SITE_CONFIG } from "../config/constants.js";
import { ServicioValidacion } from "./ServicioValidacion.js";

export class ConectorEmail {
  static ultimoEnvio = 0;
  static TIEMPO_MINIMO_ENTRE_ENVIOS_MS = 5000; // Rate limiting (5 segundos)

  static generarTokenCSRF() {
    return 'csrf_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
  }

  static async enviarMensaje(mensajeContacto) {
    const ahora = Date.now();
    
    // 1. Rate Limiting (RNF-006)
    if (ahora - this.ultimoEnvio < this.TIEMPO_MINIMO_ENTRE_ENVIOS_MS) {
      return {
        exito: false,
        mensaje: "Por favor espere unos segundos antes de enviar otro mensaje."
      };
    }

    // 2. Validación en Servidor / Servicio
    const errores = ServicioValidacion.validarMensajeCompleto(mensajeContacto);
    if (errores.length > 0) {
      return {
        exito: false,
        errores,
        mensaje: "Por favor verifique los datos del formulario."
      };
    }

    // 3. Sanitización previa
    mensajeContacto.sanitizar();

    // 4. Procesamiento según proveedor
    try {
      this.ultimoEnvio = ahora;

      if (SITE_CONFIG.EMAIL_CONFIG.PROVIDER === "emailjs" && typeof window !== "undefined" && window.emailjs) {
        await window.emailjs.send(
          SITE_CONFIG.EMAIL_CONFIG.SERVICE_ID,
          SITE_CONFIG.EMAIL_CONFIG.TEMPLATE_ID,
          {
            from_name: mensajeContacto.nombre,
            from_email: mensajeContacto.email,
            subject: mensajeContacto.asunto,
            message: mensajeContacto.mensaje
          },
          SITE_CONFIG.EMAIL_CONFIG.PUBLIC_KEY
        );
      } else {
        // Modo simulado para pruebas locales offline de alta fidelidad
        await new Promise(resolve => setTimeout(resolve, 800));
        console.log("[ConectorEmail] Mensaje procesado con éxito:", {
          nombre: mensajeContacto.nombre,
          email: mensajeContacto.email,
          asunto: mensajeContacto.asunto,
          timestamp: new Date().toISOString()
        });
      }

      return {
        exito: true,
        mensaje: "¡Gracias por contactarme! Tu mensaje ha sido enviado exitosamente. Responderé a la brevedad."
      };
    } catch (error) {
      console.error("[ConectorEmail] Error al enviar mensaje:", error);
      return {
        exito: false,
        mensaje: "Ocurrió un error temporal al enviar el mensaje. Por favor intenta nuevamente o contáctame directamente por LinkedIn o correo."
      };
    }
  }
}
