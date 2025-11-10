@echo off
title Sync with GitHub - AL RABEI Real Estate
color 0A

:menu
cls
echo ========================================
echo    Sync with GitHub
echo ========================================
echo.
echo 1. Pull (Download latest changes from GitHub)
echo 2. Push (Upload your changes to GitHub)
echo 3. Status (Check current changes)
echo 4. Full Sync (Pull then Push)
echo 5. Exit
echo.
echo ========================================
echo.

set /p choice="Choose an option (1-5): "

if "%choice%"=="1" goto pull
if "%choice%"=="2" goto push
if "%choice%"=="3" goto status
if "%choice%"=="4" goto fullsync
if "%choice%"=="5" goto end
goto menu

:pull
echo.
echo Downloading latest changes from GitHub...
git pull origin main
echo.
pause
goto menu

:push
echo.
echo Checking for changes...
git status
echo.
set /p commit_msg="Enter commit message: "
echo.
echo Adding files...
git add -A
echo.
echo Committing...
git commit -m "%commit_msg%"
echo.
echo Uploading to GitHub...
git push origin main
echo.
echo Done!
pause
goto menu

:status
echo.
echo Current status:
git status
echo.
pause
goto menu

:fullsync
echo.
echo Step 1: Downloading latest changes...
git pull origin main
echo.
echo Step 2: Checking for local changes...
git status
echo.
set /p has_changes="Do you have changes to upload? (y/n): "
if /i "%has_changes%"=="y" (
    set /p commit_msg="Enter commit message: "
    git add -A
    git commit -m "%commit_msg%"
    git push origin main
    echo.
    echo Full sync complete!
) else (
    echo.
    echo No changes to upload.
)
pause
goto menu

:end
echo.
echo Goodbye!
timeout /t 2 >nul
exit

