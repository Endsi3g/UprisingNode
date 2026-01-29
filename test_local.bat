@echo off
TITLE Uprising Node Test Runner

echo ===================================================
echo   UPRISING NODE - TEST SUITE RUNNER
echo ===================================================
echo.

:: Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not in PATH.
    pause
    exit /b
)

echo [1/3] Backend API: Running Unit Tests...
echo ----------------------------------------
cd api
if not exist node_modules call npm install
call npm run test
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Backend Unit Tests failed. Aborting.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [2/3] Backend API: Running E2E Tests...
echo ---------------------------------------
cd api
call npm run test:e2e
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Backend E2E Tests failed. Aborting.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo [3/3] Frontend Web: Running Static Analysis (Linting)...
echo --------------------------------------------------------
cd web
if not exist node_modules call npm install
call npm run lint
if %errorlevel% neq 0 (
    echo.
    echo [FAIL] Frontend Linting failed. Aborting.
    cd ..
    pause
    exit /b 1
)
cd ..

echo.
echo ===================================================
echo   ALL TESTS PASSED SUCCESSFULLY ✅
echo ===================================================
pause
