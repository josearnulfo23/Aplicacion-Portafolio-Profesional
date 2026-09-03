-- ============================================================================
-- SCHEMA BASE DE DATOS — Portafolio Profesional v2.0
-- Base: SQLite 3
-- Autor: José Arnulfo Céspedes Albornoz
-- Descripción: Esquema completo con tablas, relaciones, vistas, triggers
-- Migración: desde archivos JSON estáticos a datos dinámicos en SQLite
-- ============================================================================

-- Seguridad: deshabilitar foreign keys al inicio (se activan después)
PRAGMA foreign_keys = OFF;

-- ============================================================================
-- 1. TABLA USERS (administradores de la landing page)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    username        TEXT    NOT NULL UNIQUE,
    email           TEXT    NOT NULL UNIQUE,
    password_hash   TEXT    NOT NULL,
    role            TEXT    NOT NULL DEFAULT 'admin',
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- ============================================================================
-- 2. TABLA PERFILES (información personal del portafolio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS profiles (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_completo     TEXT    NOT NULL,
    titulo_profesional  TEXT    NOT NULL,
    tagline             TEXT    NOT NULL,
    descripcion_breve   TEXT    NOT NULL,
    foto_perfil         TEXT    NOT NULL DEFAULT 'public/images/profile/hero-photo.svg',
    foto_complementaria TEXT,
    cta_primario_texto  TEXT    NOT NULL DEFAULT 'Ver Proyectos',
    cta_primario_destino TEXT   NOT NULL DEFAULT '#proyectos',
    cta_secundario_texto TEXT   NOT NULL DEFAULT 'Contáctame',
    cta_secundario_destino TEXT NOT NULL DEFAULT '#contacto',
    cv_archivo          TEXT,
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_profiles_updated ON profiles(updated_at);

-- ============================================================================
-- 3. TABLA REDES SOCIALES
-- ============================================================================
CREATE TABLE IF NOT EXISTS social_networks (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id       INTEGER NOT NULL,
    nombre_red      TEXT    NOT NULL,
    url_perfil      TEXT    NOT NULL,
    icono           TEXT    NOT NULL DEFAULT 'public/images/icons/linkedin.svg',
    etiqueta        TEXT,
    orden           INTEGER NOT NULL DEFAULT 0,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (perfil_id) REFERENCES profiles(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_social_perfil ON social_networks(perfil_id);

-- ============================================================================
-- 4. TABLA BIOGRAFÍA / SOBRE MÍ
-- ============================================================================
CREATE TABLE IF NOT EXISTS bios (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id           INTEGER NOT NULL,
    biografia_profesional TEXT  NOT NULL,
    imagen_complementaria TEXT,
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (perfil_id) REFERENCES profiles(id) ON DELETE CASCADE
);

-- ============================================================================
-- 5. TABLA PÁRAFOS BIOGRÁFICOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS bio_paragraphs (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    bio_id      INTEGER NOT NULL,
    contenido   TEXT    NOT NULL,
    orden       INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (bio_id) REFERENCES bios(id) ON DELETE CASCADE
);

-- ============================================================================
-- 6. TABLA ÁREAS DE ESPECIALIZACIÓN
-- ============================================================================
CREATE TABLE IF NOT EXISTS specializations (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bio_id          INTEGER NOT NULL,
    titulo          TEXT    NOT NULL,
    descripcion     TEXT    NOT NULL,
    icono           TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (bio_id) REFERENCES bios(id) ON DELETE CASCADE
);

-- ============================================================================
-- 7. TABLA VALORES PROFESIONALES
-- ============================================================================
CREATE TABLE IF NOT EXISTS professional_values (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bio_id          INTEGER NOT NULL,
    valor           TEXT    NOT NULL,
    descripcion     TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (bio_id) REFERENCES bios(id) ON DELETE CASCADE
);

-- ============================================================================
-- 8. TABLA ESTADÍSTICAS CLAVE
-- ============================================================================
CREATE TABLE IF NOT EXISTS key_statistics (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    bio_id          INTEGER NOT NULL,
    cifra           TEXT    NOT NULL,
    etiqueta        TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (bio_id) REFERENCES bios(id) ON DELETE CASCADE
);

-- ============================================================================
-- 9. TABLA EXPERIENCIAS LABORALES
-- ============================================================================
CREATE TABLE IF NOT EXISTS experiences (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    cargo           TEXT    NOT NULL,
    empresa         TEXT    NOT NULL,
    ubicacion       TEXT    NOT NULL,
    modalidad       TEXT    NOT NULL DEFAULT 'Remoto',
    periodo_inicio  TEXT    NOT NULL,
    periodo_fin     TEXT    NOT NULL DEFAULT 'Presente',
    esta_vigente    INTEGER NOT NULL DEFAULT 1,
    descripcion     TEXT    NOT NULL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 10. TABLA RESPONSABILIDADES
-- ============================================================================
CREATE TABLE IF NOT EXISTS responsibilities (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id   INTEGER NOT NULL,
    contenido       TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

-- ============================================================================
-- 11. TABLA LOGROS CUANTIFICABLES
-- ============================================================================
CREATE TABLE IF NOT EXISTS achievements (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id   INTEGER NOT NULL,
    contenido       TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

-- ============================================================================
-- 12. TABLA TECNOLOGÍAS DE EXPERIENCIA
-- ============================================================================
CREATE TABLE IF NOT EXISTS experience_techs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    experience_id   INTEGER NOT NULL,
    tecnologia      TEXT    NOT NULL,
    FOREIGN KEY (experience_id) REFERENCES experiences(id) ON DELETE CASCADE
);

-- ============================================================================
-- 13. TABLA CATEGORÍAS DE HABILIDADES
-- ============================================================================
CREATE TABLE IF NOT EXISTS skill_categories (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_categoria TEXT   NOT NULL,
    descripcion     TEXT    NOT NULL,
    icono           TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0
);

-- ============================================================================
-- 14. TABLA HABILIDADES TÉCNICAS
-- ============================================================================
CREATE TABLE IF NOT EXISTS skills (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    categoria_id        INTEGER NOT NULL,
    nombre              TEXT    NOT NULL,
    icono               TEXT    NOT NULL,
    nivel_dominio       INTEGER NOT NULL DEFAULT 0,
    anios_experiencia   INTEGER NOT NULL DEFAULT 0,
    certificaciones     TEXT,
    FOREIGN KEY (categoria_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_skills_categoria ON skills(categoria_id);

-- ============================================================================
-- 15. TABLA PROYECTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo              TEXT    NOT NULL,
    subtitulo           TEXT,
    categoria           TEXT    NOT NULL,
    descripcion_breve   TEXT    NOT NULL,
    descripcion_detallada TEXT NOT NULL,
    imagen_representativa TEXT NOT NULL DEFAULT 'public/images/projects/project-01.svg',
    enlace_demo         TEXT,
    enlace_github       TEXT,
    destacado           INTEGER NOT NULL DEFAULT 0,
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_projects_destacado ON projects(destacado);
CREATE INDEX IF NOT EXISTS idx_projects_categoria ON projects(categoria);

-- ============================================================================
-- 16. TABLA TECNOLOGÍAS DE PROYECTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_techs (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    tecnologia      TEXT    NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- 17. TABLA RESULTADOS DE PROYECTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_results (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    contenido       TEXT    NOT NULL,
    orden           INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- 18. TABLA MÉTRICAS DE IMPACTO DE PROYECTOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_metrics (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id      INTEGER NOT NULL,
    indicador       TEXT    NOT NULL,
    valor           TEXT    NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- ============================================================================
-- 19. TABLA SERVICIOS PROFESIONALES
-- ============================================================================
CREATE TABLE IF NOT EXISTS services (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_servicio TEXT    NOT NULL,
    categoria       TEXT    NOT NULL,
    descripcion     TEXT    NOT NULL,
    icono           TEXT    NOT NULL,
    entregables     TEXT    NOT NULL,
    cta_texto       TEXT    NOT NULL,
    cta_destino     TEXT    NOT NULL DEFAULT '#contacto',
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 20. TABLA TÍTULOS ACADÉMICOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS academic_degrees (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    titulo_academico TEXT   NOT NULL,
    institucion     TEXT    NOT NULL,
    anio            TEXT    NOT NULL,
    estado          TEXT    NOT NULL DEFAULT 'Graduado',
    descripcion     TEXT    NOT NULL,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 21. TABLA CERTIFICACIONES
-- ============================================================================
CREATE TABLE IF NOT EXISTS certifications (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    entidad_certificadora TEXT NOT NULL,
    anio            TEXT    NOT NULL,
    credencial_url  TEXT,
    badge_digital   TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 22. TABLA TESTIMONIOS
-- ============================================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id                  INTEGER PRIMARY KEY AUTOINCREMENT,
    texto_testimonio    TEXT    NOT NULL,
    nombre_recomendador TEXT    NOT NULL,
    cargo               TEXT    NOT NULL,
    empresa             TEXT    NOT NULL,
    foto                TEXT    NOT NULL DEFAULT 'public/images/profile/testimonial-1.svg',
    valoracion          INTEGER NOT NULL DEFAULT 5,
    relacion_profesional TEXT NOT NULL,
    created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_at          TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by          INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 23. TABLA CONTACTO / FORMULARIO DE CONTACTO
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre          TEXT    NOT NULL,
    email           TEXT    NOT NULL,
    telefono        TEXT,
    mensaje         TEXT    NOT NULL,
    asunto          TEXT,
    respondido      INTEGER NOT NULL DEFAULT 0,
    respondido_texto TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- 24. TABLA ALMACENAMIENTO EXTERNO (OneDrive, Google Drive, Dropbox)
-- ============================================================================
CREATE TABLE IF NOT EXISTS external_storage (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id       INTEGER,
    proveedor       TEXT    NOT NULL CHECK (proveedor IN ('onedrive', 'google_drive', 'dropbox', 'custom')),
    tipo_archivo    TEXT    NOT NULL CHECK (tipo_archivo IN ('foto_perfil', 'documento', 'proyecto_imagen', 'diploma', 'captura')),
    nombre_archivo  TEXT,
    url_original    TEXT    NOT NULL,
    url_encurtido   TEXT,
    thumbnails_url  TEXT,
    size_bytes      INTEGER,
    mime_type       TEXT,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (perfil_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_storage_perfil ON external_storage(perfil_id);
CREATE INDEX IF NOT EXISTS idx_storage_proveedor ON external_storage(proveedor);

-- ============================================================================
-- 25. TABLA VÍDEOS (YouTube, Vimeo, etc.)
-- ============================================================================
CREATE TABLE IF NOT EXISTS videos (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    perfil_id       INTEGER,
    plataforma      TEXT    NOT NULL CHECK (plataforma IN ('youtube', 'vimeo', 'twitch', 'custom')),
    url_original    TEXT    NOT NULL,
    video_id        TEXT,
    titulo          TEXT,
    descripcion     TEXT,
    thumbnail_url   TEXT,
    duracion_seg    INTEGER,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    FOREIGN KEY (perfil_id) REFERENCES profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_videos_perfil ON videos(perfil_id);

-- ============================================================================
-- 26. TABLA CONFIGURACIÓN DEL TEMA
-- ============================================================================
CREATE TABLE IF NOT EXISTS theme_config (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    tema_activo     TEXT    NOT NULL DEFAULT 'dark',
    colores_primarios TEXT,
    colores_accent  TEXT,
    fuente_heading  TEXT    DEFAULT 'Outfit',
    fuente_body     TEXT    DEFAULT 'Inter',
    border_radius   TEXT    DEFAULT '12px',
    updated_at      TEXT    NOT NULL DEFAULT (datetime('now')),
    updated_by      INTEGER REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================================================
-- 27. TABLA LOG DE CAMBIOS (control de versiones)
-- ============================================================================
CREATE TABLE IF NOT EXISTS change_log (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    tabla_afectada  TEXT    NOT NULL,
    registro_id     INTEGER,
    accion          TEXT    NOT NULL CHECK (accion IN ('INSERT', 'UPDATE', 'DELETE')),
    datos_anteriores TEXT,
    datos_nuevos    TEXT,
    usuario_id      INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address      TEXT,
    created_at      TEXT    NOT NULL DEFAULT (datetime('now'))
);

-- ============================================================================
-- VISTAS (Views)
-- ============================================================================

-- Vista: perfil_completo (unión de perfil + redes sociales)
CREATE VIEW IF NOT EXISTS vw_profile_complete AS
SELECT
    p.*,
    (SELECT COUNT(*) FROM social_networks WHERE perfil_id = p.id AND is_active = 1) as total_redes
FROM profiles p;

-- Vista: experiencia_con_logros (unión de experiencia + responsables + logros + tecnologías)
CREATE VIEW IF NOT EXISTS vw_experience_full AS
SELECT
    e.*,
    (SELECT GROUP_CONCAT(r.contenido, ' | ') FROM responsibilities r WHERE r.experience_id = e.id) as responsabilidades_texto,
    (SELECT GROUP_CONCAT(a.contenido, ' | ') FROM achievements a WHERE a.experience_id = e.id) as logros_texto,
    (SELECT GROUP_CONCAT(et.tecnologia, ', ') FROM experience_techs et WHERE et.experience_id = e.id) as tecnologias_texto,
    (SELECT COUNT(*) FROM responsibilities WHERE experience_id = e.id) as total_responsabilidades,
    (SELECT COUNT(*) FROM achievements WHERE experience_id = e.id) as total_logros
FROM experiences e;

-- Vista: proyectos_completos (proyectos con techs, resultados y métricas)
CREATE VIEW IF NOT EXISTS vw_projects_full AS
SELECT
    pr.*,
    (SELECT GROUP_CONCAT(pt.tecnologia, ', ') FROM project_techs pt WHERE pt.project_id = pr.id) as tecnologias_texto,
    (SELECT GROUP_CONCAT(prr.contenido, ' | ') FROM project_results prr WHERE prr.project_id = pr.id) as resultados_texto,
    (SELECT GROUP_CONCAT(pm.indicador || ': ' || pm.valor, ' | ') FROM project_metrics pm WHERE pm.project_id = pr.id) as metricas_texto,
    (SELECT COUNT(*) FROM project_results WHERE project_id = pr.id) as total_resultados,
    (SELECT COUNT(*) FROM project_metrics WHERE project_id = pr.id) as total_metricas
FROM projects pr;

-- Vista: habilidades_categorizadas
CREATE VIEW IF NOT EXISTS vw_skills_full AS
SELECT
    sc.*,
    s.id as skill_id,
    s.nombre as skill_nombre,
    s.icono as skill_icono,
    s.nivel_dominio,
    s.anios_experiencia,
    s.certificaciones,
    (SELECT COUNT(*) FROM skills WHERE categoria_id = sc.id) as total_habilidades
FROM skill_categories sc
LEFT JOIN skills s ON s.categoria_id = sc.id;

-- Vista: servicios_listos
CREATE VIEW IF NOT EXISTS vw_services_list AS
SELECT
    s.*,
    (SELECT COUNT(*) FROM services) as total_servicios
FROM services s;

-- Vista: bios_completas (sobre mí)
CREATE VIEW IF NOT EXISTS vw_bio_complete AS
SELECT
    b.*,
    (SELECT GROUP_CONCAT(bp.contenido, ' ||| ') FROM bio_paragraphs bp WHERE bp.bio_id = b.id) as parrafos_texto,
    (SELECT GROUP_CONCAT(sp.titulo || ' - ' || sp.descripcion, ' ||| ') FROM specializations sp WHERE sp.bio_id = b.id) as especializaciones_texto,
    (SELECT GROUP_CONCAT(pv.valor || ': ' || pv.descripcion, ' ||| ') FROM professional_values pv WHERE pv.bio_id = b.id) as valores_texto,
    (SELECT GROUP_CONCAT(ks.cifra || ' - ' || ks.etiqueta, ' ||| ') FROM key_statistics ks WHERE ks.bio_id = b.id) as estadisticas_texto
FROM bios b;

-- Vista: testimonios_listos
CREATE VIEW IF NOT EXISTS vw_testimonials_list AS
SELECT
    t.*,
    (SELECT COUNT(*) FROM testimonials) as total_testimonios
FROM testimonials t;

-- Vista: estadísticas_admin (resumen general para dashboard)
CREATE VIEW IF NOT EXISTS vw_admin_stats AS
SELECT
    (SELECT COUNT(*) FROM users) as total_usuarios,
    (SELECT COUNT(*) FROM profiles) as total_perfiles,
    (SELECT COUNT(*) FROM experiences) as total_experiencias,
    (SELECT COUNT(*) FROM skills) as total_habilidades,
    (SELECT COUNT(*) FROM projects) as total_proyectos,
    (SELECT COUNT(*) FROM services) as total_servicios,
    (SELECT COUNT(*) FROM academic_degrees) as total_titulos,
    (SELECT COUNT(*) FROM certifications) as total_certificaciones,
    (SELECT COUNT(*) FROM testimonials) as total_testimonios,
    (SELECT COUNT(*) FROM contacts WHERE respondido = 0) as mensajes_sin_respuesta,
    (SELECT COUNT(*) FROM external_storage WHERE is_active = 1) as archivos_externos_activos,
    (SELECT COUNT(*) FROM videos WHERE is_active = 1) as videos_activos,
    (SELECT GROUP_CONCAT(t.tema_activo) FROM theme_config t) as tema_actual;

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger: actualizar updated_at en cada UPDATE
CREATE TRIGGER IF NOT EXISTS trg_update_timestamp
AFTER UPDATE ON profiles
BEGIN
    UPDATE profiles SET updated_at = datetime('now', 'localtime') WHERE id = OLD.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_services_timestamp
AFTER UPDATE ON services
BEGIN
    UPDATE services SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_projects_timestamp
AFTER UPDATE ON projects
BEGIN
    UPDATE projects SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_academic_timestamp
AFTER UPDATE ON academic_degrees
BEGIN
    UPDATE academic_degrees SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_certifications_timestamp
AFTER UPDATE ON certifications
BEGIN
    UPDATE certifications SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

CREATE TRIGGER IF NOT EXISTS trg_update_testimonials_timestamp
AFTER UPDATE ON testimonials
BEGIN
    UPDATE testimonials SET updated_at = datetime('now', 'localtime') WHERE id = NEW.id;
END;

-- Trigger: log de cambios para perfiles (simplificado)
CREATE TRIGGER IF NOT EXISTS trg_profile_change_log
AFTER INSERT ON profiles
BEGIN
    INSERT INTO change_log (tabla_afectada, registro_id, accion, datos_nuevos, created_at)
    VALUES ('profiles', NEW.id, 'INSERT', 'Perfil creado', datetime('now'));
END;

CREATE TRIGGER IF NOT EXISTS trg_profile_update_log
AFTER UPDATE ON profiles
BEGIN
    INSERT INTO change_log (tabla_afectada, registro_id, accion, datos_anteriores, datos_nuevos, created_at)
    VALUES ('profiles', NEW.id, 'UPDATE', 'Perfil actualizado', 'Perfil actualizado', datetime('now'));
END;


-- Trigger: log de cambios para perfiles (eliminación)
CREATE TRIGGER IF NOT EXISTS trg_profile_delete_log
AFTER DELETE ON profiles
BEGIN
    INSERT INTO change_log (tabla_afectada, registro_id, accion, datos_anteriores, created_at)
    VALUES ('profiles', OLD.id, 'DELETE', 'Perfil eliminado', datetime('now'));
END;

-- Trigger: validación básica de perfil
-- El perfil se inicializa y gestiona a través de init-db.js y API REST

-- ============================================================================
-- DATOS POR DEFECTO
-- ============================================================================

-- Usuario admin por defecto (contraseña: Admin123, hash bcrypt)
-- Se insertará desde init-db.js con hash bcrypt de 'Admin123'

-- Tema por defecto
INSERT INTO theme_config (tema_activo) VALUES ('dark');

-- Reactivar foreign keys
PRAGMA foreign_keys = ON;