#!/bin/bash
# ========================================================
# Script de Inicialización Rápida (Linux / macOS)
# Portafolio Profesional - José Arnulfo Céspedes Albornoz
# ========================================================

echo "=========================================================="
echo "🚀 Inicializando Landing Page Portafolio Profesional..."
echo "=========================================================="

# Comprobar si Node.js está instalado
if command -v node >/dev/null 2>&1; then
    echo "✅ Node.js detectado: $(node -v)"
    
    # Ejecutar suite de pruebas unitarias
    echo "🧪 Ejecutando suite de pruebas unitarias de QA..."
    node tests/runner.js
    
    echo "🌐 Iniciando servidor web local..."
    npx -y serve -l 3000 .
elif command -v python3 >/dev/null 2>&1; then
    echo "✅ Python 3 detectado. Iniciando servidor HTTP local en el puerto 8000..."
    python3 -m http.server 8000
elif command -v python >/dev/null 2>&1; then
    echo "✅ Python detectado. Iniciando servidor HTTP local en el puerto 8000..."
    python -m SimpleHTTPServer 8000
else
    echo "ℹ️ Abriendo index.html directamente en el navegador..."
    xdg-open index.html 2>/dev/null || open index.html 2>/dev/null
fi
