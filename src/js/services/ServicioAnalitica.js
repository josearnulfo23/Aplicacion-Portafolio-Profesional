/**
 * ==========================================================================
 * SERVICIO: Analitica
 * FUENTE: RNF-012, RNF-006, §2.10 (§9.6 del pseudocódigo)
 * ==========================================================================
 */

export class ServicioAnalitica {
  static consentimientoOtorgado = true; // Por defecto eventos locales de conversión

  static registrarEvento(nombreEvento, parametros = {}) {
    if (!this.consentimientoOtorgado) return;

    const dataEvento = {
      evento: nombreEvento,
      parametros,
      timestamp: new Date().toISOString(),
      url: window.location.href
    };

    console.log(`[ServicioAnalitica] Evento registrado: ${nombreEvento}`, dataEvento);

    // Integración opcional con Google Analytics (gtag) si estuviera disponible
    if (typeof window !== "undefined" && typeof window.gtag === "function") {
      window.gtag("event", nombreEvento, parametros);
    }
  }

  static registrarDescargaCV() {
    this.registrarEvento("descarga_cv", {
      categoria: "conversion",
      etiqueta: "CV_Jose_Cespedes"
    });
  }

  static registrarEnvioFormulario() {
    this.registrarEvento("envio_formulario_contacto", {
      categoria: "conversion",
      metodo: "formulario_web"
    });
  }
}
