# TalentAI Pro - Windows Setup Script
# This script sets up both backend and frontend for development

Write-Host "🚀 Setting up TalentAI Pro..." -ForegroundColor Green
Write-Host ""

# Check Prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow

# Check Python
try {
    python --version | Out-Null
    Write-Host "✅ Python found" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python 3.11+" -ForegroundColor Red
    exit 1
}

# Check Node.js
try {
    node --version | Out-Null
    Write-Host "✅ Node.js found" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow

# Backend Setup
Write-Host ""
Write-Host "🐍 Setting up Python backend..." -ForegroundColor Cyan
Set-Location backend

# Create virtual environment if it doesn't exist
if (-not (Test-Path "venv")) {
    Write-Host "Creating Python virtual environment..." -ForegroundColor Yellow
    python -m venv venv
}

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install Python dependencies
Write-Host "Installing Python packages..." -ForegroundColor Yellow
pip install --quiet --upgrade pip
pip install --quiet -r requirements/base.txt
pip install --quiet -r requirements/ml.txt

# Download spaCy model
Write-Host "Downloading spaCy English model..." -ForegroundColor Yellow
python -m spacy download en_core_web_sm

Write-Host "✅ Backend dependencies installed" -ForegroundColor Green

# Copy environment file
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  Please edit backend/.env with your configuration" -ForegroundColor Yellow
}

Set-Location ..

# Frontend Setup
Write-Host ""
Write-Host "⚛️  Setting up React frontend..." -ForegroundColor Cyan
npm install

Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "🐳 Starting Docker services..." -ForegroundColor Cyan
Set-Location backend
docker-compose up -d

Write-Host ""
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host ""
Write-Host "✅ Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Next steps:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Backend API:" -ForegroundColor Cyan
Write-Host "   cd backend\services\gateway"
Write-Host "   ..\..\venv\Scripts\Activate.ps1"
Write-Host "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
Write-Host "   API will be available at: http://localhost:8000" -ForegroundColor Green
Write-Host "   API docs at: http://localhost:8000/api/docs" -ForegroundColor Green
Write-Host ""
Write-Host "2. Frontend (in a new terminal):" -ForegroundColor Cyan
Write-Host "   npm run dev"
Write-Host "   Frontend will be available at: http://localhost:5173" -ForegroundColor Green
Write-Host ""
Write-Host "3. Access Docker services:" -ForegroundColor Cyan
Write-Host "   PostgreSQL: localhost:5432 (user: talentai, password: password)"
Write-Host "   Redis: localhost:6379"
Write-Host "   Elasticsearch: localhost:9200"
Write-Host "   RabbitMQ Management: localhost:15672"
Write-Host ""
Write-Host "🎉 Happy coding!" -ForegroundColor Green
