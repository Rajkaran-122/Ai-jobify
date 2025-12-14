# 🚀 TalentAI Pro - Production Setup Guide

**Last Updated:** December 13, 2025  
**Status:** Production-Ready ✅

---

## ⚡ Quick Start (5 Minutes)

### **Option 1: Automated Setup (Recommended)**

```bash
# Run the automated setup script
QUICKSTART.bat

# That's it! The platform will:
# ✅ Start Docker services
# ✅ Install dependencies
# ✅ Initialize database with seed data
# ✅ Start backend API
# ✅ Open frontend automatically
```

### **Option 2: Manual Setup**

```bash
# 1. Start Docker services
cd backend
docker-compose up -d

# 2. Wait for services (30 seconds)
# Check status: docker-compose ps

# 3. Install Python dependencies
pip install -r requirements/base.txt
pip install -r requirements/ai.txt  # Optional, for AI features

# 4. Initialize database
python init_db.py

# 5. Start backend
cd services/gateway
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# 6. Frontend (already running)
# Visit: http://localhost:8080
```

---

## 🔐 Login Credentials

### **Employers (Can Post Jobs)**

```
Company: TechCorp Inc.
Email: hr@techcorp.com
Password: password123
Jobs: 2 active postings
```

```
Company: InnovateAI
Email: careers@innovateai.com
Password: password123
Jobs: 2 active postings
```

```
Company: CloudBase Solutions
Email: jobs@cloudbase.io
Password: password123
Jobs: 2 active postings
```

### **Candidates (Can Apply)**

```
Name: John Doe
Email: john.doe@email.com
Password: password123
Skills: Python, FastAPI, React, PostgreSQL
Applications: 2 submitted
```

```
Name: Jane Smith
Email: jane.smith@email.com
Password: password123
Skills: Machine Learning, Python, TensorFlow
Applications: 1 submitted
```

```
Name: Mike Wilson
Email: mike.wilson@email.com
Password: password123
Skills: DevOps, Kubernetes, AWS
Applications: 1 submitted
```

---

## 🎯 What's Included

### **Seed Data Created:**

- ✅ **3 Employer Accounts** (with company profiles)
- ✅ **3 Candidate Accounts** (with skills & experience)
- ✅ **6 Active Job Postings** (various roles & locations)
- ✅ **4 Job Applications** (realistic application flow)

### **Job Postings:**

1. **Senior Python Developer** - TechCorp ($120k-$180k, Hybrid, SF)
2. **React Frontend Developer** - TechCorp ($100k-$150k, Remote)
3. **Machine Learning Engineer** - InnovateAI ($130k-$200k, Hybrid, NY)
4. **AI Research Scientist** - InnovateAI ($150k-$250k, Onsite, NY)
5. **DevOps Engineer** - CloudBase ($110k-$170k, Remote)
6. **Cloud Solutions Architect** - CloudBase ($140k-$200k, Remote)

---

## ✨ Features Working End-to-End

### **Employer Features:**

- ✅ **Create Account & Login**
- ✅ **Post New Jobs** (complete form with validation)
- ✅ **View Posted Jobs** (dashboard)
- ✅ **Manage Applications** (review candidates)
- ✅ **Company Profile** (edit company info)
- ✅ **View Applicants** (with resume & details)
- ✅ **Update Job Status** (active/closed)

### **Candidate Features:**

- ✅ **Create Account & Login**
- ✅ **Browse Jobs** (search & filter)
- ✅ **Apply for Jobs** (smart application modal)
- ✅ **Upload Resume** (AI auto-fills application)
- ✅ **Generate Cover Letter** (AI-powered)
- ✅ **Manage Profile** (skills, experience, education)
- ✅ **View Applications** (track status)
- ✅ **Resume Analysis** (ATS scoring)
- ✅ **AI Features Demo** (test AI capabilities)

### **AI Features:**

- ✅ **Cover Letter Generator** (GPT-4 powered)
- ✅ **Resume Analyzer** (ATS compatibility)
- ✅ **Smart Application** (AI auto-fill)
- ✅ **Keyword Optimization** (job matching)
- ✅ **Gap Analysis** (skill recommendations)

---

## 📍 Access URLs

```
Frontend:        http://localhost:8080
Backend API:     http://localhost:8000
API Docs:        http://localhost:8000/api/docs
RabbitMQ UI:     http://localhost:15672 (guest/guest)
```

---

## 🧪 Testing Workflows

### **Test 1: Employer Posts Job, Candidate Applies**

```
1. Login as employer (hr@techcorp.com)
2. Click "Post New Job"
3. Fill job details
4. Submit job posting
5. Logout

6. Login as candidate (john.doe@email.com)
7. Browse jobs
8. Find the new job
9. Click "Apply Now"
10. Upload resume (AI auto-fills)
11. Generate cover letter (AI)
12. Review and submit
13. Logout

14. Login back as employer
15. View applications
16. See John's application
✅ Complete!
```

### **Test 2: AI Features**

```
1. Visit http://localhost:8080/ai-features
2. Test Cover Letter Generator
   - Select tone
   - Generate letter
   - Edit and download
3. Test Resume Analyzer
   - Upload resume
   - See ATS score
   - Read AI suggestions
✅ AI Working!
```

### **Test 3: End-to-End Flow**

```
1. Register new candidate account
2. Complete profile
3. Upload resume
4. Browse 6 jobs
5. Apply to multiple jobs
6. Check application status
7. Update profile
8. Re-analyze resume
✅ Platform Working!
```

---

## 🔧 Troubleshooting

### **Backend Not Starting:**

