// ============================================================================
// SCRIPT DE INICIALIZACIÓN DE BASE DE DATOS
// Migración desde JSON estáticos a SQLite
// Autor: José Arnulfo Céspedes Albornoz
// Versión: v2.0
// ============================================================================

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const Database = require('better-sqlite3');
import { readFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const BASE_DIR = join(__dirname, '..');

const DB_PATH = join(BASE_DIR, 'data', 'portafolio.db');

const JSON_PATHS = {
    profile:     join(BASE_DIR, 'src', 'js', 'data', 'profile.json'),
    about:       join(BASE_DIR, 'src', 'js', 'data', 'about.json'),
    experience:  join(BASE_DIR, 'src', 'js', 'data', 'experience.json'),
    skills:      join(BASE_DIR, 'src', 'js', 'data', 'skills.json'),
    projects:    join(BASE_DIR, 'src', 'js', 'data', 'projects.json'),
    services:    join(BASE_DIR, 'src', 'js', 'data', 'services.json'),
    education:   join(BASE_DIR, 'src', 'js', 'data', 'education.json'),
    testimonials:join(BASE_DIR, 'src', 'js', 'data', 'testimonials.json')
};

function readJSON(filename) {
    const filePath = JSON_PATHS[filename];
    if (!existsSync(filePath)) {
        console.warn(`⚠️  Archivo no encontrado: ${filePath}`);
        return null;
    }
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
}

async function hashPassword(password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
}

async function main() {
    console.log('═══════════════════════════════════════════════════════');
    console.log('  INICIALIZACIÓN DE BASE DE DATOS — PORTAFOLIO v2.0');
    console.log('═══════════════════════════════════════════════════════\\n');

    const dataDir = join(BASE_DIR, 'data');
    if (!existsSync(dataDir)) {
        mkdirSync(dataDir, { recursive: true });
    }

    console.log('🔌 Conectando a SQLite...');
    const db = new Database(DB_PATH);
    console.log(`✅ Base de datos conectada: ${DB_PATH}\n`);

    console.log('📖 Cargando schema.sql...');
    const schema = readFileSync(join(BASE_DIR, 'data', 'schema.sql'), 'utf8');
    db.exec(schema);
    console.log('✅ Schema ejecutado\n');

    // 1. PERFIL
    console.log('👤 Migración: Perfil...');
    const profile = readJSON('profile');
    if (profile) {
        const stmt = db.prepare(`
            INSERT OR REPLACE INTO profiles 
            (id, nombre_completo, titulo_profesional, tagline, descripcion_breve, foto_perfil, cv_archivo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run([
            1,
            profile.nombreCompleto,
            profile.tituloProfesional,
            profile.tagline,
            profile.descripcionBreve,
            profile.fotoProfesional,
            profile.botonCV?.archivo || null
        ]);

        if (profile.redesSociales) {
            const redStmt = db.prepare(`
                INSERT INTO social_networks 
                (perfil_id, nombre_red, url_perfil, icono, etiqueta, orden)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            profile.redesSociales.forEach((red, index) => {
                redStmt.run([
                    1,
                    red.nombreRed,
                    red.urlPerfil,
                    red.icono,
                    red.etiqueta || '',
                    index
                ]);
            });
        }
        console.log('   ✅ Perfil migrado');
    }

    // 2. BIOGRAFÍA / SOBRE MÍ
    console.log('📝 Migración: Sobre Mí...');
    const about = readJSON('about');
    if (about) {
        const bioStmt = db.prepare(`
            INSERT OR REPLACE INTO bios 
            (id, perfil_id, biografia_profesional, imagen_complementaria)
            VALUES (?, ?, ?, ?)
        `);
        bioStmt.run([
            1,
            1,
            about.biografiaProfesional,
            about.imagenComplementaria
        ]);

        if (about.parrafos) {
            const bpStmt = db.prepare(`INSERT INTO bio_paragraphs (bio_id, contenido, orden) VALUES (?, ?, ?)`);
            about.parrafos.forEach((parrafo, index) => {
                bpStmt.run([1, parrafo, index]);
            });
        }

        if (about.areasEspecializacion) {
            const specStmt = db.prepare(`INSERT INTO specializations (bio_id, titulo, descripcion, icono, orden) VALUES (?, ?, ?, ?, ?)`);
            about.areasEspecializacion.forEach((area, index) => {
                specStmt.run([
                    1,
                    area.titulo,
                    area.descripcion,
                    area.icono,
                    index
                ]);
            });
        }

        if (about.valoresProfesionales) {
            const valuesStmt = db.prepare(`INSERT INTO professional_values (bio_id, valor, descripcion, orden) VALUES (?, ?, ?, ?)`);
            about.valoresProfesionales.forEach((valor, index) => {
                valuesStmt.run([
                    1,
                    valor.valor,
                    valor.descripcion,
                    index
                ]);
            });
        }

        if (about.estadisticasClave) {
            const ksStmt = db.prepare(`INSERT INTO key_statistics (bio_id, cifra, etiqueta, orden) VALUES (?, ?, ?, ?)`);
            about.estadisticasClave.forEach((stat, index) => {
                ksStmt.run([
                    1,
                    stat.cifra,
                    stat.etiqueta,
                    index
                ]);
            });
        }
        console.log('   ✅ Sobre Mí migrado');
    }

    // 3. EXPERIENCIAS
    console.log('💼 Migración: Experiencias...');
    const experiences = readJSON('experience');
    if (experiences && Array.isArray(experiences)) {
        const expStmt = db.prepare(`
            INSERT OR REPLACE INTO experiences 
            (id, cargo, empresa, ubicacion, modalidad, periodo_inicio, periodo_fin, esta_vigente, descripcion)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const respStmt = db.prepare(`INSERT INTO responsibilities (experience_id, contenido, orden) VALUES (?, ?, ?)`);
        const achStmt = db.prepare(`INSERT INTO achievements (experience_id, contenido, orden) VALUES (?, ?, ?)`);
        const techStmt = db.prepare(`INSERT INTO experience_techs (experience_id, tecnologia) VALUES (?, ?)`);

        experiences.forEach((exp, index) => {
            const expId = index + 1;
            expStmt.run([
                expId,
                exp.cargo,
                exp.empresa,
                exp.ubicacion,
                exp.modalidad || 'Remoto',
                exp.periodoInicio,
                exp.periodoFin || 'Presente',
                exp.estaVigente ? 1 : 0,
                exp.descripcion
            ]);

            if (exp.responsabilidades) {
                exp.responsabilidades.forEach((resp, respIndex) => {
                    respStmt.run([expId, resp, respIndex]);
                });
            }

            const logros = exp.logrosCuantificables || exp.logros;
            if (Array.isArray(logros)) {
                logros.forEach((logro, logroIndex) => {
                    achStmt.run([expId, logro, logroIndex]);
                });
            }

            if (exp.tecnologias) {
                exp.tecnologias.forEach((tech, techIndex) => {
                    techStmt.run([expId, tech]);
                });
            }
        });
        console.log(`   ✅ ${experiences.length} experiencias migradas`);
    }

    // 4. HABILIDADES
    console.log('🎯 Migración: Habilidades...');
    const skills = readJSON('skills');
    if (skills && Array.isArray(skills)) {
        const catStmt = db.prepare(`
            INSERT OR REPLACE INTO skill_categories 
            (id, nombre_categoria, descripcion, icono, orden)
            VALUES (?, ?, ?, ?, ?)
        `);
        const skillStmt = db.prepare(`
            INSERT OR REPLACE INTO skills 
            (id, categoria_id, nombre, icono, nivel_dominio, anios_experiencia, certificaciones)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `);

        let globalSkillId = 1;
        skills.forEach((skillCategory, catIndex) => {
            const catId = catIndex + 1;
            catStmt.run([
                catId,
                skillCategory.nombreCategoria,
                skillCategory.descripcion || '',
                skillCategory.icono || '',
                catIndex
            ]);

            const techs = skillCategory.tecnologias || skillCategory.habilidades || [];
            if (Array.isArray(techs)) {
                techs.forEach((skill) => {
                    skillStmt.run([
                        globalSkillId++,
                        catId,
                        skill.nombre,
                        skill.icono || '',
                        skill.nivelDominio || 0,
                        skill.aniosExperiencia || 0,
                        skill.certificacionesAsociadas ? JSON.stringify(skill.certificacionesAsociadas) : null
                    ]);
                });
            }
        });
        console.log(`   ✅ ${skills.length} categorías de habilidades migradas (${globalSkillId - 1} habilidades)`);
    }

    // 5. PROYECTOS
    console.log('🚀 Migración: Proyectos...');
    const projects = readJSON('projects');
    if (projects && Array.isArray(projects)) {
        const projStmt = db.prepare(`
            INSERT OR REPLACE INTO projects 
            (id, titulo, subtitulo, categoria, descripcion_breve, descripcion_detallada, imagen_representativa, enlace_demo, enlace_github, destacado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        const techStmt = db.prepare(`INSERT INTO project_techs (project_id, tecnologia) VALUES (?, ?)`);
        const resultsStmt = db.prepare(`INSERT INTO project_results (project_id, contenido, orden) VALUES (?, ?, ?)`);
        const metricsStmt = db.prepare(`INSERT INTO project_metrics (project_id, indicador, valor) VALUES (?, ?, ?)`);

        projects.forEach((proj, index) => {
            const projId = proj.id || (index + 1);
            projStmt.run([
                projId,
                proj.titulo,
                proj.subtitulo || '',
                proj.categoria || '',
                proj.descripcionBreve,
                proj.descripcionDetallada,
                proj.imagenRepresentativa,
                proj.enlaceDemo,
                proj.enlaceGitHub,
                proj.destacado ? 1 : 0
            ]);

            if (proj.tecnologiasUtilizadas) {
                proj.tecnologiasUtilizadas.forEach((tech, techIndex) => {
                    techStmt.run([projId, tech]);
                });
            }

            if (proj.resultadosObtenidos) {
                proj.resultadosObtenidos.forEach((result, resultIndex) => {
                    resultsStmt.run([projId, result, resultIndex]);
                });
            }

            if (proj.metricasImpacto) {
                proj.metricasImpacto.forEach((metric, metricIndex) => {
                    metricsStmt.run([
                        projId,
                        metric.indicador,
                        metric.valor
                    ]);
                });
            }
        });
        console.log(`   ✅ ${projects.length} proyectos migrados`);
    }

    // 6. SERVICIOS
    console.log('🛠️  Migración: Servicios...');
    const services = readJSON('services');
    if (services && Array.isArray(services)) {
        const serviceStmt = db.prepare(`
            INSERT OR REPLACE INTO services 
            (id, nombre_servicio, categoria, descripcion, icono, entregables, cta_texto, cta_destino)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        services.forEach((service, index) => {
            serviceStmt.run([
                index + 1,
                service.nombreServicio,
                service.categoria,
                service.descripcion,
                service.icono || '',
                JSON.stringify(service.entregables),
                service.ctaTexto,
                service.ctaDestino
            ]);
        });
        console.log(`   ✅ ${services.length} servicios migrados`);
    }

    // 7. EDUCACIÓN
    console.log('🎓 Migración: Educación...');
    const education = readJSON('education');
    if (education) {
        const academicStmt = db.prepare(`
            INSERT OR REPLACE INTO academic_degrees 
            (id, titulo_academico, institucion, anio, estado, descripcion)
            VALUES (?, ?, ?, ?, ?, ?)
        `);
        const certStmt = db.prepare(`
            INSERT OR REPLACE INTO certifications 
            (id, nombre, entidad_certificadora, anio, credencial_url, badge_digital)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        const titulos = education.titulosAcademicos || education.titulos || [];
        if (Array.isArray(titulos)) {
            titulos.forEach((titulo, index) => {
                academicStmt.run([
                    index + 1,
                    titulo.tituloAcademico,
                    titulo.institucion,
                    titulo.anio,
                    titulo.estado,
                    titulo.descripcion || ''
                ]);
            });
        }

        const certs = education.certificaciones || [];
        if (Array.isArray(certs)) {
            certs.forEach((cert, index) => {
                certStmt.run([
                    index + 1,
                    cert.nombre,
                    cert.entidadCertificadora,
                    cert.anio,
                    cert.credencialUrl,
                    cert.badgeDigital || ''
                ]);
            });
        }
        console.log('   ✅ Educación migrada');
    }

    // 8. TESTIMONIOS
    console.log('💬 Migración: Testimonios...');
    const testimonials = readJSON('testimonials');
    if (testimonials && Array.isArray(testimonials)) {
        const testimonialStmt = db.prepare(`
            INSERT OR REPLACE INTO testimonials 
            (id, texto_testimonio, nombre_recomendador, cargo, empresa, foto, valoracion, relacion_profesional)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `);
        testimonials.forEach((testimonio, index) => {
            testimonialStmt.run([
                index + 1,
                testimonio.textoTestimonio,
                testimonio.nombreRecomendador,
                testimonio.cargo,
                testimonio.empresa,
                testimonio.foto || '',
                testimonio.valoracion || 5,
                testimonio.relacionProfesional || ''
            ]);
        });
        console.log(`   ✅ ${testimonials.length} testimonios migrados`);
    }

    // 9. USUARIOS (Admin por defecto)
    console.log('👥 Migración: Usuarios...');
    const passwordHash = await hashPassword('Admin123');
    const userStmt = db.prepare(`
        INSERT OR REPLACE INTO users 
        (id, username, email, password_hash, role, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    userStmt.run([1, 'Admin', 'admin@portafolio.local', passwordHash, 'admin', 1]);
    console.log('   ✅ Usuario admin creado');

    // 10. CONFIGURACIÓN DE TEMA
    console.log('🎨 Migración: Configuración de tema...');
    const themeStmt = db.prepare(`
        INSERT OR REPLACE INTO theme_config 
        (id, tema_activo, colores_primarios, colores_accent, fuente_heading, fuente_body, border_radius)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    themeStmt.run([
        1,
        'dark',
        '#00FFC2,#00B4D8,#0077B6',
        '#00FFC2,#00B4D8,#0077B6,#48CAE4',
        'Outfit',
        'Inter',
        '12px'
    ]);
    console.log('   ✅ Tema configurado');

    // Verificación final
    console.log('\n📊 Verificación de datos:');
    const tables = ['profiles', 'social_networks', 'bios', 'bio_paragraphs', 'specializations',
                    'professional_values', 'key_statistics', 'experiences', 'responsibilities',
                    'achievements', 'experience_techs', 'skill_categories', 'skills',
                    'projects', 'project_techs', 'project_results', 'project_metrics',
                    'services', 'academic_degrees', 'certifications', 'testimonials',
                    'users', 'theme_config'];
    for (const table of tables) {
        try {
            const row = db.prepare(`SELECT COUNT(*) as cnt FROM ${table}`).get();
            console.log(`   📄 ${table}: ${row.cnt} registros`);
        } catch (e) {
            console.log(`   📄 ${table}: error - ${e.message}`);
        }
    }

    db.close();
    console.log('\n═══════════════════════════════════════════════════════');
    console.log('✅ BASE DE DATOS INICIALIZADA EXITOSAMENTE');
    console.log(`📁 Ubicación: ${DB_PATH}`);
    console.log('═══════════════════════════════════════════════════════');

    console.log('\n🔑 Credenciales admin por defecto:');
    console.log('   Usuario: Admin');
    console.log('   Contraseña: Admin123');
    console.log('   ⚠️  Cambiar contraseña después del primer acceso');
}

// Manejo de errores globales
process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

main().catch(err => {
    console.error('❌ Error durante la inicialización:', err.message);
    console.error(err.stack);
    process.exit(1);
});