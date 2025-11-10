# Script to fix Prisma Generate Error
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fixing Prisma Generate Error" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to backend directory
$backendPath = "C:\Users\admin\Desktop\mahmood\AL RABEI REAL STATE\backend"
Set-Location $backendPath

Write-Host "[1/4] Checking for Backend Server processes..." -ForegroundColor Yellow

# Find Backend server processes (checking command line arguments)
$backendProcesses = Get-WmiObject Win32_Process | Where-Object {
    $_.CommandLine -like "*start-server.js*" -or 
    $_.CommandLine -like "*nodemon start-server*" -or
    $_.CommandLine -like "*npm run dev*" -and $_.CommandLine -like "*backend*"
}

if ($backendProcesses) {
    Write-Host "Found Backend Server processes. Stopping them..." -ForegroundColor Yellow
    foreach ($proc in $backendProcesses) {
        try {
            Stop-Process -Id $proc.ProcessId -Force -ErrorAction SilentlyContinue
            Write-Host "Stopped process: $($proc.ProcessId) - $($proc.CommandLine)" -ForegroundColor Green
        } catch {
            Write-Host "Could not stop process: $($proc.ProcessId)" -ForegroundColor Red
        }
    }
} else {
    Write-Host "No Backend Server processes found." -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/4] Waiting 2 seconds..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

Write-Host ""
Write-Host "[3/4] Removing .prisma folder..." -ForegroundColor Yellow
$prismaPath = Join-Path $backendPath "node_modules\.prisma"
if (Test-Path $prismaPath) {
    try {
        Remove-Item -Path $prismaPath -Recurse -Force -ErrorAction Stop
        Write-Host "✓ .prisma folder removed successfully" -ForegroundColor Green
    } catch {
        Write-Host "⚠ Could not remove .prisma folder: $_" -ForegroundColor Yellow
        Write-Host "You may need to close other programs using these files." -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ .prisma folder doesn't exist (already clean)" -ForegroundColor Green
}

Write-Host ""
Write-Host "[4/4] Running prisma:generate..." -ForegroundColor Yellow
Write-Host ""

try {
    npm run prisma:generate
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Prisma Client generated successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Red
    Write-Host "✗ Error generating Prisma Client" -ForegroundColor Red
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "========================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Try:" -ForegroundColor Yellow
    Write-Host "1. Close all CMD/PowerShell windows running Backend" -ForegroundColor Yellow
    Write-Host "2. Close Prisma Studio if open" -ForegroundColor Yellow
    Write-Host "3. Run this script again" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

