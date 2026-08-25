/**
 * ==========================================================================
 * SERVICIO: SEO
 * FUENTE: RNF-005 (§9.5 del pseudocódigo)
 * ==========================================================================
 */

import { SITE_CONFIG } from "../config/constants.js";

export class ServicioSEO {
  static inyectarStructuredData(perfil, bio, servicios) {
    const scriptExistente = document.getElementById("json-ld-schema");
    if (scriptExistente) scriptExistente.remove();

    const schemaData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Person",
          "@id": `${SITE_CONFIG.DOMAIN}/#person`,
          "name": perfil.nombreCompleto || SITE_CONFIG.NOMBRE,
          "jobTitle": perfil.tituloProfesional,
          "description": perfil.descripcionBreve,
          "url": SITE_CONFIG.DOMAIN,
          "image": `${SITE_CONFIG.DOMAIN}/${perfil.fotoProfesional}`,
          "sameAs": (perfil.redesSociales || []).map(r => r.urlPerfil)
        },
        {
          "@type": "ProfessionalService",
          "@id": `${SITE_CONFIG.DOMAIN}/#service`,
          "name": `${perfil.nombreCompleto} - Consultoría Profesional`,
          "provider": { "@id": `${SITE_CONFIG.DOMAIN}/#person` },
          "description": bio.biografiaProfesional,
          "url": SITE_CONFIG.DOMAIN,
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Servicios Profesionales de TI, Datos y Seguridad",
            "itemListElement": (servicios || []).map((s, idx) => ({
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "name": s.nombreServicio,
                "description": s.descripcion
              },
              "position": idx + 1
            }))
          }
        }
      ]
    };

    const script = document.createElement("script");
    script.id = "json-ld-schema";
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(schemaData, null, 2);
    document.head.appendChild(script);
  }
}
