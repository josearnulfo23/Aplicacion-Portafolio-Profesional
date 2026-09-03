/**
 * ==========================================================================
 * COMPONENTE: AdminPanel.js
 * Panel de Administración Integral para el Portafolio Profesional v2.0
 * Permite gestionar todos los contenidos dinámicos en SQLite vía API REST.
 * ==========================================================================
 */

import { RepositorioContenido } from "../services/RepositorioContenido.js";
import { Toast } from "./ui/Toast.js";

export class AdminPanel {
  static _token = localStorage.getItem("portafolio_admin_token") || null;
  static _user = JSON.parse(localStorage.getItem("portafolio_admin_user") || "null");
  static _activeTab = "profile";
  static _onUpdateCallback = null;

  static setUpdateCallback(cb) {
    this._onUpdateCallback = cb;
  }

  static getApiUrl(endpoint) {
    if (typeof window !== 'undefined') {
      const port = window.location.port;
      if (window.location.protocol === 'file:' || (port !== '3000' && port !== '')) {
        return `http://localhost:3000${endpoint}`;
      }
    }
    return endpoint;
  }

  static async apiFetch(endpoint, options = {}) {
    const url = this.getApiUrl(endpoint);
    try {
      return await fetch(url, options);
    } catch (err) {
      if (!url.startsWith('http://localhost:3000')) {
        return await fetch(`http://localhost:3000${endpoint}`, options);
      }
      throw err;
    }
  }

  static renderizar() {
    return `
      <!-- Botón flotante de acceso Admin -->
      <div id="admin-floating-btn-container">
        <button id="btn-toggle-admin" class="admin-float-btn" aria-label="Abrir Panel de Administración" title="Acceso Administrador">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>
          <span class="admin-btn-label">Admin</span>
        </button>
      </div>

      <!-- Modal / Drawer del Panel de Administración -->
      <div id="admin-modal" class="admin-modal-overlay" style="display: none;" role="dialog" aria-modal="true" aria-labelledby="admin-title">
        <div class="admin-modal-content">
          <div class="admin-modal-header">
            <div class="admin-header-title">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <h2 id="admin-title">Panel de Administración v2.0</h2>
            </div>
            <div class="admin-header-actions">
              ${this._token ? `<span class="admin-badge">Admin Activo: <strong>${this._user?.username || 'Admin'}</strong></span>` : ''}
              <button id="btn-close-admin" class="admin-btn-close" aria-label="Cerrar panel">&times;</button>
            </div>
          </div>

          <div class="admin-modal-body" id="admin-modal-body">
            <!-- El contenido se inyecta dinámicamente según estado de autenticación -->
          </div>
        </div>
      </div>
    `;
  }
  static renderUsersTab(users) {
    return `
      <div class="admin-panel-section">
        <div class="admin-section-header">
          <div>
            <h3>👥 Gestión de Usuarios</h3>
            <p class="admin-help-text">Administra los usuarios del sistema, sus roles y permisos.</p>
          </div>
          <button id="btn-add-user" class="admin-btn-accent">+ Agregar Usuario</button>
        </div>

        <div class="admin-cards-list">
          ${users.map((user, idx) => `
            <div class="admin-data-card" data-user-id="${user.id}">
              <div class="admin-card-header">
                <div>
                  <strong>${user.username}</strong>
                  <div class="admin-card-sub">${user.email} &bull; ${user.role} &bull; ${user.is_active ? 'Activo' : 'Inactivo'}</div>
                </div>
                <div class="admin-card-actions">
                  <button class="admin-btn-edit-user btn-small" data-id="${user.id}">✏️ Editar</button>
                  <button class="admin-btn-del-user btn-small btn-danger" data-id="${user.id}">🗑️ Borrar</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Subformulario Usuario -->
        <div id="user-form-modal" class="admin-subform-box" style="display:none;">
          <h4 id="user-form-title">Nuevo Usuario</h4>
          <form id="form-user-item" class="admin-form">
            <input type="hidden" name="userId" value="">
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Nombre de Usuario</label>
                <input type="text" name="username" class="admin-input" required>
              </div>
              <div class="admin-form-group">
                <label>Email</label>
                <input type="email" name="email" class="admin-input" required>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Rol</label>
                <select name="role" class="admin-input">
                  <option value="admin">Administrador</option>
                  <option value="editor">Editor</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>Contraseña (dejar en blanco para no cambiar)</label>
                <input type="password" name="password" class="admin-input" placeholder="••••••••">
              </div>
            </div>
            <div class="admin-form-group">
              <label>
                <input type="checkbox" name="is_active" value="1"> Usuario Activo
              </label>
            </div>
            <div class="admin-form-actions">
              <button type="submit" class="admin-btn-primary">💾 Guardar Usuario</button>
              <button type="button" class="admin-btn-secondary" id="btn-cancel-user">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }


