@echo off
title BookCycle - Student Book Marketplace
color 0B

echo ===============================================================================
echo                STARTING BOOKCYCLE PLATFORM (FULL STACK)
echo ===============================================================================
echo.

:: Ensure Node and Python are on PATH
set "PATH=C:\Program Files\nodejs;C:\Program Files\Python314;C:\Program Files\Python313;C:\Program Files\Python312;C:\Program Files\Python311;C:\Program Files\Python310;%PATH%"

echo [1/3] Launching FastAPI Backend on http://127.0.0.1:8000 ...
cd /d "%~dp0backend"
start "BookCycle Backend" /min cmd /c "python run.py"

:: Wait 2 seconds for backend to bind
timeout /t 2 /nobreak >nul

echo [2/3] Launching Vite Frontend on http://localhost:5173 ...
cd /d "%~dp0frontend"
start "BookCycle Frontend" /min cmd /c "npm run dev -- --host --port 5173"

:: Wait 3 seconds for Vite server to spin up
timeout /t 3 /nobreak >nul

echo [3/3] Opening BookCycle in your default web browser...
start http://localhost:5173

echo.
echo ===============================================================================
echo       BookCycle is now running!
echo       Frontend URL: http://localhost:5173
echo       Backend API:  http://127.0.0.1:8000
echo ===============================================================================
echo.
echo Keep this window open or minimize it while using the website.
pause
