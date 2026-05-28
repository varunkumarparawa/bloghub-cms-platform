@echo off
REM Blog Platform - Local Development Quick Start
REM Run all three servers for local testing

echo ========================================
echo Blog Platform - Starting All Services
echo ========================================
echo.
echo This script will start all three servers.
echo Make sure all 3 terminal windows stay open.
echo.
echo Servers will run on:
echo  - Backend:    http://localhost:5000
echo  - Admin:      http://localhost:5173 (or next available)
echo  - Frontend:   http://localhost:3000 (or next available)
echo.
pause

REM Start Backend in new window
echo Starting Backend...
start "Blog Platform - Backend" cmd /k "cd backend && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak

REM Start Admin Panel in new window
echo Starting Admin Panel...
start "Blog Platform - Admin" cmd /k "cd admin-panel && npm run dev"

REM Wait a moment
timeout /t 3 /nobreak

REM Start Frontend in new window
echo Starting Frontend...
start "Blog Platform - Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo All services started!
echo Check the new terminal windows above.
echo ========================================
pause
