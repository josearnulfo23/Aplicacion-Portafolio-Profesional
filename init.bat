@echo off
REM ========================================================
REM Script de Inicialización Rápida (Windows)
REM Portafolio Profesional - José Arnulfo Céspedes Albornoz
REM ========================================================

echo ==========================================================
echo  Inicializando Landing Page Portafolio Profesional...
echo ==========================================================

where node >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js detectado.
    echo [INFO] Ejecutando suite de pruebas unitarias de QA...
    node tests/runner.js
    echo [INFO] Iniciando servidor web local en el puerto 3000...
    call npx serve -l 3000 .
) else (
    where python >nul 2>nul
    if %errorlevel% equ 0 (
        echo [OK] Python detectado. Iniciando servidor en el puerto 8000...
        start http://localhost:8000
        python -m http.server 8000
    ) else (
        echo [INFO] Abriendo index.html en el navegador predeterminado...
        start index.html
    )
)
