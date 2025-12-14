#!/bin/bash

# TalentAI Pro - Complete Setup Script
# This script sets up both backend and frontend for development

set -e  # Exit on error

echo "🚀 Setting up TalentAI Pro..."
echo ""

# Check Prerequisites
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python &> /dev/null; then
    echo "❌ Python not found. Please install Python 3.11+"
    exit 1
fi
echo "✅ Python found"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js found"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo "❌ Docker not found. Please install Docker"
    exit 1
fi
echo "✅ Docker found"

echo ""
echo "📦 Installing dependencies..."

# Backend Setup
echo ""
echo "🐍 Setting up Python backend..."
cd backend

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install Python dependencies
echo "Installing Python packages..."
pip install --quiet --upgrade pip
pip install --quiet -r requirements/base.txt
pip install --quiet -r requirements/ml.txt

# Download spaCy model
echo "Downloading spaCy English model..."
python -m spacy download en_core_web_sm --quiet

echo "✅ Backend dependencies installed"

# Copy environment file
if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo "⚠️  Please edit backend/.env with your configuration"
fi

cd ..

# Frontend Setup
echo ""
echo "⚛️  Setting up React frontend..."
npm install

echo "✅ Frontend dependencies installed"

echo ""
echo "🐳 Starting Docker services..."
cd backend
docker-compose up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if PostgreSQL is ready
echo "Checking PostgreSQL..."
docker-compose exec -T postgres pg_isready -U talentai || echo "⚠️  PostgreSQL not ready yet"

# Check if Redis is ready
echo "Checking Redis..."
docker-compose exec -T redis redis-cli ping || echo "⚠️  Redis not ready yet"

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo ""
echo "1. Backend API:"
echo "   cd backend/services/gateway"
echo "   source ../../venv/bin/activate  # On Windows: ..\\..\\venv\\Scripts\\activate"
echo "   uvicorn main:app --reload --host 0.0.0.0 --port 8000"
echo "   API will be available at: http://localhost:8000"
echo "   API docs at: http://localhost:8000/api/docs"
echo ""
echo "2. Frontend (in a new terminal):"
echo "   npm run dev"
echo "   Frontend will be available at: http://localhost:5173"
echo ""
echo "3. Access Docker services:"
echo "   PostgreSQL: localhost:5432 (user: talentai, password: password)"
echo "   Redis: localhost:6379"
echo "   Elasticsearch: localhost:9200"
echo "   RabbitMQ Management: localhost:15672"
echo ""
echo "🎉 Happy coding!"
