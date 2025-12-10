@echo off
echo.
echo ========================================
echo   Restarting Development Server
echo ========================================
echo.
echo Stopping current server...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul
echo.
echo Starting new server...
cd /d "%~dp0"
start cmd /k "npm run dev"
echo.
echo ========================================
echo   Server restarting in new window...
echo ========================================
echo.
pause
