@echo off
echo ========================================
echo Restart Frontend with Cache Clear
echo ========================================
echo.
echo This will fix the Closed Properties tab issue
echo.
pause

cd frontend-next

echo.
echo Clearing Next.js cache...
if exist .next (
    rmdir /s /q .next
    echo ✅ Cache cleared!
) else (
    echo No cache to clear
)

echo.
echo Starting Frontend Server...
echo.
set NEXT_PUBLIC_API_URL=http://localhost:3050/api
npm run dev

pause

