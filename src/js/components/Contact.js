/**
 * ==========================================================================
 * COMPONENTE: Contact (Sección 9 - Formulario de Contacto)
 * FUENTE: HU-006, RF-009, CU-006, RNF-006 (§6.9 del pseudocódigo)
 * ==========================================================================
 */

import { SITE_CONFIG } from "../config/constants.js";
import { MensajeContacto } from "../domain/MensajeContacto.js";
import { ConectorEmail } from "../services/ConectorEmail.js";
import { Toast } from "./ui/Toast.js";
import { ServicioAnalitica } from "../services/ServicioAnalitica.js";

export class Contact {
  static renderizar() {
    return `
      <section id="contacto" class="contact-section" aria-labelledby="contact-title">
        <div class="container">
          <div class="section-header reveal-on-scroll">
            <span class="section-tag">Canal Directo</span>
            <h2 id="contact-title">Iniciar <span class="gradient-text">Contacto</span></h2>
            <p class="section-subtitle">¿Tienes un proyecto en mente o buscas un perfil especializado para tu equipo? Conversemos.</p>
          </div>

          <div class="contact-grid">
            <!-- Información de Contacto Directo (HU-006) -->
            <div class="card contact-info-card reveal-on-scroll">
              <h3 style="font-size:var(--fs-xl); color:var(--text-primary); margin-bottom:var(--spacing-sm);">
                Canales de Comunicación
              </h3>
              <p style="color:var(--text-muted); font-size:var(--fs-sm);">
                Disponible para oportunidades de empleo corporativo, consultoría técnica y colaboraciones estratégicas.
              </p>

              <div class="contact-channel">
                <div class="channel-icon">
                  <img src="public/images/icons/email.svg" alt="Email" width="22" height="22">
                </div>
                <div>
                  <div class="channel-label">Correo Electrónico</div>
                  <a href="mailto:${SITE_CONFIG.EMAIL}" class="channel-value">${SITE_CONFIG.EMAIL}</a>
                </div>
              </div>

              <div class="contact-channel">
                <div class="channel-icon">
                  <img src="public/images/icons/phone.svg" alt="Teléfono" width="22" height="22">
                </div>
                <div>
                  <div class="channel-label">Teléfono / WhatsApp</div>
                  <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer" class="channel-value">${SITE_CONFIG.TELEFONO}</a>
                </div>
              </div>

              <div class="contact-channel">
                <div class="channel-icon">
                  <img src="public/images/icons/location.svg" alt="Ubicación" width="22" height="22">
                </div>
                <div>
                  <div class="channel-label">Ubicación y Disponibilidad</div>
                  <div class="channel-value">${SITE_CONFIG.UBICACION} (Remoto / Presencial)</div>
                </div>
              </div>

              <div class="contact-channel">
                <div class="channel-icon">
                  <img src="public/images/icons/linkedin.svg" alt="LinkedIn" width="22" height="22">
                </div>
                <div>
                  <div class="channel-label">Red Profesional</div>
                  <a href="https://linkedin.com/in/jose-arnulfo-cespedes" target="_blank" rel="noopener noreferrer" class="channel-value">linkedin.com/in/jose-arnulfo-cespedes</a>
                </div>
              </div>
            </div>

            <!-- Formulario de Contacto (RF-009) -->
            <div class="card reveal-on-scroll stagger-2">
              <form id="contact-form" class="contact-form" novalidate aria-label="Formulario de contacto profesional">
                <input type="hidden" name="csrf_token" id="csrf_token" value="${ConectorEmail.generarTokenCSRF()}">

                <div class="form-group">
                  <label for="form-nombre" class="form-label">Nombre Completo *</label>
                  <input type="text" id="form-nombre" name="nombre" class="form-input" placeholder="Ej. Carlos Mendoza" required autocomplete="name">
                  <span class="form-error-msg" id="error-nombre"></span>
                </div>

                <div class="form-group">
                  <label for="form-email" class="form-label">Correo Electrónico *</label>
                  <input type="email" id="form-email" name="email" class="form-input" placeholder="carlos@empresa.com" required autocomplete="email">
                  <span class="form-error-msg" id="error-email"></span>
                </div>

                <div class="form-group">
                  <label for="form-asunto" class="form-label">Asunto / Oportunidad *</label>
                  <input type="text" id="form-asunto" name="asunto" class="form-input" placeholder="Ej. Consultoría en Analítica de Datos" required>
                  <span class="form-error-msg" id="error-asunto"></span>
                </div>

                <div class="form-group">
                  <label for="form-mensaje" class="form-label">Mensaje o Consulta Detallada *</label>
                  <textarea id="form-mensaje" name="mensaje" class="form-textarea" placeholder="Describe brevemente tus requerimientos o la oportunidad..." required></textarea>
                  <span class="form-error-msg" id="error-mensaje"></span>
                </div>

                <button type="submit" id="btn-submit-contact" class="btn btn-primary btn-lg" style="width:100%;">
                  <span id="btn-text">Enviar Mensaje Ahora ▹</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    `;
  }

  static vincularEventos() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    const btnSubmit = document.getElementById("btn-submit-contact");
    const btnText = document.getElementById("btn-text");

    const limpiarErrores = () => {
      document.querySelectorAll(".form-error-msg").forEach(el => {
        el.textContent = "";
        el.classList.remove("visible");
      });
      document.querySelectorAll(".form-input, .form-textarea").forEach(el => {
        el.classList.remove("is-invalid");
      });
    };

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      limpiarErrores();

      const formData = {
        nombre: form.nombre.value,
        email: form.email.value,
        asunto: form.asunto.value,
        mensaje: form.mensaje.value,
        tokenCSRF: form.csrf_token.value
      };

      const mensajeObj = new MensajeContacto(formData);

      // Validación en cliente
      const errores = mensajeObj.validar();
      if (errores.length > 0) {
        errores.forEach(err => {
          const inputEl = document.getElementById(`form-${err.campo}`);
          const errorEl = document.getElementById(`error-${err.campo}`);
          if (inputEl) inputEl.classList.add("is-invalid");
          if (errorEl) {
            errorEl.textContent = err.mensaje;
            errorEl.classList.add("visible");
          }
        });
        Toast.error("Por favor completa los campos requeridos correctamente.");
        return;
      }

      // Estado de carga (Loading State)
      btnSubmit.disabled = true;
      btnText.innerHTML = `<span class="spinner"></span> Enviando mensaje...`;

      try {
        const resultado = await ConectorEmail.enviarMensaje(mensajeObj);

        if (resultado.exito) {
          Toast.exito(resultado.mensaje);
          form.reset();
          ServicioAnalitica.registrarEnvioFormulario();
        } else {
          Toast.error(resultado.mensaje);
        }
      } catch (err) {
        Toast.error("Error al procesar la solicitud. Intenta nuevamente.");
      } finally {
        btnSubmit.disabled = false;
        btnText.textContent = "Enviar Mensaje Ahora ▹";
      }
    });
  }
}
