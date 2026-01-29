@echo off
TITLE Uprising Node DB Setup

echo ===================================================
echo   UPRISING NODE - DATABASE RESET & INIT
echo ===================================================
echo.
echo [CRITICAL] Please close all other terminal windows (start_local.bat)
echo            before continuing, to avoid file lock errors.
echo.
pause

cd api

echo.
echo [1/3] Cleaning up old database artifacts...
if exist "prisma\dev.db" (
    del /F /Q "prisma\dev.db" >nul 2>&1
    if exist "prisma\dev.db" (
        echo [ERROR] Could not delete dev.db. Please close running servers.
        pause
        exit /b 1
    )
    echo    - Deleted dev.db
)

if exist "prisma\migrations" (
    rmdir /S /Q "prisma\migrations"
    echo    - Deleted migrations folder
)

echo.
echo [2/3] Installing dependencies (just in case)...
if not exist node_modules call npm install

echo.
echo [3/3] Running Prisma Migration (Init)...
call npx prisma migrate dev --name init

echo.
echo ===================================================
echo   DATABASE INITIALIZED SUCCESSFULLY ✅
echo ===================================================
echo   You can now run 'start_local.bat' again.
pause
