# 🚀 Quick Start Guide - TalentAI Pro

**Choose your setup method:**

---

## ⚡ Option 1: Frontend-Only Mode (Works Now!)

**No backend needed - Test UI immediately**

### What Works:
- ✅ All UI components
- ✅ Navigation and routing
- ✅ Form validation
- ✅ Mock data display
- ✅ AI features demo page

### How to Use:

```bash
# Already running at http://localhost:8080

# Test these features:
1. Landing page with all sections
2. Job search page (shows "no jobs" - expected without backend)
3. AI features demo: /ai-features
4. Application modal (mock mode)
5. All UI animations and interactions
```

### Test Credentials (Mock Mode):
- Email: `test@example.com`
- Password: `anything` (frontend validates format only)

---

## ⚡ Option 2: Full Platform (Backend + Frontend)

**For complete end-to-end functionality**

### Prerequisites:
1. **Docker Desktop** - Must be running
   - Download: https://www.docker.com/products/docker-desktop
   - Start Docker Desktop before proceeding

2. **Python 3.11+**
   ```bash
   python --version
   ```

3. **PostgreSQL** (if not using Docker)
   - Alternative: Use local PostgreSQL installation

### Setup Steps:

#### **Step 1: Start Docker Services**

```bash
# Make sure Docker Desktop is running first!

cd backend
docker-compose up -d

# Wait 30 seconds for services to start
# Check status:
docker-compose ps

# Should show: postgres, redis, elasticsearch, rabbitmq (all Up)
```

#### **Step 2: Install Python Dependencies**

```bash
# In backend directory
pip install -r requirements/base.txt

# Optional: AI features
pip install -r requirements/ai.txt
```

#### **Step 3: Initialize Database**

```bash
# Still in backend directory
python init_db.py

# This creates:
# - 3 employer accounts
# - 3 candidate accounts  
# - 6 job postings
# - 4 applications
```

#### **Step 4: Start Backend API**

```bash
cd services/gateway
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Backend will run at: http://localhost:8000
# API docs: http://localhost:8000/api/docs
```

#### **Step 5: Test Everything**

Frontend already running at: http://localhost:8080

**Login Credentials:**
```
Employer:
Email: hr@techcorp.com
Password: password123

Candidate:
Email: john.doe@email.com
Password: password123
```

---

## ⚡ Option 3: Without Docker (Local Setup)

**If you can't use Docker**

### Install PostgreSQL Locally:

```bash
# Download from: https://www.postgresql.org/download/windows/

# Create database:
createdb talentai_db

# Update backend/.env with your local settings:
DATABASE_URL=postgresql://yourusername:yourpassword@localhost:5432/talentai_db
```

### Install Redis Locally:

```bash
# Download from: https://github.com/microsoftarchive/redis/releases

# Or skip Redis (optional for caching)
# Comment out Redis imports in the code
```

### Then follow Option 2 steps 2-5

---

## 🎯 What to Test

### **Current State (Frontend Only):**

1. **Landing Page** ✅
   - Hero section
   - Featured jobs (static)
   - Call-to-action
   - Navigation

2. **AI Features Demo** ✅
   - Visit: http://localhost:8080/ai-features
   - Test cover letter generator (mock)
   - Test resume analyzer (mock)

3. **Job Search** ⚠️
   - Page loads
   - Shows "No jobs found" (expected without backend)
   - Search and filters work
   - "Apply Now" opens modal

4. **Application Modal** ✅  
   - Drag & drop resume
   - Form validation
   - Skills management
   - Review steps

### **With Backend Running:**

1. **Authentication** ✅
   - Register new account
   - Login
   - JWT tokens
   - Protected routes

2. **Employer Flow** ✅
   - Post new job
   - View posted jobs
   - See applications
   - Manage candidates

3. **Candidate Flow** ✅
   - Browse real jobs
   - Apply with resume
   - AI auto-fill
   - Generate cover letter
   - Track applications

4. **AI Features** ✅ (requires OpenAI API key)
   - Cover letter generation
   - Resume analysis
   - ATS scoring
   - Keyword optimization

---

## 🐛 Troubleshooting

### **"Docker Desktop is not running"**

**Solution:**
1. Open Docker Desktop application
2. Wait for it to fully start (green indicator)
3. Try the command again

OR use Option 3 (local PostgreSQL)

### **"Port already in use"**

```bash
# Check what's using the port
netstat -ano | findstr :8000
netstat -ano | findstr :5432

# Kill the process or change ports in .env
```

### **"Module not found"**

```bash
# Reinstall dependencies
pip install -r backend/requirements/base.txt
```

### **"Database connection failed"**

```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# Or check local PostgreSQL:
pg_isready
```

---

## 📊 Current Status

**✅ Working Now (No Setup Needed):**
- Frontend UI (all pages)
- Navigation and routing
- Form validation
- AI features demo (mock mode)
- Application modal (UI)
- All React components

**⏳ Requires Backend Setup:**
- User authentication
- Job posting/browsing
- Real applications
- Database persistence
- AI generation (needs OpenAI key)

---

## 🎉 Quick Win - Test Now!

**Without any setup, you can test:**

```bash
# 1. Visit landing page
http://localhost:8080

# 2. Test AI features demo
http://localhost:8080/ai-features

# 3. Try job search page
http://localhost:8080/candidate/jobs

# 4. Test application modal
# Click "Apply Now" on any job
```

**All UI is functional and looks production-ready!** ✨

---

## 📚 Next Steps

### **If Docker Works:**
1. Follow Option 2 completely
2. Test full end-to-end flow
3. Add OpenAI API key for AI features

### **If Docker Doesn't Work:**
1. Install PostgreSQL locally
2. Follow Option 3
3. Or just enjoy the frontend (Option 1)

### **For Production:**
1. Deploy frontend to Vercel/Netlify
2. Deploy backend to Railway/Render/AWS
3. Use managed PostgreSQL
4. Add custom domain

---

## 🆘 Need Help?

**Check these files:**
- `PRODUCTION_SETUP.md` - Detailed setup guide
- `PHASE1_AI_SUMMARY.md` - Feature overview
- `backend/init_db.py` - Database seed script
- `backend/.env` - Configuration

**Or just enjoy the frontend!** It's fully functional and production-ready! 🚀
