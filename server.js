// ============================================================================
// SERVIDOR BACKEND EXPRESS + BETTER-SQLITE3 — PORTAFOLIO PROFESIONAL v2.0
// Autor: José Arnulfo Céspedes Albornoz
// Versión: v2.0
// ============================================================================

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Database from 'better-sqlite3';
import { existsSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE_DIR = __dirname;
const DB_PATH = join(BASE_DIR, 'data', 'portafolio.db');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'portafolio_pro_jwt_secret_key_v2_jose_cespedes';
const JWT_EXPIRES_IN = '24h';

const app = express();

// Middlewares globales
app.use(cors());
app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Servir estáticos
app.use(express.static(BASE_DIR));
app.use('/public', express.static(join(BASE_DIR, 'public')));
app.use('/src', express.static(join(BASE_DIR, 'src')));
app.use('/data', express.static(join(BASE_DIR, 'data')));

let db = null;

// ============================================================================
// INICIALIZACIÓN DE LA BASE DE DATOS
// ============================================================================
function initializeDatabase() {
    try {
        db = new Database(DB_PATH);
        db.pragma('journal_mode = WAL');
        db.pragma('foreign_keys = ON');
        db.pragma('synchronous = NORMAL');
        console.log('✅ Base de datos SQLite (better-sqlite3) conectada:', DB_PATH);
        return true;
    } catch (error) {
        console.error('❌ Error conectando a la base de datos:', error.message);
        return false;
    }
}

// ============================================================================
// MIDDLEWARES DE SEGURIDAD Y AUTORIZACIÓN
// ============================================================================
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Token de autorización requerido.'
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido o expirado.'
            });
        }
        req.user = user;
        next();
    });
}

function authorizeAdmin(req, res, next) {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado: se requieren privilegios de administrador.'
        });
    }
}

// ============================================================================
// 1. AUTENTICACIÓN
// ============================================================================
app.post('/api/auth/login', (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña requeridos.'
            });
        }

        const user = db.prepare('SELECT * FROM users WHERE username = ? AND is_active = 1').get(username);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.'
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password_hash);
        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: 'Credenciales inválidas.'
            });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        db.prepare("UPDATE users SET updated_at = datetime('now') WHERE id = ?").run(user.id);

        res.json({
            success: true,
            data: {
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error('Error en /api/auth/login:', error);
        res.status(500).json({ success: false, message: 'Error interno en autenticación.' });
    }
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
    res.json({
        success: true,
        data: { user: req.user }
    });
});

