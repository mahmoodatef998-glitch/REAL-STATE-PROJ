@echo off
echo ========================================
echo Prisma Studio Startup
echo ========================================
echo.
echo Starting Prisma Studio...
echo Database Management Interface
echo.

cd backend
npx prisma studio

echo.
echo Prisma Studio is running on http://localhost:5555
echo.
pause

