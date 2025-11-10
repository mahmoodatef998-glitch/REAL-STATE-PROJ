@echo off
echo ========================================
echo Fix Prisma Generate - EPERM Error
echo ========================================
echo.

echo [Step 1] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
if %errorlevel% equ 0 (
    echo Node.js processes stopped.
) else (
    echo No Node.js processes found or already stopped.
)
echo.

timeout /t 2 /nobreak >nul

echo [Step 2] Generating Prisma Client...
cd /d "%~dp0backend"
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Prisma Client generation failed!
    echo Try running this file again or manually:
    echo   cd backend
    echo   npm run prisma:generate
    pause
    exit /b 1
)

echo.
echo ========================================
echo Prisma Client generated successfully!
echo ========================================
echo.
pause