```bash
# Check if Docker services are running
docker-compose ps

# Should see: postgres, redis, elasticsearch, rabbitmq (all healthy)

# If not, restart:
docker-compose down
docker-compose up -d

# Wait 30 seconds, then check again
```

### **Database Connection Error:**

```bash
# Reinitialize database
python backend/init_db.py

# This will:
# - Drop all tables
# - Recreate schema
# - Load seed data
```

### **Frontend Not Loading Data:**

```bash
# 1. Check backend is running
curl http://localhost:8000/api/docs

# 2. Check CORS is configured
# backend/.env should have:
CORS_ORIGINS=http://localhost:8080

# 3. Restart backend
```

### **AI Features Not Working:**

```bash
# Set OpenAI API key
# Edit backend/.env and add:
OPENAI_API_KEY=sk-your-actual-key

# Then restart backend
```

---

## ⚙️ Configuration

### **Environment Variables:**

All configuration in `backend/.env`:

```bash
# Database
DATABASE_URL=postgresql://talentai:talentai123@localhost:5432/talentai_db

# Redis
REDIS_URL=redis://localhost:6379/0

# AI (Optional)
OPENAI_API_KEY=sk-your-key  # Get from platform.openai.com

# Features
ENABLE_AI_FEATURES=true
ENABLE_RESUME_PARSING=true
ENABLE_JOB_MATCHING=true
```

### **Docker Services:**

```yaml
postgres:     Port 5432
redis:        Port 6379
elasticsearch: Port 9200
rabbitmq:     Port 5672, Management UI: 15672
```

---

## 📊 Database Schema

### **Tables Created:**

```
✅ users              (authentication)
✅ employer_profiles  (company info)
✅ candidate_profiles (user profiles)
✅ jobs               (job postings)
✅ applications       (job applications)
✅ matches            (AI matching)
✅ interviews         (scheduled interviews)
✅ notifications      (user notifications)
```

### **Relationships:**

```
User → EmployerProfile (1:1)
User → CandidateProfile (1:1)
EmployerProfile → Jobs (1:Many)
CandidateProfile → Applications (1:Many)
Job → Applications (1:Many)
```

---

## 🚀 Next Steps

### **For Development:**

1. **Add More Jobs:**
   - Login as employer
   - Post jobs via UI
   - Test different job types

2. **Test Applications:**
   - Create more candidate accounts
   - Apply with different resumes
   - Test flow variations

3. **Enable AI:**
   - Get OpenAI API key
   - Set in `.env`
   - Test AI features

### **For Production:**

1. **Change Secrets:**
   ```bash
   SECRET_KEY=your-production-secret
   DB_PASSWORD=strong-password
   ```

2. **Set Up Domain:**
   ```bash
   CORS_ORIGINS=https://yourdomain.com
   ```

3. **Configure Email:**
   ```bash
   SMTP_HOST=your-smtp-server
   SMTP_USER=your-email
   ```

4. **Deploy:**
   - Backend: Deploy FastAPI to cloud
   - Frontend: Build `npm run build`
   - Database: Use managed PostgreSQL

---

## 📚 API Documentation

**Swagger UI:** http://localhost:8000/api/docs

### **Key Endpoints:**

```
Authentication:
POST   /api/v1/auth/register
POST   /api/v1/auth/login
GET    /api/v1/auth/me

Jobs:
GET    /api/v1/jobs
POST   /api/v1/jobs
GET    /api/v1/jobs/{id}
PUT    /api/v1/jobs/{id}
DELETE /api/v1/jobs/{id}

Applications:
GET    /api/v1/applications
POST   /api/v1/applications
GET    /api/v1/applications/{id}

Profiles:
GET    /api/v1/candidates/me
PUT    /api/v1/candidates/me
GET    /api/v1/employers/me
PUT    /api/v1/employers/me

AI Features:
POST   /api/v1/ai/generate-cover-letter
POST   /api/v1/ai/analyze-resume
POST   /api/v1/ai/optimize-keywords
GET    /api/v1/ai/usage-stats
```

---

## 🎉 Success Checklist

- [x] Docker services running
- [x] Database initialized with seed data
- [x] Backend API responding
- [x] Frontend loading
- [x] Can login as employer
- [x] Can login as candidate
- [x] Can post jobs
- [x] Can apply for jobs
- [x] Can upload resume
- [x] AI features accessible
- [x] Applications tracked
- [x] All features working

---

## 💡 Pro Tips

1. **Use Seed Data:**
   - Don't create test accounts manually
   - Use provided login credentials
   - Seed data has realistic relationships

2. **Test AI Last:**
   - Core features work without AI
   - AI requires API key & costs money
   - Test basic flow first

3. **Watch Logs:**
   ```bash
   # Backend logs
   docker-compose logs -f
   
   # API logs (in terminal where uvicorn runs)
   ```

4. **Reset Database:**
   ```bash
   # Quick reset
   python backend/init_db.py
   
   # This recreates everything
   ```

---

## 📞 Support

**Issues?**
- Check troubleshooting section above
- Review logs for errors
- Ensure all Docker services are healthy
- Verify environment variables

**Documentation:**
- `PHASE1_AI_SUMMARY.md` - Complete feature list
- `AI_PHASE1_COMPLETE.md` - AI features guide
- `SMART_APPLICATION_COMPLETE.md` - Application flow
- `walkthrough.md` - Technical walkthrough

---

🎊 **Platform Ready! Start testing with realistic data!** 🚀

**Quick Test:** Login as `hr@techcorp.com` / `password123` to see employer dashboard with real jobs!
