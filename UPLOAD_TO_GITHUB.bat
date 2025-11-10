@echo off
echo ========================================
echo    Upload to GitHub - AL RABEI Real Estate
echo ========================================
echo.
echo This script will help you upload the project to GitHub
echo.

echo Step 1: Setting up Git branch...
git branch -M main
echo.

echo Step 2: Ready to add remote repository!
echo.
echo INSTRUCTIONS:
echo 1. Go to GitHub.com and login
echo 2. Click "+" at top right and select "New repository"
echo 3. Name it: al-rabei-real-estate
echo 4. Select "Private" (IMPORTANT!)
echo 5. DO NOT initialize with README (we already have one)
echo 6. Click "Create repository"
echo 7. Copy the repository URL (looks like: https://github.com/username/al-rabei-real-estate.git)
echo.
echo ========================================
echo.

set /p REPO_URL="Paste your GitHub repository URL here: "

echo.
echo Adding remote origin...
git remote add origin %REPO_URL%

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ========================================
echo    DONE! Your project is now on GitHub!
echo ========================================
echo.
echo Next time, just use: git push
echo.
pause

