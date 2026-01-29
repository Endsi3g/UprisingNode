@echo off
TITLE Uprising Node Launcher

echo ===================================================
echo   UPRISING NODE - LOCAL ENVIRONMENT
echo ===================================================
echo.
echo This script will launch both the API and the Web Client
echo in separate console windows.
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo [1/2] Starting API Service (NestJS)...
if not exist "api\node_modules" (
    echo     - Installing API dependencies...
    cd api
    call npm install
    cd ..
)
start "Uprising API (Port 3001)" /D api cmd /k "npm run start:dev"

echo [2/2] Starting Web Client (Next.js)...
if not exist "web\node_modules" (
    echo     - Installing Web dependencies...
    cd web
    call npm install
    cd ..
)
start "Uprising Web (Port 3000)" /D web cmd /k "npm run dev"

echo.
echo ===================================================
echo   SYSTEMS LAUNCHED
echo ===================================================
echo   API Swagger:  http://localhost:3001/api
echo   Web Dashboard: http://localhost:3000
echo.
echo   Press any key to close this launcher...
pause >nul