// ============================================================================
// 2. ENDPOINT UNIFICADO PARA LA LANDING PAGE: /api/content/all
// ============================================================================
app.get('/api/content/all', (req, res) => {
    try {
        // 1. Perfil y redes
        const profile = db.prepare('SELECT * FROM profiles WHERE id = 1').get();
        const redesSociales = db.prepare('SELECT * FROM social_networks WHERE perfil_id = 1 AND is_active = 1 ORDER BY orden ASC').all();

        const perfilData = profile ? {
            nombreCompleto: profile.nombre_completo,
            tituloProfesional: profile.titulo_profesional,
            tagline: profile.tagline,
            descripcionBreve: profile.descripcion_breve,
            profesion: profile.profesion,
            edad: profile.edad,
            email: profile.email,
            telefono: profile.telefono,
            numeroCelular: profile.numeroCelular,
            fotoProfesional: profile.foto_perfil,
            fotoComplementaria: profile.foto_complementaria,
            ctaPrimario: { texto: profile.cta_primario_texto, destino: profile.cta_primario_destino },
            ctaSecundario: { texto: profile.cta_secundario_texto, destino: profile.cta_secundario_destino },
            botonCV: { texto: 'Descargar CV', archivo: profile.cv_archivo },
            redesSociales: redesSociales.map(r => ({
                id: r.id,
                nombreRed: r.nombre_red,
                urlPerfil: r.url_perfil,
                icono: r.icono,
                etiqueta: r.etiqueta
            }))
        } : null;

        // 2. Sobre mí / Biografía
        const bio = db.prepare('SELECT * FROM bios WHERE id = 1').get();
        const parrafos = db.prepare('SELECT contenido FROM bio_paragraphs WHERE bio_id = 1 ORDER BY orden ASC').all();
        const areasEspecializacion = db.prepare('SELECT titulo, descripcion, icono FROM specializations WHERE bio_id = 1 ORDER BY orden ASC').all();
        const valoresProfesionales = db.prepare('SELECT valor, descripcion FROM professional_values WHERE bio_id = 1 ORDER BY orden ASC').all();
        const estadisticasClave = db.prepare('SELECT cifra, etiqueta FROM key_statistics WHERE bio_id = 1 ORDER BY orden ASC').all();

        const aboutData = bio ? {
            biografiaProfesional: bio.biografia_profesional,
            imagenComplementaria: bio.imagen_complementaria,
            parrafos: parrafos.map(p => p.contenido),
            areasEspecializacion,
            valoresProfesionales,
            estadisticasClave
        } : null;

        // 3. Experiencias
        const experiencesRows = db.prepare(`
            SELECT * FROM experiences 
            ORDER BY CASE WHEN esta_vigente = 1 THEN 0 ELSE 1 END, periodo_inicio DESC
        `).all();

        const experiencesData = [];
        for (const exp of experiencesRows) {
            const responsabilidades = db.prepare('SELECT contenido FROM responsibilities WHERE experience_id = ? ORDER BY orden ASC').all(exp.id).map(r => r.contenido);
            const logros = db.prepare('SELECT contenido FROM achievements WHERE experience_id = ? ORDER BY orden ASC').all(exp.id).map(a => a.contenido);
            const tecnologias = db.prepare('SELECT tecnologia FROM experience_techs WHERE experience_id = ?').all(exp.id).map(t => t.tecnologia);

            experiencesData.push({
                id: `exp-${exp.id}`,
                dbId: exp.id,
                cargo: exp.cargo,
                empresa: exp.empresa,
                ubicacion: exp.ubicacion,
                modalidad: exp.modalidad,
                periodoInicio: exp.periodo_inicio,
                periodoFin: exp.periodo_fin,
                estaVigente: Boolean(exp.esta_vigente),
                descripcion: exp.descripcion,
                responsabilidades,
                logrosCuantificables: logros,
                tecnologias
            });
        }

        // 4. Habilidades
        const categoriesRows = db.prepare('SELECT * FROM skill_categories ORDER BY orden ASC').all();
        const skillsData = [];
        for (const cat of categoriesRows) {
            const skillsList = db.prepare('SELECT * FROM skills WHERE categoria_id = ?').all(cat.id);
            skillsData.push({
                id: `cat-${cat.id}`,
                dbId: cat.id,
                nombreCategoria: cat.nombre_categoria,
                descripcion: cat.descripcion,
                icono: cat.icono,
                tecnologias: skillsList.map(s => ({
                    id: s.id,
                    nombre: s.nombre,
                    icono: s.icono,
                    nivelDominio: s.nivel_dominio,
                    aniosExperiencia: s.anios_experiencia,
                    certificacionesAsociadas: s.certificaciones ? JSON.parse(s.certificaciones) : []
                }))
            });
        }

        // 5. Proyectos
        const projectsRows = db.prepare('SELECT * FROM projects ORDER BY destacado DESC, id ASC').all();
        const projectsData = [];
        for (const proj of projectsRows) {
            const techs = db.prepare('SELECT tecnologia FROM project_techs WHERE project_id = ?').all(proj.id).map(t => t.tecnologia);
            const results = db.prepare('SELECT contenido FROM project_results WHERE project_id = ? ORDER BY orden ASC').all(proj.id).map(r => r.contenido);
            const metrics = db.prepare('SELECT indicador, valor FROM project_metrics WHERE project_id = ?').all(proj.id);

            projectsData.push({
                id: `proj-${proj.id}`,
                dbId: proj.id,
                titulo: proj.titulo,
                subtitulo: proj.subtitulo,
                categoria: proj.categoria,
                descripcionBreve: proj.descripcion_breve,
                descripcionDetallada: proj.descripcion_detallada,
                imagenRepresentativa: proj.imagen_representativa,
                enlaceDemo: proj.enlace_demo,
                enlaceGitHub: proj.enlace_github,
                destacado: Boolean(proj.destacado),
                tecnologiasUtilizadas: techs,
                resultadosObtenidos: results,
                metricasImpacto: metrics
            });
        }

        // 6. Servicios
        const servicesRows = db.prepare('SELECT * FROM services ORDER BY id ASC').all();
        const servicesData = servicesRows.map(s => ({
            id: `srv-${s.id}`,
            dbId: s.id,
            nombreServicio: s.nombre_servicio,
            categoria: s.categoria,
            descripcion: s.descripcion,
            icono: s.icono,
            entregables: s.entregables ? JSON.parse(s.entregables) : [],
            ctaTexto: s.cta_texto,
            ctaDestino: s.cta_destino
        }));

        // 7. Educación & Certificados
        const degrees = db.prepare('SELECT * FROM academic_degrees ORDER BY anio DESC').all();
        const certs = db.prepare('SELECT * FROM certifications ORDER BY anio DESC').all();
        const educationData = {
            titulosAcademicos: degrees.map(d => ({
                id: d.id,
                tituloAcademico: d.titulo_academico,
                institucion: d.institucion,
                anio: d.anio,
                estado: d.estado,
                descripcion: d.descripcion
            })),
            certificaciones: certs.map(c => ({
                id: c.id,
                nombre: c.nombre,
                entidadCertificadora: c.entidad_certificadora,
                anio: c.anio,
                credencialUrl: c.credencial_url,
                badgeDigital: c.badge_digital
            }))
        };

        // 8. Testimonios
        const testimonialsRows = db.prepare('SELECT * FROM testimonials ORDER BY id ASC').all();
        const testimonialsData = testimonialsRows.map(t => ({
            id: `test-${t.id}`,
            dbId: t.id,
            textoTestimonio: t.texto_testimonio,
            nombreRecomendador: t.nombre_recomendador,
            cargo: t.cargo,
            empresa: t.empresa,
            foto: t.foto,
            valoracion: t.valoracion,
            relacionProfesional: t.relacion_profesional
        }));

        // 10. Usuarios
        const users = db.prepare('SELECT id, username, email, role, is_active, created_at, updated_at FROM users ORDER BY id ASC').all();

        // 9. Tema
        const themeConfig = db.prepare('SELECT * FROM theme_config ORDER BY id DESC LIMIT 1').get();

        res.json({
            success: true,
            data: {
                profile: perfilData,
                about: aboutData,
                experience: experiencesData,
                skills: skillsData,
                projects: projectsData,
                services: servicesData,
                education: educationData,
                testimonials: testimonialsData,
                users: users,
                theme: themeConfig || { tema_activo: 'dark' }
            }
        });
    } catch (error) {
        console.error('Error en /api/content/all:', error);
        res.status(500).json({ success: false, message: 'Error cargando datos completos.' });
    }
});

