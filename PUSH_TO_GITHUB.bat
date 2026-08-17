@echo off
title Push Project to GitHub
color 0A

echo ===============================================================================
echo                PUSHING BOOKCYCLE TO YOUR GITHUB REPOSITORY
echo          Repository: https://github.com/sakshamsinghbaish22/PROJECTS-.git
echo ===============================================================================
echo.

cd /d "%~dp0"

echo [1/3] Adding changes...
git add .

echo [2/3] Committing latest changes...
git commit -m "feat: complete BookCycle fullstack student marketplace"

echo [3/3] Pushing to GitHub (main branch)...
git push -u origin main

echo.
echo ===============================================================================
echo   Push Complete! Check: https://github.com/sakshamsinghbaish22/PROJECTS-
echo ===============================================================================
echo.
pause
