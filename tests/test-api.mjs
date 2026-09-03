// Test unitario y de integración para API Backend y SQLite
process.env.NODE_ENV = 'test';
import { app, initializeDatabase } from '../server.js';
import http from 'http';

async function runApiTests() {
    console.log('🧪 Iniciando pruebas de integración de API REST y SQLite...');
    initializeDatabase();

    const server = http.createServer(app);
    await new Promise(resolve => server.listen(3099, resolve));
    console.log('   🌐 Servidor de pruebas iniciado en http://localhost:3099');

    let adminToken = '';

    try {
        // 1. Health check
        console.log('1️⃣  Probando GET /health...');
        const healthRes = await fetch('http://localhost:3099/health');
        const healthData = await healthRes.json();
        if (healthData.status !== 'OK') throw new Error('Health check falló');
        console.log('   ✅ Health check OK:', healthData.version);

        // 2. GET /api/content/all
        console.log('2️⃣  Probando GET /api/content/all (Datos completos)...');
        const contentRes = await fetch('http://localhost:3099/api/content/all');
        const contentData = await contentRes.json();
        if (!contentData.success || !contentData.data.profile || !contentData.data.experience) {
            throw new Error('Carga de contenido completo falló');
        }
        console.log('   ✅ Datos unificados OK: Perfil:', contentData.data.profile.nombreCompleto);
        console.log('      - Experiencias:', contentData.data.experience.length);
        console.log('      - Habilidades:', contentData.data.skills.length);
        console.log('      - Proyectos:', contentData.data.projects.length);
        console.log('      - Servicios:', contentData.data.services.length);
        console.log('      - Titulos Académicos:', contentData.data.education.titulosAcademicos.length);
        console.log('      - Certificaciones:', contentData.data.education.certificaciones.length);
        console.log('      - Testimonios:', contentData.data.testimonials.length);

        // 3. Login con Admin / Admin123
        console.log('3️⃣  Probando Login con Admin / Admin123...');
        const loginRes = await fetch('http://localhost:3099/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: 'Admin', password: 'Admin123' })
        });
        const loginData = await loginRes.json();
        if (!loginData.success || !loginData.data.token) {
            throw new Error('Login falló: ' + JSON.stringify(loginData));
        }
        adminToken = loginData.data.token;
        console.log('   ✅ Login de Administrador exitoso. Token generado.');

        // 4. Token verification
        console.log('4️⃣  Probando GET /api/auth/verify...');
        const verifyRes = await fetch('http://localhost:3099/api/auth/verify', {
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const verifyData = await verifyRes.json();
        if (!verifyData.success || verifyData.data.user.username !== 'Admin') {
            throw new Error('Verificación de token falló');
        }
        console.log('   ✅ Verificación de token OK para usuario Admin');

        // 5. Crear proyecto nuevo con links de Github, Demo, Cloud image y video
        console.log('5️⃣  Probando POST /api/projects (Creación dinámica)...');
        const newProjRes = await fetch('http://localhost:3099/api/projects', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${adminToken}`
            },
            body: JSON.stringify({
                titulo: 'Plataforma Cloud BI & Analytics 2026',
                subtitulo: 'Sistema de analítica en tiempo real',
                categoria: 'Analítica y BI',
                descripcionBreve: 'Plataforma empresarial de inteligencia de negocios.',
                descripcionDetallada: 'Arquitectura moderna con pipeline ETL y dashboards reactivos.',
                imagenRepresentativa: 'https://drive.google.com/uc?export=view&id=ejemplo_cloud_drive_img',
                enlaceDemo: 'https://demo.bi.ejemplo.com',
                enlaceGitHub: 'https://github.com/jose-cespedes/cloud-bi-analytics',
                destacado: 1,
                tecnologias: ['Python', 'Power BI', 'SQL Server', 'Docker'],
                resultados: ['Reducción de latencia en 50%', 'Uptime de 99.9%'],
                metricas: [{ indicador: 'Velocidad', valor: '+300%' }]
            })
        });
        const newProjData = await newProjRes.json();
        if (!newProjData.success || !newProjData.data.id) {
            throw new Error('Creación de proyecto falló');
        }
        const createdProjId = newProjData.data.id;
        console.log('   ✅ Proyecto creado con éxito con ID:', createdProjId);

        // 6. Eliminar proyecto de prueba para mantener la BD limpia
        console.log('6️⃣  Probando DELETE /api/projects/:id...');
        const delRes = await fetch(`http://localhost:3099/api/projects/${createdProjId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${adminToken}` }
        });
        const delData = await delRes.json();
        if (!delData.success) throw new Error('Eliminación de proyecto falló');
        console.log('   ✅ Proyecto de prueba eliminado correctamente.');

        // 7. Enviar mensaje de contacto de visitante
        console.log('7️⃣  Probando POST /api/contact/send...');
        const contactRes = await fetch('http://localhost:3099/api/contact/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: 'Empresa Cliente QA',
                email: 'contacto@cliente.com',
                telefono: '+57 300 1234567',
                asunto: 'Propuesta de Proyecto',
                mensaje: 'Hola José, nos interesa tu perfil para un proyecto de analítica.'
            })
        });
        const contactData = await contactRes.json();
        if (!contactData.success) throw new Error('Envío de contacto falló');
        console.log('   ✅ Mensaje de contacto procesado exitosamente.');

        console.log('\n🎉 ¡TODAS LAS PRUEBAS DE API Y SQLITE PASARON AL 100%!');
        server.close(() => process.exit(0));
    } finally {
        server.close();
    }
}

runApiTests().catch(err => {
    console.error('❌ Error en pruebas de API:', err);
    process.exit(1);
});
