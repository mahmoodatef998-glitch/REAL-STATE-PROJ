@echo off
echo ========================================
echo Fixing Closed Properties Tab Issue
echo ========================================
echo.
echo This script will:
echo 1. Clear Next.js cache
echo 2. Restart the frontend server
echo.
pause

cd frontend-next

echo.
echo Step 1: Clearing Next.js cache...
echo.
if exist .next (
    rmdir /s /q .next
    echo ✅ Cache cleared successfully!
) else (
    echo Cache folder not found (already clean)
)

echo.
echo Step 2: Rebuilding and starting frontend...
echo.
echo Please run: npm run dev
echo.
echo After that:
echo 1. Open http://localhost:3000/broker/dashboard
echo 2. You should see 3 tabs:
echo    - Active Properties
echo    - Closed Properties  ← This one!
echo    - My Deals
echo.
echo If tab is empty (no properties shown):
echo    - Edit any property
echo    - Change status to "Closed"
echo    - Save
echo    - Go to Closed Properties tab
echo    - Property will appear there!
echo.
pause