  static vincularEventos() {
    const floatBtn = document.getElementById("btn-toggle-admin");
    const closeBtn = document.getElementById("btn-close-admin");
    const modal = document.getElementById("admin-modal");

    if (floatBtn) {
      floatBtn.addEventListener("click", () => this.abrirModal());
    }

    if (closeBtn) {
      closeBtn.addEventListener("click", () => this.cerrarModal());
    }

    if (modal) {
      modal.addEventListener("click", (e) => {
        if (e.target === modal) this.cerrarModal();
      });
    }
  }

  static abrirModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) {
      modal.style.display = "flex";
      document.body.style.overflow = "hidden";
      this.actualizarVistaModal();
    }
  }

  static cerrarModal() {
    const modal = document.getElementById("admin-modal");
    if (modal) {
      modal.style.display = "none";
      document.body.style.overflow = "auto";
    }
  }

  static async actualizarVistaModal() {
    const body = document.getElementById("admin-modal-body");
    if (!body) return;

    if (!this._token) {
      body.innerHTML = this.renderLoginForm();
      this.vincularEventosLogin();
    } else {
      body.innerHTML = `<div class="admin-loading"><div class="spinner"></div><p>Cargando datos desde SQLite...</p></div>`;
      await this.cargarYRenderDashboard();
    }
  }

  // ==========================================================================
  // FORMULARIO DE INICIO DE SESIÓN
  // ==========================================================================
  static renderLoginForm() {
    return `
      <div class="admin-login-wrapper">
        <div class="admin-login-card">
          <div class="admin-login-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#00B4D8" stroke-width="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          <h3>Acceso a Gestión de Portafolio</h3>
          <p class="admin-login-subtitle">Ingresa tus credenciales para administrar contenidos, proyectos y enlaces multimedia.</p>
          
          <div class="admin-credentials-hint">
            <strong>Credenciales iniciales por defecto:</strong><br>
            Usuario: <code>Admin</code> | Clave: <code>Admin123</code>
          </div>

          <form id="form-admin-login" class="admin-form">
            <div class="admin-form-group">
              <label for="admin-username">Usuario</label>
              <input type="text" id="admin-username" name="username" class="admin-input" placeholder="Ej. Admin" required autocomplete="username" value="Admin">
            </div>
            <div class="admin-form-group">
              <label for="admin-password">Contraseña</label>
              <input type="password" id="admin-password" name="password" class="admin-input" placeholder="••••••••" required autocomplete="current-password" value="Admin123">
            </div>
            <div id="login-error-msg" class="admin-error-banner" style="display:none;"></div>
            <button type="submit" class="admin-btn-primary" id="btn-submit-login">
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    `;
  }

  static vincularEventosLogin() {
    const form = document.getElementById("form-admin-login");
    const errorBanner = document.getElementById("login-error-msg");
    const submitBtn = document.getElementById("btn-submit-login");

    if (form) {
      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = form.username.value.trim();
        const password = form.password.value;

        if (errorBanner) errorBanner.style.display = "none";
        submitBtn.disabled = true;
        submitBtn.innerText = "Verificando...";

        try {
          const res = await AdminPanel.apiFetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
          });
          const data = await res.json();

          if (data.success && data.data.token) {
            AdminPanel._token = data.data.token;
            AdminPanel._user = data.data.user;
            localStorage.setItem("portafolio_admin_token", AdminPanel._token);
            localStorage.setItem("portafolio_admin_user", JSON.stringify(AdminPanel._user));
            Toast.mostrar("¡Bienvenido al Panel de Administración!", "success");
            AdminPanel.actualizarVistaModal();
          } else {
            if (errorBanner) {
              errorBanner.innerText = data.message || "Usuario o contraseña incorrectos.";
              errorBanner.style.display = "block";
            }
          }
        } catch (err) {
          if (errorBanner) {
            errorBanner.innerHTML = "<strong>Error de conexión con el backend:</strong><br>Por favor asegúrate de haber iniciado el servidor ejecutando <code>npm start</code> en la terminal.";
            errorBanner.style.display = "block";
          }
        } finally {
          submitBtn.disabled = false;
          submitBtn.innerText = "Iniciar Sesión";
        }
      });
    }
  }

  // ==========================================================================
  // DASHBOARD ADMINISTRATIVO COMPLETO
  // ==========================================================================
  static async cargarYRenderDashboard() {
    const body = document.getElementById("admin-modal-body");
    try {
      const res = await AdminPanel.apiFetch("/api/content/all");
      const resJson = await res.json();
      const content = resJson.data || {};

      body.innerHTML = `
        <div class="admin-dashboard-layout">
          <!-- Sidebar de navegación por secciones -->
          <aside class="admin-sidebar">
            <nav class="admin-nav-tabs">
              <button class="admin-tab-btn ${this._activeTab === 'profile' ? 'active' : ''}" data-tab="profile">
                👤 Sobre Mí & Hero
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'experience' ? 'active' : ''}" data-tab="experience">
                💼 Experiencia
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'skills' ? 'active' : ''}" data-tab="skills">
                🎯 Habilidades
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'projects' ? 'active' : ''}" data-tab="projects">
                🚀 Proyectos & Demos
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'services' ? 'active' : ''}" data-tab="services">
                🛠️ Servicios
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'education' ? 'active' : ''}" data-tab="education">
                🎓 Educación & Diplomas
              </button>
              <button class="admin-tab-btn ${this._activeTab === 'testimonials' ? 'active' : ''}" data-tab="testimonials">
                💬 Testimonios
              </button>              <button class="admin-tab-btn ${this._activeTab === 'users' ? 'active' : ''}" data-tab="users">
                👥 Usuarios
              </button>

              <button class="admin-tab-btn ${this._activeTab === 'messages' ? 'active' : ''}" data-tab="messages">
                📬 Mensajes & Redes
              </button>
            </nav>
            <div class="admin-sidebar-footer">
              <button id="btn-admin-logout" class="admin-btn-secondary admin-btn-logout">
                🚪 Cerrar Sesión
              </button>
            </div>
          </aside>

          <!-- Área de contenido del tab activo -->
          <main class="admin-tab-content" id="admin-active-tab-content">
            ${this.renderActiveTab(content)}
          </main>
        </div>
      `;

      this.vincularEventosDashboard(content);
    } catch (err) {
      body.innerHTML = `<div class="admin-error-banner">Error cargando datos: ${err.message}</div>`;
    }
  }

  static renderActiveTab(content) {
    switch (this._activeTab) {
      case "profile":
        return this.renderProfileTab(content.profile, content.about);
      case "experience":
        return this.renderExperienceTab(content.experience || []);
      case "skills":
        return this.renderSkillsTab(content.skills || []);
      case "projects":
        return this.renderProjectsTab(content.projects || []);
      case "services":
        return this.renderServicesTab(content.services || []);
      case "education":
        return this.renderEducationTab(content.education || {});
      case "testimonials":
        return this.renderTestimonialsTab(content.testimonials || []);
      case "messages":
        return this.renderMessagesTab(content.profile?.redesSociales || []);
      case "users":
        return this.renderUsersTab(content.users || []);
      default:
        return `<p>Selecciona una pestaña.</p>`;
    }
  }

  // TAB 1: SOBRE MÍ Y HERO
  static renderProfileTab(profile, about) {
    const p = profile || {};
    const ab = about || {};
    return `
      <div class="admin-panel-section">
        <h3>👤 Información Personal, Hero y Biografía</h3>
        <p class="admin-help-text">Gestiona los datos principales de presentación, foto de perfil, CV y video.</p>
        
        <form id="form-profile-tab" class="admin-form">
          <div class="admin-form-row">
            <div class="admin-form-group">
              <label>Nombre Completo</label>
              <input type="text" name="nombreCompleto" class="admin-input" value="${p.nombreCompleto || ''}" required>
            </div>
            <div class="admin-form-group">
              <label>Título Profesional</label>
              <input type="text" name="tituloProfesional" class="admin-input" value="${p.tituloProfesional || ''}" required>
            </div>
          </div>

          <div class="admin-form-group">
            <label>Tagline / Frase Destacada</label>
            <input type="text" name="tagline" class="admin-input" value="${p.tagline || ''}">
          </div>

          <div class="admin-form-group">
            <label>Descripción Breve (Hero)</label>
            <textarea name="descripcionBreve" rows="3" class="admin-input">${p.descripcionBreve || ''}</textarea>
          </div>
          <div class="admin-form-group">
            <label>Profesión</label>
            <input type="text" name="profesion" class="admin-input" value="${p.profesion || ''}" required>
          </div>
          <div class="admin-form-group">
            <label>Edad</label>
            <input type="number" name="edad" class="admin-input" value="${p.edad || ''}" min="0" max="120">
          </div>
          <div class="admin-form-group">
            <label>Email</label>
            <input type="email" name="email" class="admin-input" value="${p.email || ''}" required>
          </div>
          <div class="admin-form-group">
            <label>Teléfono</label>
            <input type="tel" name="telefono" class="admin-input" value="${p.telefono || ''}">
          </div>
          <div class="admin-form-group">
            <label>Número Celular</label>
            <input type="tel" name="numeroCelular" class="admin-input" value="${p.numeroCelular || ''}">
          </div>
          </div>

          <div class="admin-form-group">
            <label>Biografía Profesional Completa (Sobre Mí)</label>
            <textarea name="biografiaProfesional" rows="4" class="admin-input">${ab.biografiaProfesional || ''}</textarea>
          </div>

          <div class="admin-form-row">
            <div class="admin-form-group">
              <label>URL Foto de Perfil (Local o Cloud: Drive / OneDrive / Dropbox)</label>
              <input type="text" name="fotoPerfil" class="admin-input" value="${p.fotoProfesional || ''}">
            </div>
            <div class="admin-form-group">
              <label>URL Archivo CV / Hoja de Vida (PDF en la Nube)</label>
              <input type="text" name="cvArchivo" class="admin-input" value="${p.botonCV?.archivo || ''}">
            </div>
          </div>

          <div class="admin-form-actions">
            <button type="submit" class="admin-btn-primary">💾 Guardar Cambios de Perfil</button>
          </div>
        </form>
      </div>
    `;
  }

  // TAB 2: EXPERIENCIA
  static renderExperienceTab(experiences) {
    return `
      <div class="admin-panel-section">
        <div class="admin-section-header">
          <div>
            <h3>💼 Trayectoria y Experiencia Laboral</h3>
            <p class="admin-help-text">Administra los roles profesionales, responsabilidades, logros y tecnologías.</p>
          </div>
          <button id="btn-add-experience" class="admin-btn-accent">+ Agregar Experiencia</button>
        </div>

        <div class="admin-cards-list" id="exp-list-container">
          ${experiences.map((exp, idx) => `
            <div class="admin-data-card" data-exp-id="${exp.dbId || idx + 1}">
              <div class="admin-card-header">
                <div>
                  <h4>${exp.cargo}</h4>
                  <span class="admin-card-sub">${exp.empresa} &bull; ${exp.periodoInicio} - ${exp.periodoFin}</span>
                </div>
                <div class="admin-card-actions">
                  <button class="admin-btn-edit-exp btn-small" data-index="${idx}">✏️ Editar</button>
                  <button class="admin-btn-delete-exp btn-small btn-danger" data-id="${exp.dbId || idx + 1}">🗑️ Borrar</button>
                </div>
              </div>
              <p class="admin-card-desc">${exp.descripcion || ''}</p>
              <div class="admin-card-tags">
                ${(exp.tecnologias || []).map(t => `<span class="admin-tag">${t}</span>`).join('')}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Formulario Modal / En línea para crear/editar experiencia -->
        <div id="exp-form-modal" class="admin-subform-box" style="display:none;">
          <h4 id="exp-form-title">Nueva Experiencia</h4>
          <form id="form-experience-item" class="admin-form">
            <input type="hidden" name="expId" value="">
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Cargo / Rol</label>
                <input type="text" name="cargo" class="admin-input" required>
              </div>
              <div class="admin-form-group">
                <label>Empresa</label>
                <input type="text" name="empresa" class="admin-input" required>
              </div>
            </div>
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Ubicación</label>
                <input type="text" name="ubicacion" class="admin-input" value="Bogotá, Colombia">
              </div>
              <div class="admin-form-group">
                <label>Modalidad</label>
                <select name="modalidad" class="admin-input">
                  <option value="Híbrido">Híbrido</option>
                  <option value="Remoto">Remoto</option>
                  <option value="Presencial">Presencial</option>
                </select>
              </div>
              <div class="admin-form-group">
                <label>Periodo Inicio</label>
                <input type="text" name="periodoInicio" class="admin-input" placeholder="01/2023" required>
              </div>
              <div class="admin-form-group">
                <label>Periodo Fin</label>
                <input type="text" name="periodoFin" class="admin-input" placeholder="Presente">
              </div>
            </div>
            <div class="admin-form-group">
              <label>Descripción General</label>
              <textarea name="descripcion" rows="2" class="admin-input"></textarea>
            </div>
            <div class="admin-form-group">
              <label>Responsabilidades (una por línea)</label>
              <textarea name="responsabilidades" rows="3" class="admin-input"></textarea>
            </div>
            <div class="admin-form-group">
              <label>Logros Cuantificables (uno por línea)</label>
              <textarea name="logros" rows="3" class="admin-input"></textarea>
            </div>
            <div class="admin-form-group">
              <label>Tecnologías (separadas por coma)</label>
              <input type="text" name="tecnologias" class="admin-input" placeholder="Python, SQL, JavaScript">
            </div>
            <div class="admin-form-actions">
              <button type="submit" class="admin-btn-primary">💾 Guardar Experiencia</button>
              <button type="button" class="admin-btn-secondary" id="btn-cancel-exp">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // TAB 3: HABILIDADES
  static renderSkillsTab(categories) {
    return `
      <div class="admin-panel-section">
        <div class="admin-section-header">
          <div>
            <h3>🎯 Habilidades y Competencias Técnicas</h3>
            <p class="admin-help-text">Gestiona categorías, niveles de destreza y herramientas.</p>
          </div>
        </div>

        <div class="admin-skills-grid">
          ${categories.map((cat, cIdx) => `
            <div class="admin-skill-cat-card">
              <h4>${cat.nombreCategoria}</h4>
              <p class="admin-card-desc">${cat.descripcion || ''}</p>
              <div class="admin-skill-items-list">
                ${(cat.tecnologias || []).map(skill => `
                  <div class="admin-skill-item-row">
                    <span class="skill-name"><strong>${skill.nombre}</strong> (${skill.nivelDominio}%)</span>
                    <button class="btn-small btn-danger admin-btn-del-skill" data-id="${skill.id}">🗑️</button>
                  </div>
                `).join('')}
              </div>
              <button class="admin-btn-add-skill-modal btn-small" data-cat-id="${cat.dbId || cIdx + 1}">+ Agregar Habilidad</button>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 4: PROYECTOS (CON REPOSITORIOS, DEMOS, CLOUD IMAGES Y VIDEOS)
  static renderProjectsTab(projects) {
    return `
      <div class="admin-panel-section">
        <div class="admin-section-header">
          <div>
            <h3>🚀 Portafolio de Proyectos y Demos</h3>
            <p class="admin-help-text">Agrega proyectos con enlaces a repositorios (GitHub), demos, capturas en la nube (Drive/OneDrive/Dropbox) y videos (YouTube/Vimeo).</p>
          </div>
          <button id="btn-add-project" class="admin-btn-accent">+ Agregar Proyecto</button>
        </div>

        <div class="admin-cards-list" id="proj-list-container">
          ${projects.map((proj, idx) => `
            <div class="admin-data-card" data-proj-id="${proj.dbId || idx + 1}">
              <div class="admin-card-header">
                <div>
                  <h4>${proj.titulo} ${proj.destacado ? '<span class="badge-destacado">⭐ Destacado</span>' : ''}</h4>
                  <span class="admin-card-sub">${proj.categoria}</span>
                </div>
                <div class="admin-card-actions">
                  <button class="admin-btn-edit-proj btn-small" data-index="${idx}">✏️ Editar</button>
                  <button class="admin-btn-delete-proj btn-small btn-danger" data-id="${proj.dbId || idx + 1}">🗑️ Borrar</button>
                </div>
              </div>
              <p class="admin-card-desc">${proj.descripcionBreve || ''}</p>
              <div class="admin-proj-links-preview">
                ${proj.enlaceGitHub ? `<a href="${proj.enlaceGitHub}" target="_blank" class="admin-link-badge">🔗 GitHub</a>` : ''}
                ${proj.enlaceDemo ? `<a href="${proj.enlaceDemo}" target="_blank" class="admin-link-badge">🌐 Demo</a>` : ''}
                ${proj.imagenRepresentativa ? `<span class="admin-link-badge">🖼️ Imagen Cloud</span>` : ''}
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Subformulario Proyecto -->
        <div id="proj-form-modal" class="admin-subform-box" style="display:none;">
          <h4 id="proj-form-title">Nuevo Proyecto</h4>
          <form id="form-project-item" class="admin-form">
            <input type="hidden" name="projId" value="">
            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Título del Proyecto</label>
                <input type="text" name="titulo" class="admin-input" required>
              </div>
              <div class="admin-form-group">
                <label>Categoría</label>
                <select name="categoria" class="admin-input">
                  <option value="Desarrollo Web & Software">Desarrollo Web & Software</option>
                  <option value="Análisis de Datos & BI">Análisis de Datos & BI</option>
                  <option value="Seguridad & Monitoreo">Seguridad & Monitoreo</option>
                  <option value="Automatización & Cloud">Automatización & Cloud</option>
                </select>
              </div>
            </div>

            <div class="admin-form-group">
              <label>Descripción Breve</label>
              <input type="text" name="descripcionBreve" class="admin-input" required>
            </div>

            <div class="admin-form-group">
              <label>Descripción Detallada</label>
              <textarea name="descripcionDetallada" rows="3" class="admin-input"></textarea>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>Enlace Repositorio GitHub / Web de Desarrollo</label>
                <input type="url" name="enlaceGitHub" class="admin-input" placeholder="https://github.com/usuario/repo">
              </div>
              <div class="admin-form-group">
                <label>Enlace Demo en Vivo / Producción</label>
                <input type="url" name="enlaceDemo" class="admin-input" placeholder="https://mi-demo.com">
              </div>
            </div>

            <div class="admin-form-row">
              <div class="admin-form-group">
                <label>URL Imagen / Captura en la Nube (Google Drive, OneDrive, Dropbox, etc.)</label>
                <input type="text" name="imagenRepresentativa" class="admin-input" placeholder="https://...">
              </div>
              <div class="admin-form-group">
                <label>URL Video Demostrativo (YouTube, Vimeo, etc.)</label>
                <input type="url" name="videoDemo" class="admin-input" placeholder="https://youtube.com/watch?v=...">
              </div>
            </div>

            <div class="admin-form-group">
              <label>Tecnologías (separadas por coma)</label>
              <input type="text" name="tecnologias" class="admin-input" placeholder="JavaScript, Node.js, SQLite, CSS3">
            </div>

            <div class="admin-form-group">
              <label>
                <input type="checkbox" name="destacado" value="1"> Proyecto Destacado en Portada
              </label>
            </div>

            <div class="admin-form-actions">
              <button type="submit" class="admin-btn-primary">💾 Guardar Proyecto</button>
              <button type="button" class="admin-btn-secondary" id="btn-cancel-proj">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // TAB 5: SERVICIOS
  static renderServicesTab(services) {
    return `
      <div class="admin-panel-section">
        <div class="admin-section-header">
          <div>
            <h3>🛠️ Catálogo de Servicios Profesionales</h3>
            <p class="admin-help-text">Configura los servicios ofrecidos, entregables y llamadas a la acción.</p>
          </div>
          <button id="btn-add-service" class="admin-btn-accent">+ Agregar Servicio</button>
        </div>

        <div class="admin-cards-list">
          ${services.map((srv, idx) => `
            <div class="admin-data-card" data-srv-id="${srv.dbId || idx + 1}">
              <div class="admin-card-header">
                <h4>${srv.nombreServicio}</h4>
                <div class="admin-card-actions">
                  <button class="admin-btn-del-srv btn-small btn-danger" data-id="${srv.dbId || idx + 1}">🗑️ Borrar</button>
                </div>
              </div>
              <p class="admin-card-desc">${srv.descripcion}</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 6: EDUCACIÓN & CERTIFICADOS
  static renderEducationTab(education) {
    const degrees = education.titulosAcademicos || [];
    const certs = education.certificaciones || [];
    return `
      <div class="admin-panel-section">
        <h3>🎓 Formación Académica y Certificaciones</h3>
        <p class="admin-help-text">Administra tus títulos profesionales, certificaciones y enlaces a credenciales/diplomas.</p>

        <div class="admin-cards-list">
          <h4>Títulos Académicos</h4>
          ${degrees.map((d, i) => `
            <div class="admin-data-card">
              <div class="admin-card-header">
                <div>
                  <strong>${d.tituloAcademico}</strong>
                  <div class="admin-card-sub">${d.institucion} (${d.anio}) - ${d.estado}</div>
                </div>
                <button class="btn-small btn-danger admin-btn-del-degree" data-id="${d.id || i + 1}">🗑️</button>
              </div>
            </div>
          `).join('')}

          <h4 style="margin-top: 1.5rem;">Certificaciones & Badges</h4>
          ${certs.map((c, i) => `
            <div class="admin-data-card">
              <div class="admin-card-header">
                <div>
                  <strong>${c.nombre}</strong>
                  <div class="admin-card-sub">${c.entidadCertificadora} (${c.anio})</div>
                  ${c.credencialUrl ? `<a href="${c.credencialUrl}" target="_blank" class="admin-link-badge">Credencial</a>` : ''}
                </div>
                <button class="btn-small btn-danger admin-btn-del-cert" data-id="${c.id || i + 1}">🗑️</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 7: TESTIMONIOS
  static renderTestimonialsTab(testimonials) {
    return `
      <div class="admin-panel-section">
        <h3>💬 Testimonios y Recomendaciones</h3>
        <p class="admin-help-text">Gestiona los testimonios de clientes y colegas.</p>
        <div class="admin-cards-list">
          ${testimonials.map((t, i) => `
            <div class="admin-data-card">
              <div class="admin-card-header">
                <div>
                  <strong>${t.nombreRecomendador}</strong> - ${t.cargo} en ${t.empresa}
                  <div class="admin-card-sub">Valoración: ${'⭐'.repeat(t.valoracion || 5)}</div>
                </div>
                <button class="btn-small btn-danger admin-btn-del-testimonio" data-id="${t.dbId || i + 1}">🗑️ Borrar</button>
              </div>
              <p class="admin-card-desc">"${t.textoTestimonio}"</p>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // TAB 8: MENSAJES & REDES
  static renderMessagesTab(redesSociales) {
    return `
      <div class="admin-panel-section">
        <h3>📬 Buzón de Mensajes y Redes Sociales</h3>
        <p class="admin-help-text">Mensajes recibidos desde el formulario de contacto web.</p>
        <div id="admin-messages-list" class="admin-messages-container">
          <p>Cargando mensajes del buzón...</p>
        </div>
      </div>
    `;
  }

  // VINCULACIÓN DE EVENTOS DEL DASHBOARD
  static vincularEventosDashboard(content) {
    // Tabs
    const tabBtns = document.querySelectorAll(".admin-tab-btn");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        this._activeTab = btn.dataset.tab;
        tabBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        const container = document.getElementById("admin-active-tab-content");
        if (container) {
          container.innerHTML = this.renderActiveTab(content);
          this.vincularEventosTabActivo(content);
        }
      });
    });

    // Logout
    const logoutBtn = document.getElementById("btn-admin-logout");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        this._token = null;
        this._user = null;
        localStorage.removeItem("portafolio_admin_token");
        localStorage.removeItem("portafolio_admin_user");
        Toast.mostrar("Sesión cerrada correctamente", "info");
        this.actualizarVistaModal();
      });
    }

    this.vincularEventosTabActivo(content);
  }

  static vincularEventosTabActivo(content) {
    // Tab Perfil Form
    const profileForm = document.getElementById("form-profile-tab");
    if (profileForm) {
      profileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const payload = {
            nombreCompleto: profileForm.nombreCompleto.value.trim(),
            tituloProfesional: profileForm.tituloProfesional.value.trim(),
            tagline: profileForm.tagline.value.trim(),
            descripcionBreve: profileForm.descripcionBreve.value.trim(),
            profesion: profileForm.profesion.value.trim(),
            edad: parseInt(profileForm.edad.value, 10) || 0,
            email: profileForm.email.value.trim(),
            telefono: profileForm.telefono.value.trim(),
            numeroCelular: profileForm.numeroCelular.value.trim(),
            fotoPerfil: profileForm.fotoPerfil.value.trim(),
            cvArchivo: profileForm.cvArchivo.value.trim()
          };

          const res = await fetch("/api/profile", {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this._token}`
            },
            body: JSON.stringify(payload)
          });

          const data = await res.json();
          if (data.success) {
            // Guardar bio
            await fetch("/api/about", {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this._token}`
              },
              body: JSON.stringify({
                biografiaProfesional: profileForm.biografiaProfesional.value.trim()
              })
            });

            Toast.mostrar("¡Perfil actualizado con éxito!", "success");
            RepositorioContenido.invalidarCache();
            if (this._onUpdateCallback) this._onUpdateCallback();
          } else {
            Toast.mostrar(data.message || "Error al actualizar", "error");
          }
        } catch (err) {
          Toast.mostrar("Error de red: " + err.message, "error");
        }
      });
    }

    // Tab Proyectos - Toggle nuevo formulario
    const btnAddProj = document.getElementById("btn-add-project");
    const projBox = document.getElementById("proj-form-modal");
    const btnCancelProj = document.getElementById("btn-cancel-proj");
    const projForm = document.getElementById("form-project-item");

    if (btnAddProj && projBox) {
      btnAddProj.addEventListener("click", () => {
        projForm.reset();
        projForm.projId.value = "";
        document.getElementById("proj-form-title").innerText = "Nuevo Proyecto";
        projBox.style.display = "block";
        projBox.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (btnCancelProj && projBox) {
      btnCancelProj.addEventListener("click", () => {
        projBox.style.display = "none";
      });
    }

    if (projForm) {
      projForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const id = projForm.projId.value;
        const techs = projForm.tecnologias.value.split(",").map(t => t.trim()).filter(Boolean);
        const payload = {
          titulo: projForm.titulo.value.trim(),
          categoria: projForm.categoria.value,
          descripcionBreve: projForm.descripcionBreve.value.trim(),
          descripcionDetallada: projForm.descripcionDetallada.value.trim(),
          enlaceGitHub: projForm.enlaceGitHub.value.trim(),
          enlaceDemo: projForm.enlaceDemo.value.trim(),
          imagenRepresentativa: projForm.imagenRepresentativa.value.trim(),
          destacado: projForm.destacado.checked ? 1 : 0,
          tecnologias: techs
        };

        const url = id ? `/api/projects/${id}` : "/api/projects";
        const method = id ? "PUT" : "POST";

        try {
          const res = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this._token}`
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            Toast.mostrar("¡Proyecto guardado exitosamente!", "success");
            projBox.style.display = "none";
            RepositorioContenido.invalidarCache();
            if (this._onUpdateCallback) this._onUpdateCallback();
            this.cargarYRenderDashboard();
          } else {
            Toast.mostrar(data.message || "Error al guardar", "error");
          }
        } catch (err) {
          Toast.mostrar("Error: " + err.message, "error");
        }
      });
    }

    // Borrar Proyecto
    const deleteProjBtns = document.querySelectorAll(".admin-btn-delete-proj");
    deleteProjBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de eliminar este proyecto?")) {
          const id = btn.dataset.id;
          try {
            const res = await fetch(`/api/projects/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${this._token}` }
            });
            const data = await res.json();
            if (data.success) {
              Toast.mostrar("Proyecto eliminado", "info");
              RepositorioContenido.invalidarCache();
              if (this._onUpdateCallback) this._onUpdateCallback();
              this.cargarYRenderDashboard();
            }
          } catch (err) {
            Toast.mostrar("Error al eliminar", "error");
          }
        }
      });
    });

    // Cargar mensajes si está en pestaña de mensajes
    if (this._activeTab === "messages") {
      this.cargarMensajesBuzon();
    }

    // Tab Usuarios Form
    const userForm = document.getElementById("form-user-item");
    if (userForm) {
      userForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        try {
          const id = userForm.userId.value;
          const isActive = userForm.is_active.checked ? 1 : 0;
          const payload = {
            username: userForm.username.value.trim(),
            email: userForm.email.value.trim(),
            role: userForm.role.value,
            is_active: isActive
          };
          const password = userForm.password.value;
          if (password && password.trim() !== '') {
            payload.password = password;
          }

          const url = id ? `/api/users/${id}` : "/api/users";
          const method = id ? "PUT" : "POST";

          const res = await fetch(url, {
            method,
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${this._token}`
            },
            body: JSON.stringify(payload)
          });
          const data = await res.json();
          if (data.success) {
            Toast.mostrar("¡Usuario guardado exitosamente!", "success");
            // Hide the modal
            document.getElementById("user-form-modal").style.display = "none";
            RepositorioContenido.invalidarCache();
            if (this._onUpdateCallback) this._onUpdateCallback();
            this.cargarYRenderDashboard();
          } else {
            Toast.mostrar(data.message || "Error al guardar", "error");
          }
        } catch (err) {
          Toast.mostrar("Error: " + err.message, "error");
        }
      });
    }

    // Botón para mostrar el formulario de nuevo usuario
    const btnAddUser = document.getElementById("btn-add-user");
    const userBox = document.getElementById("user-form-modal");
    const btnCancelUser = document.getElementById("btn-cancel-user");
    const userFormEl = document.getElementById("form-user-item");

    if (btnAddUser && userBox) {
      btnAddUser.addEventListener("click", () => {
        userFormEl.reset();
        userFormEl.userId.value = "";
        document.getElementById("user-form-title").innerText = "Nuevo Usuario";
        userBox.style.display = "block";
        userBox.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (btnCancelUser && userBox) {
      btnCancelUser.addEventListener("click", () => {
        userBox.style.display = "none";
      });
    }

    // Borrar Usuario
    const deleteUserBtns = document.querySelectorAll(".admin-btn-del-user");
    deleteUserBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        if (confirm("¿Estás seguro de eliminar este usuario?\nEsta acción no se puede deshacer.")) {
          const id = btn.dataset.id;
          try {
            const res = await fetch(`/api/users/${id}`, {
              method: "DELETE",
              headers: { "Authorization": `Bearer ${this._token}` }
            });
            const data = await res.json();
            if (data.success) {
              Toast.mostrar("Usuario eliminado", "info");
              RepositorioContenido.invalidarCache();
              if (this._onUpdateCallback) this._onUpdateCallback();
              this.cargarYRenderDashboard();
            }
          } catch (err) {
            Toast.mostrar("Error al eliminar", "error");
          }
        }
      });
    });

    // Editar Usuario (cargar datos en el formulario)
    const editUserBtns = document.querySelectorAll(".admin-btn-edit-user");
    editUserBtns.forEach(btn => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.id;
        try {
          const res = await fetch(`/api/users/${id}`, {
            headers: { "Authorization": `Bearer ${this._token}` }
          });
          const data = await res.json();
          if (data.success && data.data) {
            const user = data.data;
            // Populate the form
            document.getElementById("user-form-title").innerText = "Editar Usuario";
            document.getElementById("form-user-item").userId.value = user.id;
            document.getElementById("form-user-item").username.value = user.username;
            document.getElementById("form-user-item").email.value = user.email;
            document.getElementById("form-user-item").role.value = user.role;
            document.getElementById("form-user-item").is_active.checked = user.is_active === 1;
            // Clear password field
            document.getElementById("form-user-item").password.value = "";
            // Show the modal
            document.getElementById("user-form-modal").style.display = "block";
            document.getElementById("user-form-modal").scrollIntoView({ behavior: "smooth" });
          } else {
            Toast.mostrar("Error al cargar usuario para edición", "error");
          }
        } catch (err) {
          Toast.mostrar("Error: " + err.message, "error");
        }
      });
    });
  }

  static async cargarMensajesBuzon() {
    const container = document.getElementById("admin-messages-list");
    if (!container) return;

    try {
      const res = await fetch("/api/contact/messages", {
        headers: { "Authorization": `Bearer ${this._token}` }
      });
      const data = await res.json();
      const messages = data.data || [];

      if (messages.length === 0) {
        container.innerHTML = `<p class="admin-empty">No hay mensajes recibidos aún.</p>`;
        return;
      }

      container.innerHTML = messages.map(m => `
        <div class="admin-message-card">
          <div class="admin-message-header">
            <strong>${m.nombre}</strong> &lt;${m.email}&gt;
            <span class="admin-date">${m.created_at || ''}</span>
          </div>
          <div class="admin-message-subject">${m.asunto || 'Sin asunto'}</div>
          <p class="admin-message-body">${m.mensaje}</p>
          ${m.telefono ? `<div class="admin-message-tel">📞 Tel: ${m.telefono}</div>` : ''}
        </div>
      `).join('');
    } catch (err) {
      container.innerHTML = `<p class="admin-error">Error cargando mensajes: ${err.message}</p>`;
    }
  }
}
