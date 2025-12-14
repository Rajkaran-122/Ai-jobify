# TalentAI Pro - Quick Start Guide

This guide will help you get the complete TalentAI Pro platform running locally in under 10 minutes.

## Prerequisites

Before you begin, ensure you have:
- ✅ **Docker Desktop** installed and running
- ✅ **Python 3.11+** installed
- ✅ **Node.js 18+** installed
- ✅ **Git** installed

## Option 1: Automated Setup (Recommended)

### Windows

```powershell
# Run the automated setup script
.\setup.ps1
```

This script will:
1. Check all prerequisites
2. Install Python dependencies
3. Download spaCy models
4. Install frontend dependencies
5. Start all Docker services
6. Provide next steps

### Linux/Mac

```bash
# Make script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

## Option 2: Manual Setup

### Step 1: Start Docker Services

```powershell
# Navigate to backend directory
cd backend

# Start all services (PostgreSQL, Redis, Elasticsearch, RabbitMQ)
docker-compose up -d

# Verify all services are running
docker-compose ps
```

Expected output:
```
NAME                STATUS              PORTS
postgres            Up About a minute   0.0.0.0:5432->5432/tcp
redis               Up About a minute   0.0.0.0:6379->6379/tcp
elasticsearch       Up About a minute   0.0.0.0:9200->9200/tcp
rabbitmq            Up About a minute   0.0.0.0:5672->5672/tcp, 0.0.0.0:15672->15672/tcp
```

### Step 2: Backend Setup

```powershell
# Create Python virtual environment
cd backend
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate  # Windows
# source venv/bin/activate  # Linux/Mac

# Install Python dependencies
pip install -r requirements/base.txt
pip install -r requirements/ml.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Copy environment configuration
copy .env.example .env

# Start FastAPI server
cd services/gateway
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Server will start at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/api/docs**

### Step 3: Start Celery Workers (Optional but Recommended)

Open a new terminal:

```powershell
cd backend
.\venv\Scripts\Activate

# Start resume processing worker
celery -A workers.celery_app worker --loglevel=info --queue=resume

# In another terminal, start matching worker
celery -A workers.celery_app worker --loglevel=info --queue=matching
```

### Step 4: Frontend Setup

Open a new terminal:

```powershell
# Install frontend dependencies (if not done)
npm install

# Start development server
npm run dev
```

Frontend will start at: **http://localhost:8080**

## Verify Installation

### 1. Check Backend API

Visit: http://localhost:8000/api/docs

You should see Swagger UI with available endpoints.

### 2. Test Authentication

```powershell
# Register a new user
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "candidate"
  }'

# Login
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Check Frontend

Visit: http://localhost:8080

You should see the TalentAI Pro homepage.

## Common Issues & Solutions

### Issue: Docker services won't start

**Solution:**
```powershell
# Check if Docker Desktop is running
docker --version

# If services failed, check logs
cd backend
docker-compose logs

# Restart services
docker-compose down
docker-compose up -d
```

### Issue: Port already in use

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or change port in uvicorn command
uvicorn main:app --reload --host 0.0.0.0 --port 8001
```

### Issue: Frontend shows axios error

**Solution:**
```powershell
# Install axios
npm install axios

# Restart dev server
npm run dev
```

### Issue: spaCy model not found

**Solution:**
```powershell
# Activate venv
.\venv\Scripts\Activate

# Download model
python -m spacy download en_core_web_sm
```

## Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **Frontend** | http://localhost:8080 | - |
| **Backend API** | http://localhost:8000 | - |
| **API Docs** | http://localhost:8000/api/docs | - |
| **PostgreSQL** | localhost:5432 | user: talentai, pass: password |
| **Redis** | localhost:6379 | - |
| **Elasticsearch** | http://localhost:9200 | - |
| **RabbitMQ UI** | http://localhost:15672 | user: guest, pass: guest |

## Testing the Platform

### 1. Register as Candidate

1. Go to http://localhost:8080/register
2. Select "Candidate" role
3. Enter email and password
4. Create account

### 2. Register as Employer

1. Go to http://localhost:8080/register
2. Select "Employer" role
3. Enter email and password
4. Create account

### 3. Post a Job (as Employer)

1. Login as employer
2. Navigate to "Post Job"
3. Fill in job details
4. Submit

### 4. Apply to Job (as Candidate)

1. Login as candidate
2. View recommended jobs on dashboard
3. Click "Quick Apply"
4. View application status

## Developer Tools

### View Database

```powershell
# Connect to PostgreSQL
docker exec -it <postgres-container-id> psql -U talentai

# List tables
\dt

# Query users
SELECT * FROM users;
```

### View Redis

```powershell
# Connect to Redis
docker exec -it <redis-container-id> redis-cli

# List keys
KEYS *
```

### Monitor Celery

```powershell
# View worker status
celery -A workers.celery_app inspect active

# View queued tasks
celery -A workers.celery_app inspect reserved
```

## Stopping Services

```powershell
# Stop Docker services
cd backend
docker-compose down

# Stop FastAPI (Ctrl+C in terminal)
# Stop frontend (Ctrl+C in terminal)
# Stop Celery workers (Ctrl+C in terminals)
```

## Next Steps

1. ✅ **Explore the UI** - Visit http://localhost:8080
2. ✅ **Test API endpoints** - Use http://localhost:8000/api/docs
3. ✅ **Review code** - Check implementation files
4. ✅ **Read documentation** - See README.md and walkthrough.md
5. ✅ **Customize** - Modify .env for your configuration

## Need Help?

- **Documentation**: See [README.md](file:///C:/Users/digital%20metro/Documents/ai-job-navigator-main/README.md)
- **Walkthrough**: See [walkthrough.md](file:///C:/Users/digital%20metro/.gemini/antigravity/brain/a51cf4e9-4f1c-401c-bcf4-874b566c26ff/walkthrough.md)
- **Architecture**: See [implementation_plan.md](file:///C:/Users/digital%20metro/.gemini/antigravity/brain/a51cf4e9-4f1c-401c-bcf4-874b566c26ff/implementation_plan.md)
- **BRD Alignment**: See [brd_alignment.md](file:///C:/Users/digital%20metro/.gemini/antigravity/brain/a51cf4e9-4f1c-401c-bcf4-874b566c26ff/brd_alignment.md)

---

**Platform Status**: ✅ Production-Ready MVP  
**Version**: 1.0  
**Last Updated**: December 13, 2025