// ============================================================================
// 3. CRUD PERFIL Y SOBRE MÍ
// ============================================================================
app.get('/api/profile', (req, res) => {
    try {
        const profile = db.prepare('SELECT * FROM profiles WHERE id = 1').get();
        const redes = db.prepare('SELECT * FROM social_networks WHERE perfil_id = 1 ORDER BY orden ASC').all();
        res.json({ success: true, data: { ...profile, redesSociales: redes } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/profile', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const {
            nombreCompleto,
            tituloProfesional,
            tagline,
            descripcionBreve,
            profesion,
            edad,
            email,
            telefono,
            numeroCelular,
            fotoPerfil,
            cvArchivo,
            redesSociales
        } = req.body;

        db.prepare(`
            UPDATE profiles SET
                nombre_completo = ?,
                titulo_profesional = ?,
                tagline = ?,
                descripcion_breve = ?,
                profesion = ?,
                edad = ?,
                email = ?,
                telefono = ?,
                numeroCelular = ?,
                foto_perfil = COALESCE(?, foto_perfil),
                cv_archivo = COALESCE(?, cv_archivo),
                updated_at = datetime('now')
            WHERE id = 1
        `).run(nombreCompleto, tituloProfesional, tagline, descripcionBreve, profesion, edad, email, telefono, numeroCelular, fotoPerfil, cvArchivo);

        if (Array.isArray(redesSociales)) {
            db.prepare('DELETE FROM social_networks WHERE perfil_id = 1').run();
            const insertRed = db.prepare(`
                INSERT INTO social_networks (perfil_id, nombre_red, url_perfil, icono, etiqueta, orden)
                VALUES (1, ?, ?, ?, ?, ?)
            `);
            redesSociales.forEach((r, i) => {
                insertRed.run(r.nombreRed, r.urlPerfil, r.icono || 'public/images/icons/link.svg', r.etiqueta || '', i);
            });
        }

        res.json({ success: true, message: 'Perfil actualizado exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/about', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { biografiaProfesional, imagenComplementaria, parrafos, areasEspecializacion, valoresProfesionales, estadisticasClave } = req.body;

        db.prepare(`
            UPDATE bios SET
                biografia_profesional = ?,
                imagen_complementaria = COALESCE(?, imagen_complementaria),
                updated_at = datetime('now')
            WHERE id = 1
        `).run(biografiaProfesional, imagenComplementaria);

        if (Array.isArray(parrafos)) {
            db.prepare('DELETE FROM bio_paragraphs WHERE bio_id = 1').run();
            const insertP = db.prepare('INSERT INTO bio_paragraphs (bio_id, contenido, orden) VALUES (1, ?, ?)');
            parrafos.forEach((p, i) => insertP.run(p, i));
        }

        if (Array.isArray(areasEspecializacion)) {
            db.prepare('DELETE FROM specializations WHERE bio_id = 1').run();
            const insertSp = db.prepare('INSERT INTO specializations (bio_id, titulo, descripcion, icono, orden) VALUES (1, ?, ?, ?, ?)');
            areasEspecializacion.forEach((sp, i) => insertSp.run(sp.titulo, sp.descripcion, sp.icono || '', i));
        }

        if (Array.isArray(valoresProfesionales)) {
            db.prepare('DELETE FROM professional_values WHERE bio_id = 1').run();
            const insertV = db.prepare('INSERT INTO professional_values (bio_id, valor, descripcion, orden) VALUES (1, ?, ?, ?)');
            valoresProfesionales.forEach((val, i) => insertV.run(val.valor, val.descripcion, i));
        }

        if (Array.isArray(estadisticasClave)) {
            db.prepare('DELETE FROM key_statistics WHERE bio_id = 1').run();
            const insertSt = db.prepare('INSERT INTO key_statistics (bio_id, cifra, etiqueta, orden) VALUES (1, ?, ?, ?)');
            estadisticasClave.forEach((st, i) => insertSt.run(st.cifra, st.etiqueta, i));
        }

        res.json({ success: true, message: 'Sección Sobre Mí actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 4. CRUD EXPERIENCIAS
// ============================================================================
app.post('/api/experiences', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { cargo, empresa, ubicacion, modalidad, periodoInicio, periodoFin, estaVigente, descripcion, responsabilidades = [], logros = [], tecnologias = [] } = req.body;
        const result = db.prepare(`
            INSERT INTO experiences (cargo, empresa, ubicacion, modalidad, periodo_inicio, periodo_fin, esta_vigente, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(cargo, empresa, ubicacion, modalidad || 'Híbrido', periodoInicio, periodoFin || 'Presente', estaVigente ? 1 : 0, descripcion);

        const expId = result.lastInsertRowid;
        const insertResp = db.prepare('INSERT INTO responsibilities (experience_id, contenido, orden) VALUES (?, ?, ?)');
        responsabilidades.forEach((r, i) => insertResp.run(expId, r, i));

        const insertAch = db.prepare('INSERT INTO achievements (experience_id, contenido, orden) VALUES (?, ?, ?)');
        logros.forEach((l, i) => insertAch.run(expId, l, i));

        const insertTech = db.prepare('INSERT INTO experience_techs (experience_id, tecnologia) VALUES (?, ?)');
        tecnologias.forEach(t => insertTech.run(expId, t));

        res.json({ success: true, message: 'Experiencia creada', data: { id: expId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/experiences/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const expId = req.params.id;
        const { cargo, empresa, ubicacion, modalidad, periodoInicio, periodoFin, estaVigente, descripcion, responsabilidades, logros, tecnologias } = req.body;

        db.prepare(`
            UPDATE experiences SET
                cargo = ?, empresa = ?, ubicacion = ?, modalidad = ?, periodo_inicio = ?, periodo_fin = ?, esta_vigente = ?, descripcion = ?
            WHERE id = ?
        `).run(cargo, empresa, ubicacion, modalidad, periodoInicio, periodoFin, estaVigente ? 1 : 0, descripcion, expId);

        if (Array.isArray(responsabilidades)) {
            db.prepare('DELETE FROM responsibilities WHERE experience_id = ?').run(expId);
            const insertResp = db.prepare('INSERT INTO responsibilities (experience_id, contenido, orden) VALUES (?, ?, ?)');
            responsabilidades.forEach((r, i) => insertResp.run(expId, r, i));
        }
        if (Array.isArray(logros)) {
            db.prepare('DELETE FROM achievements WHERE experience_id = ?').run(expId);
            const insertAch = db.prepare('INSERT INTO achievements (experience_id, contenido, orden) VALUES (?, ?, ?)');
            logros.forEach((l, i) => insertAch.run(expId, l, i));
        }
        if (Array.isArray(tecnologias)) {
            db.prepare('DELETE FROM experience_techs WHERE experience_id = ?').run(expId);
            const insertTech = db.prepare('INSERT INTO experience_techs (experience_id, tecnologia) VALUES (?, ?)');
            tecnologias.forEach(t => insertTech.run(expId, t));
        }

        res.json({ success: true, message: 'Experiencia actualizada exitosamente' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/experiences/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM experiences WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Experiencia eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 5. CRUD PROYECTOS (CON REPOSITORIOS, DEMOS, CLOUD IMAGES Y VIDEOS)
// ============================================================================
app.post('/api/projects', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { titulo, subtitulo, categoria, descripcionBreve, descripcionDetallada, imagenRepresentativa, enlaceDemo, enlaceGitHub, destacado, tecnologias = [], resultados = [], metricas = [] } = req.body;
        const result = db.prepare(`
            INSERT INTO projects (titulo, subtitulo, categoria, descripcion_breve, descripcion_detallada, imagen_representativa, enlace_demo, enlace_github, destacado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(titulo, subtitulo || '', categoria || 'Desarrollo Web', descripcionBreve, descripcionDetallada, imagenRepresentativa || 'public/images/projects/placeholder.svg', enlaceDemo || '', enlaceGitHub || '', destacado ? 1 : 0);

        const projId = result.lastInsertRowid;
        const insertTech = db.prepare('INSERT INTO project_techs (project_id, tecnologia) VALUES (?, ?)');
        tecnologias.forEach(tech => insertTech.run(projId, tech));

        const insertRes = db.prepare('INSERT INTO project_results (project_id, contenido, orden) VALUES (?, ?, ?)');
        resultados.forEach((r, i) => insertRes.run(projId, r, i));

        const insertMet = db.prepare('INSERT INTO project_metrics (project_id, indicador, valor) VALUES (?, ?, ?)');
        metricas.forEach(m => insertMet.run(projId, m.indicador, m.valor));

        res.json({ success: true, message: 'Proyecto creado exitosamente', data: { id: projId } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/projects/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const projId = req.params.id;
        const { titulo, subtitulo, categoria, descripcionBreve, descripcionDetallada, imagenRepresentativa, enlaceDemo, enlaceGitHub, destacado, tecnologias, resultados, metricas } = req.body;

        db.prepare(`
            UPDATE projects SET
                titulo = ?, subtitulo = ?, categoria = ?, descripcion_breve = ?, descripcion_detallada = ?,
                imagen_representativa = COALESCE(?, imagen_representativa),
                enlace_demo = ?, enlace_github = ?, destacado = ?
            WHERE id = ?
        `).run(titulo, subtitulo || '', categoria, descripcionBreve, descripcionDetallada, imagenRepresentativa, enlaceDemo || '', enlaceGitHub || '', destacado ? 1 : 0, projId);

        if (Array.isArray(tecnologias)) {
            db.prepare('DELETE FROM project_techs WHERE project_id = ?').run(projId);
            const insertTech = db.prepare('INSERT INTO project_techs (project_id, tecnologia) VALUES (?, ?)');
            tecnologias.forEach(tech => insertTech.run(projId, tech));
        }
        if (Array.isArray(resultados)) {
            db.prepare('DELETE FROM project_results WHERE project_id = ?').run(projId);
            const insertRes = db.prepare('INSERT INTO project_results (project_id, contenido, orden) VALUES (?, ?, ?)');
            resultados.forEach((r, i) => insertRes.run(projId, r, i));
        }
        if (Array.isArray(metricas)) {
            db.prepare('DELETE FROM project_metrics WHERE project_id = ?').run(projId);
            const insertMet = db.prepare('INSERT INTO project_metrics (project_id, indicador, valor) VALUES (?, ?, ?)');
            metricas.forEach(m => insertMet.run(projId, m.indicador, m.valor));
        }

        res.json({ success: true, message: 'Proyecto actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/projects/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM projects WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Proyecto eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 6. CRUD HABILIDADES Y CATEGORÍAS
// ============================================================================
app.post('/api/skills', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { categoriaId, nombre, icono, nivelDominio, aniosExperiencia, certificaciones } = req.body;
        const result = db.prepare(`
            INSERT INTO skills (categoria_id, nombre, icono, nivel_dominio, anios_experiencia, certificaciones)
            VALUES (?, ?, ?, ?, ?, ?)
        `).run(categoriaId, nombre, icono || 'public/images/icons/code.svg', nivelDominio || 80, aniosExperiencia || 1, certificaciones ? JSON.stringify(certificaciones) : null);

        res.json({ success: true, message: 'Habilidad creada', data: { id: result.lastInsertRowid } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/skills/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { categoriaId, nombre, icono, nivelDominio, aniosExperiencia, certificaciones } = req.body;
        db.prepare(`
            UPDATE skills SET
                categoria_id = COALESCE(?, categoria_id),
                nombre = ?, icono = ?, nivel_dominio = ?, anios_experiencia = ?, certificaciones = ?
            WHERE id = ?
        `).run(categoriaId, nombre, icono, nivelDominio, aniosExperiencia, certificaciones ? JSON.stringify(certificaciones) : null, req.params.id);

        res.json({ success: true, message: 'Habilidad actualizada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/skills/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM skills WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Habilidad eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 7. CRUD SERVICIOS, EDUCACIÓN Y TESTIMONIOS
// ============================================================================
app.post('/api/services', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { nombreServicio, categoria, descripcion, icono, entregables = [], ctaTexto, ctaDestino } = req.body;
        const result = db.prepare(`
            INSERT INTO services (nombre_servicio, categoria, descripcion, icono, entregables, cta_texto, cta_destino)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(nombreServicio, categoria || 'Consultoría', descripcion, icono || 'public/images/icons/services/gear.svg', JSON.stringify(entregables), ctaTexto || 'Solicitar Cotización', ctaDestino || '#contacto');

        res.json({ success: true, message: 'Servicio creado', data: { id: result.lastInsertRowid } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/services/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { nombreServicio, categoria, descripcion, icono, entregables, ctaTexto, ctaDestino } = req.body;
        db.prepare(`
            UPDATE services SET
                nombre_servicio = ?, categoria = ?, descripcion = ?, icono = ?, entregables = ?, cta_texto = ?, cta_destino = ?
            WHERE id = ?
        `).run(nombreServicio, categoria, descripcion, icono, JSON.stringify(entregables || []), ctaTexto, ctaDestino, req.params.id);

        res.json({ success: true, message: 'Servicio actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/services/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM services WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Servicio eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Educación
app.post('/api/education/degree', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { tituloAcademico, institucion, anio, estado, descripcion } = req.body;
        const result = db.prepare(`
            INSERT INTO academic_degrees (titulo_academico, institucion, anio, estado, descripcion)
            VALUES (?, ?, ?, ?, ?)
        `).run(tituloAcademico, institucion, anio, estado || 'Graduado', descripcion || '');
        res.json({ success: true, message: 'Título académico agregado', data: { id: result.lastInsertRowid } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/education/degree/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM academic_degrees WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Título eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/api/education/cert', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { nombre, entidadCertificadora, anio, credencialUrl, badgeDigital } = req.body;
        const result = db.prepare(`
            INSERT INTO certifications (nombre, entidad_certificadora, anio, credencial_url, badge_digital)
            VALUES (?, ?, ?, ?, ?)
        `).run(nombre, entidadCertificadora, anio, credencialUrl || '', badgeDigital || 'public/images/icons/badge.svg');
        res.json({ success: true, message: 'Certificación agregada', data: { id: result.lastInsertRowid } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/education/cert/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM certifications WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Certificación eliminada' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Testimonios
app.post('/api/testimonials', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { textoTestimonio, nombreRecomendador, cargo, empresa, foto, valoracion, relacionProfesional } = req.body;
        const result = db.prepare(`
            INSERT INTO testimonials (texto_testimonio, nombre_recomendador, cargo, empresa, foto, valoracion, relacion_profesional)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `).run(textoTestimonio, nombreRecomendador, cargo, empresa, foto || 'public/images/testimonials/avatar-default.svg', valoracion || 5, relacionProfesional || '');
        res.json({ success: true, message: 'Testimonio creado', data: { id: result.lastInsertRowid } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.delete('/api/testimonials/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        db.prepare('DELETE FROM testimonials WHERE id = ?').run(req.params.id);
        res.json({ success: true, message: 'Testimonio eliminado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 8. CONTACTO (MENSAJES DE VISITANTES Y GESTIÓN ADMIN)
// ============================================================================
app.post('/api/contact/send', (req, res) => {
    try {
        const { nombre, email, asunto, mensaje, telefono } = req.body;
        if (!nombre || !email || !mensaje) {
            return res.status(400).json({ success: false, message: 'Campos requeridos incompletos.' });
        }

        db.prepare(`
            INSERT INTO contacts (nombre, email, telefono, asunto, mensaje)
            VALUES (?, ?, ?, ?, ?)
        `).run(nombre, email, telefono || '', asunto || 'Contacto Web', mensaje);

        res.json({ success: true, message: 'Mensaje recibido exitosamente. ¡Gracias por escribir!' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/contact/messages', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const messages = db.prepare('SELECT * FROM contacts ORDER BY created_at DESC').all();
        res.json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// ============================================================================
// 9. CONFIGURACIÓN DE TEMA Y ESTADÍSTICAS ADMIN
// ============================================================================
app.get('/api/theme', (req, res) => {
    try {
        const theme = db.prepare('SELECT * FROM theme_config ORDER BY id DESC LIMIT 1').get();
        res.json({ success: true, data: theme || { tema_activo: 'dark' } });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.put('/api/theme', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { temaActivo } = req.body;
        db.prepare(`
            INSERT INTO theme_config (tema_activo, updated_at)
            VALUES (?, datetime('now'))
        `).run(temaActivo || 'dark');
        res.json({ success: true, message: 'Tema actualizado' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/admin/stats', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const stats = db.prepare(`
            SELECT
                (SELECT COUNT(*) FROM experiences) as total_experiencias,
                (SELECT COUNT(*) FROM skills) as total_habilidades,
                (SELECT COUNT(*) FROM projects) as total_proyectos,
                (SELECT COUNT(*) FROM services) as total_servicios,
                (SELECT COUNT(*) FROM academic_degrees) as total_titulos,
                (SELECT COUNT(*) FROM certifications) as total_certificaciones,
                (SELECT COUNT(*) FROM testimonials) as total_testimonios,
                (SELECT COUNT(*) FROM contacts WHERE respondido = 0) as mensajes_nuevos
        `).get();
        res.json({ success: true, data: stats });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});
// ===========================================================================
// USERS ENDPOINTS
// ===========================================================================
app.get('/api/users', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const users = db.prepare('SELECT id, username, email, role, is_active, created_at, updated_at FROM users ORDER BY id ASC').all();
        res.json({ success: true, data: users });
    } catch (error) {
        console.error('Error en /api/users:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo usuarios.' });
    }
});

app.get('/api/users/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const user = db.prepare('SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        res.json({ success: true, data: user });
    } catch (error) {
        console.error('Error en /api/users/:id:', error);
        res.status(500).json({ success: false, message: 'Error obteniendo usuario.' });
    }
});

app.post('/api/users', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const { username, email, password, role, is_active } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ success: false, message: 'Usuario, email y contraseña son requeridos.' });
        }
        const userRole = role || 'admin';
        const userIsActive = is_active !== undefined ? is_active : 1;
        const existing = db.prepare('SELECT id FROM users WHERE username = ? OR email = ?').get(username, email);
        if (existing) {
            return res.status(400).json({ success: false, message: 'El usuario o email ya existe.' });
        }
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(password, salt);
        const result = db.prepare(`
            INSERT INTO users (username, email, password_hash, role, is_active, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, datetime('now'), datetime('now'))
        `).run(username, email, passwordHash, userRole, userIsActive);
        const newUserId = result.lastInsertRowid;
        const newUser = db.prepare('SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(newUserId);
        res.json({ success: true, data: newUser, message: 'Usuario creado exitosamente' });
    } catch (error) {
        console.error('Error en POST /api/users:', error);
        res.status(500).json({ success: false, message: 'Error creando usuario.' });
    }
});

app.put('/api/users/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        const { username, email, password, role, is_active } = req.body;
        if (!username || !email) {
            return res.status(400).json({ success: false, message: 'Usuario y email son requeridos.' });
        }
        const existing = db.prepare('SELECT id FROM users WHERE (username = ? OR email = ?) AND id <> ?').get(username, email, userId);
        if (existing) {
            return res.status(400).json({ success: false, message: 'El usuario o email ya existe.' });
        }
        let updateQuery = "UPDATE users SET username = ?, email = ?, role = COALESCE(?, role), is_active = COALESCE(?, is_active), updated_at = datetime('now')";
        const params = [username, email, role || null, is_active !== undefined ? is_active : null];
        if (password && password.trim() !== '') {
            const salt = bcrypt.genSaltSync(10);
            const passwordHash = bcrypt.hashSync(password, salt);
            updateQuery += ', password_hash = ?';
            params.push(passwordHash);
        }
        updateQuery += ' WHERE id = ?';
        params.push(userId);
        db.prepare(updateQuery).run(...params);
        const updated = db.prepare('SELECT id, username, email, role, is_active, created_at, updated_at FROM users WHERE id = ?').get(userId);
        res.json({ success: true, data: updated, message: 'Usuario actualizado exitosamente' });
    } catch (error) {
        console.error('Error en PUT /api/users/:id:', error);
        res.status(500).json({ success: false, message: 'Error actualizando usuario.' });
    }
});

app.delete('/api/users/:id', authenticateToken, authorizeAdmin, (req, res) => {
    try {
        const userId = req.params.id;
        const adminCount = db.prepare('SELECT COUNT(*) as count FROM users WHERE role = "admin" AND is_active = 1').get().count;
        if (adminCount <= 1) {
            const user = db.prepare('SELECT role, is_active FROM users WHERE id = ?').get(userId);
            if (user && user.role === 'admin' && user.is_active === 1) {
                return res.status(400).json({ success: false, message: 'No se puede eliminar el último usuario administrador activo.' });
            }
        }
        const result = db.prepare('DELETE FROM users WHERE id = ?').run(userId);
        if (result.changes > 0) {
            res.json({ success: true, message: 'Usuario eliminado exitosamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado.' });
        }
    } catch (error) {
        console.error('Error en DELETE /api/users/:id:', error);
        res.status(500).json({ success: false, message: 'Error eliminando usuario.' });
    }
});

// ============================================================================
// HEALTH CHECK Y RUTA SPA CATCH-ALL
// ============================================================================
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        database: 'SQLite 3 (better-sqlite3) Connected'
    });
});

app.use((req, res) => {
    res.sendFile(join(BASE_DIR, 'index.html'));
});

// Iniciar servidor si se ejecuta directamente
if (process.env.NODE_ENV !== 'test') {
    const connected = initializeDatabase();
    if (connected) {
        app.listen(PORT, () => {
            console.log(`🌐 Servidor Portafolio v2.0 corriendo en: http://localhost:${PORT}`);
        });
    }
}

export { app, initializeDatabase };