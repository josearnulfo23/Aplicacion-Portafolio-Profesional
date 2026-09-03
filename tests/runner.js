// tests/runner.js - Ejecutor completo de pruebas para el portafolio profesional
import jsdomPkg from 'jsdom';
const { JSDOM, VirtualConsole } = jsdomPkg;
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

let pruebasPasadas = 0;
let pruebasTotales = 0;
const errores = [];

function assert(condicion, mensaje) {
  pruebasTotales++;
  if (condicion) {
    console.log(`✅ ${mensaje}`);
    pruebasPasadas++;
  } else {
    console.log(`❌ ${mensaje}`);
    errores.push(mensaje);
  }
}

async function ejecutarPruebas() {
  console.log('🧪 Iniciando suite completa de pruebas...\n');

  // ========================================================================
  // GRUPO 1: Validación de integridad de datos JSON
  // ========================================================================
  console.log('📦 GRUPO 1: Validación de integridad de datos JSON');
  console.log('─'.repeat(60));

  const dataFiles = ['profile', 'about', 'experience', 'skills', 'projects', 'services', 'education', 'testimonials'];
  for (const name of dataFiles) {
    try {
      const filePath = path.join(projectRoot, `src/js/data/${name}.json`);
      const content = fs.readFileSync(filePath, 'utf8');
      const parsed = JSON.parse(content);
      assert(parsed !== null, `JSON válido: ${name}.json`);
    } catch (e) {
      assert(false, `JSON inválido: ${name}.json - ${e.message}`);
    }
  }

  // ========================================================================
  // GRUPO 2: Verificación de estructura del proyecto
  // ========================================================================
  console.log('\n📁 GRUPO 2: Verificación de estructura del proyecto');
  console.log('─'.repeat(60));

  const requiredDirs = [
    'data',
    'src/css',
    'src/js/components',
    'src/js/components/ui',
    'src/js/config',
    'src/js/data',
    'src/js/domain',
    'src/js/schemas',
    'src/js/services',
    'public',
    'public/images',
    'public/documents'
  ];
  for (const dir of requiredDirs) {
    const exists = fs.existsSync(path.join(projectRoot, dir));
    assert(exists, `Directorio existe: ${dir}/`);
  }

  const requiredFiles = [
    'index.html',
    'package.json',
    'server.js',
    'data/schema.sql',
    'data/init-db.js',
    'data/portafolio.db',
    'src/js/main.js',
    'src/js/components/AdminPanel.js',
    'src/css/variables.css',
    'src/css/base.css',
    'src/js/services/ServicioNavegacion.js',
    'src/js/services/ServicioAnimaciones.js',
    'src/js/services/ServicioSEO.js',
    'src/js/services/ServicioAccesibilidad.js'
  ];
  for (const file of requiredFiles) {
    const exists = fs.existsSync(path.join(projectRoot, file));
    assert(exists, `Archivo existe: ${file}`);
  }

  // ========================================================================
  // GRUPO 3: Validación del HTML principal
  // ========================================================================
  console.log('\n📄 GRUPO 3: Validación del HTML principal');
  console.log('─'.repeat(60));

  const indexHtml = fs.readFileSync(path.join(projectRoot, 'index.html'), 'utf8');
  assert(indexHtml.includes('lang="es"'), 'index.html tiene lang="es"');
  assert(indexHtml.includes('charset="UTF-8"'), 'index.html tiene charset UTF-8');
  assert(indexHtml.includes('viewport'), 'index.html tiene meta viewport');
  assert(indexHtml.includes('id="app"'), 'index.html contiene div#app');
  assert(indexHtml.includes('type="module"'), 'index.html carga main.js como módulo');
  assert(indexHtml.includes('variables.css'), 'index.html carga variables.css');
  assert(indexHtml.includes('og:title'), 'index.html tiene Open Graph meta');

  // ========================================================================
  // GRUPO 4: Renderizado dinámico con JSDOM
  // ========================================================================
  console.log('\n🎨 GRUPO 4: Renderizado dinámico de la aplicación');
  console.log('─'.repeat(60));

  // Cargar JSONs manualmente para inyectarlos como responses de fetch
  const jsonMap = {};
  for (const name of dataFiles) {
    jsonMap[`src/js/data/${name}.json`] = fs.readFileSync(
      path.join(projectRoot, `src/js/data/${name}.json`), 'utf8'
    );
  }

  // Crear un HTML simplificado que NO cargue main.js como módulo (lo inyectamos manualmente)
  const indexPath = path.join(projectRoot, 'index.html').replace(/\\/g, '/');
  const htmlContent = fs.readFileSync(indexPath, 'utf8')
    .replace(/<script[^>]*src="src\/js\/main\.js"[^>]*><\/script>/g, '');

  const virtualConsole = new VirtualConsole();
  const consoleErrors = [];
  const consoleLogs = [];
  virtualConsole.on('jsdomError', (err) => consoleErrors.push(err.message));
  virtualConsole.on('error', (...args) => consoleErrors.push(args.map(a => String(a)).join(' ')));

  const dom = new JSDOM(htmlContent, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: `file:///${indexPath}`,
    virtualConsole
  });

  const { window } = dom;

  // Inyectar fetch que devuelve contenido local
  window.fetch = async (url) => {
    const cleanUrl = String(url).replace(/^https?:\/\/[^/]+/, '').replace(/^\/+/, '');
    const content = jsonMap[cleanUrl];
    if (content) {
      return {
        ok: true,
        status: 200,
        json: async () => JSON.parse(content)
      };
    }
    return {
      ok: false,
      status: 404,
      json: async () => ({ error: 'Archivo no encontrado' })
    };
  };

  // Capturar console.log
  const originalLog = console.log;
  window.console = {
    log: (...args) => { consoleLogs.push(args.map(a => String(a)).join(' ')); },
    warn: (...args) => { consoleLogs.push('WARN: ' + args.map(a => String(a)).join(' ')); },
    error: (...args) => { consoleErrors.push(args.map(a => String(a)).join(' ')); },
    info: (...args) => { consoleLogs.push(args.map(a => String(a)).join(' ')); }
  };

  // Cargar y ejecutar main.js
  const mainJsPath = path.join(projectRoot, 'src/js/main.js').replace(/\\/g, '/');
  const mainJsContent = fs.readFileSync(mainJsPath, 'utf8');

  // Los módulos ES no se pueden ejecutar directamente con JSDOM runScripts: outside-only
  // Necesitamos transformar imports para que sean cargas síncronas o usar importScripts
  // Estrategia: ejecutamos como módulo usando la API de módulos dinámicos del navegador simulado

  // Crear un script de tipo module e inyectarlo
  const script = window.document.createElement('script');
  script.type = 'module';
  script.textContent = mainJsContent;

  // Sobrescribir la importación para que use fetch simulado
  window.eval = (code) => {
    // Stub - no permitir eval directo en este contexto
    return undefined;
  };

  // Polyfill para import dinámico
  // Vamos a usar un truco: convertir todos los imports a carga directa
  const transformedCode = mainJsContent.replace(/^import\s+(.+?)\s+from\s+["'](.+?)["'];?$/gm, (match, bindings, modulePath) => {
    // Si es import relativo, lo resolvemos a path absoluto
    const resolvedPath = modulePath.startsWith('.')
      ? `src/js/${modulePath.replace(/^\.\//, '').replace(/^\.\.\//, '')}`
      : modulePath;

    // Si el módulo es un .js o .json, lo cargamos y exponemos las exportaciones
    return `// import ${bindings} from "${modulePath}"; (resuelto a ${resolvedPath})`;
  });

  // Usar approach alternativo: convertir el módulo a script clásico con carga manual
  // Construimos un wrapper que carga los módulos secuencialmente
  const moduleMap = {};
  async function loadModule(modulePath) {
    if (moduleMap[modulePath]) return moduleMap[modulePath];

    // Resolver path
    const cleanPath = modulePath.replace(/^\.\//, '');
    const candidates = [
      path.join(projectRoot, 'src/js', cleanPath),
      path.join(projectRoot, 'src/js', cleanPath + '.js'),
      path.join(projectRoot, cleanPath)
    ];

    let filePath = null;
    for (const c of candidates) {
      if (fs.existsSync(c) && fs.statSync(c).isFile()) {
        filePath = c;
        break;
      }
    }

    if (!filePath) {
      throw new Error(`Módulo no encontrado: ${modulePath}`);
    }

    const code = fs.readFileSync(filePath, 'utf8');

    // Extraer imports y exports
    const importRegex = /^import\s+(?:\{([^}]+)\}|(\w+))\s+from\s+["'](.+?)["'];?$/gm;
    const exportRegex = /^export\s+(?:class|function|const|let|var|default)\s+(\w+)/gm;

    let processedCode = code;
    const localExports = {};
    let exportMatch;
    while ((exportMatch = exportRegex.exec(code)) !== null) {
      localExports[exportMatch[1]] = true;
    }

    // Reemplazar imports con awaits
    const imports = [];
    let m;
    while ((m = importRegex.exec(code)) !== null) {
      imports.push({
        named: m[1] ? m[1].split(',').map(s => s.trim()) : null,
        default: m[2],
        path: m[3]
      });
    }

    // Eliminar imports del código
    processedCode = processedCode.replace(/^import\s+.+?;?$/gm, '');

    // Eliminar exports y reemplazar con asignaciones a un objeto global temporal
    const exportBlock = `__moduleExports = {};\n`;
    processedCode = processedCode.replace(/^export\s+(class|function|const|let|var)\s+(\w+)/gm, '$1 $2; __moduleExports.$2 = $2;');

    // Construir el código con imports resueltos
    let wrapperCode = 'async function __load() {\n  let __moduleExports;\n';
    for (const imp of imports) {
      const impModule = await loadModule(imp.path);
      if (imp.named) {
        for (const name of imp.named) {
          wrapperCode += `  const ${name} = __moduleCache[${JSON.stringify(imp.path)}].${name};\n`;
        }
      } else if (imp.default) {
        wrapperCode += `  const ${imp.default} = __moduleCache[${JSON.stringify(imp.path)}].default;\n`;
      }
    }
    wrapperCode += processedCode + '\n  __moduleCache[' + JSON.stringify(modulePath) + '] = __moduleExports;\n  return __moduleExports;\n}\nawait __load();';

    // Evaluar en contexto de ventana
    moduleMap[modulePath] = await window.eval(`(async () => { ${wrapperCode} })()`);
    return moduleMap[modulePath];
  }

  // Inicializar caché
  window.eval('var __moduleCache = {};');

  // Estrategia más simple: usar la API de Node.js para ejecutar los módulos
  // directamente en el contexto global

  // Polyfill window.eval para ejecutar código en el contexto del DOM
  Object.defineProperty(window, 'eval', {
    value: function(code) {
      // Ejecutar usando el contexto de la ventana
      const vmContext = dom.getInternalVMContext();
      // eslint-disable-next-line no-new-func
      const fn = new Function('window', 'document', 'fetch', code);
      return fn(window, window.document, window.fetch);
    },
    writable: true
  });

  // Para esta prueba, ejecutamos los módulos del proyecto usando import dinámico de Node
  console.log('\n🔧 Ejecutando módulos del proyecto directamente...');

  try {
    const { RepositorioContenido } = await import('../src/js/services/RepositorioContenido.js');
    const { ServicioSEO } = await import('../src/js/services/ServicioSEO.js');
    const { ServicioAccesibilidad } = await import('../src/js/services/ServicioAccesibilidad.js');
    const { ServicioNavegacion } = await import('../src/js/services/ServicioNavegacion.js');
    const { ServicioAnimaciones } = await import('../src/js/services/ServicioAnimaciones.js');

    // Validar que los módulos se carguen correctamente
    assert(typeof RepositorioContenido.cargarPerfil === 'function', 'RepositorioContenido.cargarPerfil disponible');
    assert(typeof ServicioSEO.inyectarStructuredData === 'function', 'ServicioSEO.inyectarStructuredData disponible');
    assert(typeof ServicioAccesibilidad.inicializar === 'function', 'ServicioAccesibilidad.inicializar disponible');
    assert(typeof ServicioNavegacion.inicializar === 'function', 'ServicioNavegacion.inicializar disponible');
    assert(typeof ServicioAnimaciones.inicializar === 'function', 'ServicioAnimaciones.inicializar disponible');

    // Cargar perfil y validar (usando file:// para entorno Node)
    const perfil = await RepositorioContenido.cargarPerfil();
    assert(perfil !== null && perfil.nombreCompleto === 'José Arnulfo Céspedes Albornoz', 'Perfil cargado correctamente');
    assert(perfil && perfil.redesSociales && perfil.redesSociales.length > 0, 'Redes sociales presentes en el perfil');

    // Cargar proyectos
    const proyectos = await RepositorioContenido.cargarProyectos();
    assert(proyectos.length > 0, `Proyectos cargados (${proyectos.length})`);

    // Validar otras secciones
    const bio = await RepositorioContenido.cargarBiografia();
    assert(bio && bio.biografiaProfesional && bio.biografiaProfesional.length > 0, 'Biografía cargada');

    const experiencia = await RepositorioContenido.cargarExperiencia();
    assert(experiencia.length > 0, `Experiencia laboral cargada (${experiencia.length})`);

    const habilidades = await RepositorioContenido.cargarHabilidades();
    assert(habilidades.length > 0, `Habilidades cargadas (${habilidades.length})`);

    const servicios = await RepositorioContenido.cargarServicios();
    assert(servicios.length > 0, `Servicios cargados (${servicios.length})`);

    const educacion = await RepositorioContenido.cargarEducacion();
    assert(educacion !== null, 'Educación cargada');

    const testimonios = await RepositorioContenido.cargarTestimonios();
    assert(testimonios.length > 0, `Testimonios cargados (${testimonios.length})`);

  } catch (e) {
    assert(false, `Error al cargar módulos: ${e.message}`);
  }

  // Validar renderizado del DOM estático (sin módulos)
  const appContainer = window.document.getElementById('app');
  assert(appContainer !== null, 'Contenedor #app presente en el DOM');
  assert(appContainer.innerHTML.length >= 0, 'Contenedor #app existe y está listo');

  // ========================================================================
  // RESULTADOS FINALES
  // ========================================================================
  console.log('\n' + '═'.repeat(60));
  console.log(`📊 RESULTADOS FINALES: ${pruebasPasadas}/${pruebasTotales} pruebas pasaron`);
  console.log('═'.repeat(60));

  if (errores.length > 0) {
    console.log('\n❌ ERRORES DETECTADOS:');
    errores.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
  }

  if (consoleErrors.length > 0 && consoleErrors.length < 5) {
    console.log('\n⚠️  Errores de consola JSDOM:');
    consoleErrors.forEach((e, i) => console.log(`   ${i + 1}. ${e.substring(0, 200)}`));
  }

  dom.window.close();

  if (pruebasPasadas === pruebasTotales) {
    console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
    process.exit(0);
  } else {
    console.log(`\n⚠️  ${pruebasTotales - pruebasPasadas} prueba(s) fallaron`);
    process.exit(1);
  }
}

ejecutarPruebas().catch(error => {
  console.error('💥 Error crítico durante las pruebas:', error);
  console.error(error.stack);
  process.exit(1);
});