@echo off
echo ========================================
echo Alrabie Real Estate - Project Startup
echo ========================================
echo.
echo Starting Backend Server on port 3050...
echo.

start "Backend Server" cmd /k "cd backend && set PORT=3050 && npm run dev"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak >nul

echo.
echo Starting Prisma Studio...
echo.

start "Prisma Studio" cmd /k "cd backend && npm run prisma:studio"

echo Waiting for Prisma to initialize...
timeout /t 3 /nobreak >nul

echo.
echo Starting Frontend Server with API connection...
echo.

start "Frontend Server" cmd /k "cd frontend-next && set NEXT_PUBLIC_API_URL=http://localhost:3050/api && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 8 /nobreak >nul

echo.
echo Opening project in browser...
echo.

REM Open Frontend only (Prisma Studio opens automatically)
start http://localhost:3000

echo.
echo ========================================
echo Project Started Successfully!
echo ========================================
echo.
echo Backend Server:  http://localhost:3050/api
echo Frontend Site:   http://localhost:3000 (or 3001)
echo Prisma Studio:   http://localhost:5555 (opens automatically)
echo.
echo All servers are running in separate windows.
echo You can close this window safely.
echo.
pause

