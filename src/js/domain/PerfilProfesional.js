/**
 * ==========================================================================
 * ENTIDAD: PerfilProfesional
 * FUENTE: HU-001, RF-001, CU-001, §2.7
 * v2.0.1: Extendida con profesion, edad, email, telefono, numeroCelular, fotoComplementaria
 * ==========================================================================
 */
export class PerfilProfesional {
  constructor(data = {}) {
    this.nombreCompleto = data.nombreCompleto || "";
    this.tituloProfesional = data.tituloProfesional || "";
    this.tagline = data.tagline || "";
    this.descripcionBreve = data.descripcionBreve || "";
    this.profesion = data.profesion || "";
    this.edad = data.edad ?? 0;
    this.email = data.email || "";
    this.telefono = data.telefono || "";
    this.numeroCelular = data.numeroCelular || "";
    this.fotoProfesional = data.fotoProfesional || "";
    this.fotoComplementaria = data.fotoComplementaria || "";
    this.ctaPrimario = data.ctaPrimario || { texto: "Ver Proyectos", destino: "#proyectos" };
    this.ctaSecundario = data.ctaSecundario || { texto: "Contáctame", destino: "#contacto" };
    this.botonCV = data.botonCV || { texto: "Descargar CV", archivo: "public/documents/CV_Jose_Cespedes_2024.pdf" };
    this.redesSociales = data.redesSociales || [];
  }

  obtenerCTA() {
    return this.ctaPrimario.texto;
  }

  validarIntegridad() {
    return Boolean(
      this.nombreCompleto &&
      this.tituloProfesional &&
      this.tagline &&
      this.descripcionBreve &&
      this.fotoProfesional
    );
  }
}
