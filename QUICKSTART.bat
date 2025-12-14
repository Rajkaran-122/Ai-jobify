@echo off
REM Quick Start Script for TalentAI Pro (Windows)
REM This script sets up and runs the complete platform

echo.
echo ========================================
echo   TalentAI Pro - Quick Start
echo ========================================
echo.

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Docker is not running!
    echo Please start Docker Desktop and try again.
    pause
    exit /b 1
)

echo [1/6] Starting Docker services...
cd backend
docker-compose up -d postgres redis elasticsearch rabbitmq

echo.
echo Waiting for services to be ready (10 seconds)...
timeout /t 10 /nobreak >nul

echo.
echo [2/6] Installing Python dependencies...
pip install -r requirements/base.txt >nul 2>&1
if exist requirements\ai.txt (
    pip install -r requirements/ai.txt >nul 2>&1
)

echo.
echo [3/6] Initializing database with seed data...
python init_db.py

echo.
echo [4/6] Starting FastAPI backend...
cd services\gateway
start "TalentAI Backend" cmd /k "uvicorn main:app --reload --host 0.0.0.0 --port 8000"

echo.
echo [5/6] Waiting for backend to start (5 seconds)...
timeout /t 5 /nobreak >nul

cd ..\..\..

echo.
echo [6/6] Frontend is already running at http://localhost:8080
echo.

echo ========================================
echo   Platform Ready!
echo ========================================
echo.
echo Frontend: http://localhost:8080
echo Backend API: http://localhost:8000
echo API Docs: http://localhost:8000/api/docs
echo.
echo Login Credentials:
echo.
echo EMPLOYER:
echo   Email: hr@techcorp.com
echo   Password: password123
echo.
echo CANDIDATE:
echo   Email: john.doe@email.com
echo   Password: password123
echo.
echo Press any key to view logs...
pause >nul

REM Show backend logs
docker-compose -f backend\docker-compose.yml logs -f
