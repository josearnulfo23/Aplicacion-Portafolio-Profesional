/**
 * ==========================================================================
 * ENTIDAD: EducacionYCertificacion
 * FUENTE: RF-008 (§3.8 del pseudocódigo)
 * ==========================================================================
 */

export class TituloAcademico {
  constructor(data = {}) {
    this.tituloAcademico = data.tituloAcademico || "";
    this.institucion = data.institucion || "";
    this.anio = data.anio || "";
    this.estado = data.estado || "Graduado";
    this.descripcion = data.descripcion || "";
  }
}

export class Certificacion {
  constructor(data = {}) {
    this.nombre = data.nombre || "";
    this.entidadCertificadora = data.entidadCertificadora || "";
    this.anio = data.anio || "";
    this.credencialUrl = data.credencialUrl || "#";
    this.badgeDigital = data.badgeDigital || "";
  }
}

export class EducacionYCertificacion {
  constructor(data = {}) {
    this.titulosAcademicos = (data.titulosAcademicos || []).map(t => new TituloAcademico(t));
    this.certificaciones = (data.certificaciones || []).map(c => new Certificacion(c));
  }
}
