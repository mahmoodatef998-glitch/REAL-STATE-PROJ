@echo off
echo ========================================
echo Show Admin Closed Properties Tab
echo ========================================
echo.
echo This will:
echo 1. Clear Frontend cache
echo 2. Restart Frontend server
echo 3. Open Admin Properties page
echo.
pause

echo.
echo Step 1: Clearing cache...
cd frontend-next
if exist .next (
    rmdir /s /q .next
    echo ✅ Cache cleared!
)

echo.
echo Step 2: Starting Frontend...
echo.
start "Frontend Server" cmd /k "set NEXT_PUBLIC_API_URL=http://localhost:3050/api && npm run dev"

echo.
echo Waiting for frontend to start...
timeout /t 10 /nobreak >nul

echo.
echo Step 3: Opening Admin Properties page...
start http://localhost:3000/admin/properties

echo.
echo ========================================
echo Done!
echo ========================================
echo.
echo You should see 2 tabs:
echo  1. Active Properties
echo  2. Closed Properties  ^<-- This one!
echo.
echo If not visible:
echo  - Press Ctrl + Shift + R (hard refresh)
echo  - Check URL is: /admin/properties (NOT /admin/dashboard)
echo.
pause

