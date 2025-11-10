@echo off
echo ========================================
echo Al Rabie Real Estate - Migration Steps
echo ========================================
echo.

REM Change to backend directory (from project root)
cd /d "%~dp0backend"
if not exist "prisma\schema.prisma" (
    echo ERROR: Cannot find backend\prisma\schema.prisma
    echo Please run this file from the project root directory.
    pause
    exit /b 1
)

echo [Step 1] Validating Prisma Schema...
call npx prisma validate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Schema validation failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)
echo Schema is valid!
echo.

echo [Step 2] Running Prisma Migration...
echo This will:
echo - Create a new migration file
echo - Apply changes to the database
echo - Generate Prisma Client
echo.
pause

call npx prisma migrate dev --name enhance_deals_and_multi_tenant
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Migration failed!
    echo Please check the error messages above.
    pause
    exit /b 1
)

echo.
echo [Step 3] Verifying Prisma Client...
call npm run prisma:generate
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Prisma Client generation failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Migration completed successfully!
echo ========================================
echo.
echo Next steps:
echo 1. Open Prisma Studio: npm run prisma:studio
echo 2. Test API endpoints
echo 3. Check the database structure
echo.
pause

