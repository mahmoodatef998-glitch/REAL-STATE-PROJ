@echo off
echo ========================================
echo Installing Required Libraries...
echo ========================================
echo.

echo [1/2] Installing Zod for Frontend...
cd frontend-next
call npm install zod --legacy-peer-deps
if %%errorlevel%% neq 0 (
    echo Error installing Zod!
    pause
    exit /b 1
)
echo ? Zod installed successfully!
echo.

echo [2/2] Installing express-validator for Backend...
cd ..\backend
call npm install express-validator
if %%errorlevel%% neq 0 (
    echo Error installing express-validator!
    pause
    exit /b 1
)
echo ? express-validator installed successfully!
echo.

cd ..
echo ========================================
echo All libraries installed successfully! ?
echo ========================================
pause
