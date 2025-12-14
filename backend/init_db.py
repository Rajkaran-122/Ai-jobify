"""
Database initialization and seed data for TalentAI Pro

Creates sample users, employers, candidates, jobs, and applications
for testing and demonstration purposes.
"""

from datetime import datetime, timedelta
from sqlalchemy.orm import Session
import sys
import os

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from shared.database import engine, SessionLocal, Base
from shared.models import (
    User, UserRole, EmployerProfile, CandidateProfile, Job, JobStatus,
    JobType, WorkMode, Application, ApplicationStatus
)
from shared.auth import get_password_hash


def drop_all_tables():
    """Drop all existing tables"""
    Base.metadata.drop_all(bind=engine)
    print("✓ Dropped all existing tables")


def create_all_tables():
    """Create all tables"""
    Base.metadata.create_all(bind=engine)
    print("✓ Created all tables")


def create_seed_data(db: Session):
    """Create seed data for testing"""
    
    print("\n📊 Creating seed data...")
    
    # Create Employers
    employers_data = [
        {
            "email": "hr@techcorp.com",
            "password": "password123",
            "role": UserRole.EMPLOYER,
            "company_name": "TechCorp Inc.",
            "company_description": "Leading technology company specializing in AI and cloud solutions",
            "company_website": "https://techcorp.com",
            "company_size": "500-1000",
            "industry": "Technology",
            "location": "San Francisco, CA"
        },
        {
            "email": "careers@innovateai.com",
            "password": "password123",
            "role": UserRole.EMPLOYER,
            "company_name": "InnovateAI",
            "company_description": "AI-first startup building the future of machine learning",
            "company_website": "https://innovateai.com",
            "company_size": "50-200",
            "industry": "Artificial Intelligence",
            "location": "New York, NY"
        },
        {
            "email": "jobs@cloudbase.io",
            "password": "password123",
            "role": UserRole.EMPLOYER,
            "company_name": "CloudBase Solutions",
            "company_description": "Cloud infrastructure and DevOps consulting firm",
            "company_website": "https://cloudbase.io",
            "company_size": "200-500",
            "industry": "Cloud Computing",
            "location": "Austin, TX"
        }
    ]
    
    employers = []
    for emp_data in employers_data:
        # Create user
        user = User(
            email=emp_data["email"],
            password_hash=get_password_hash(emp_data["password"]),
            role=emp_data["role"],
            is_active=True
        )
        db.add(user)
        db.flush()
        
        # Create employer profile
        employer = EmployerProfile(
            user_id=user.id,
            company_name=emp_data["company_name"],
            company_description=emp_data["company_description"],
            company_website=emp_data["company_website"],
            company_size=emp_data["company_size"],
            industry=emp_data["industry"],
            location=emp_data["location"]
        )
        db.add(employer)
        employers.append(employer)
        print(f"✓ Created employer: {emp_data['company_name']}")
    
    db.flush()
    
    # Create Candidates
    candidates_data = [
        {
            "email": "john.doe@email.com",
            "password": "password123",
            "role": UserRole.CANDIDATE,
            "first_name": "John",
            "last_name": "Doe",
            "phone": "+1 (555) 123-4567",
            "location": "San Francisco, CA",
            "skills": ["Python", "FastAPI", "React", "PostgreSQL", "Docker", "AWS"],
            "experience_years": 5,
            "education": "BS Computer Science - Stanford University (2018)",
            "bio": "Full-stack developer with 5+ years of experience building scalable web applications"
        },
        {
            "email": "jane.smith@email.com",
            "password": "password123",
            "role": UserRole.CANDIDATE,
            "first_name": "Jane",
            "last_name": "Smith",
            "phone": "+1 (555) 234-5678",
            "location": "New York, NY",
            "skills": ["Machine Learning", "Python", "TensorFlow", "PyTorch", "NLP", "Deep Learning"],
            "experience_years": 3,
            "education": "MS Data Science - MIT (2020)",
            "bio": "AI/ML engineer passionate about building intelligent systems"
        },
        {
            "email": "mike.wilson@email.com",
            "password": "password123",
            "role": UserRole.CANDIDATE,
            "first_name": "Mike",
            "last_name": "Wilson",
            "phone": "+1 (555) 345-6789",
            "location": "Austin, TX",
            "skills": ["DevOps", "Kubernetes", "Docker", "AWS", "Terraform", "CI/CD"],
            "experience_years": 7,
            "education": "BS Engineering - University of Texas (2015)",
            "bio": "DevOps engineer with expertise in cloud infrastructure and automation"
        }
    ]
    
    candidates = []
    for cand_data in candidates_data:
        # Create user
        user = User(
            email=cand_data["email"],
            password_hash=get_password_hash(cand_data["password"]),
            role=cand_data["role"],
            is_active=True
        )
        db.add(user)
        db.flush()
        
        # Create candidate profile
        candidate = CandidateProfile(
            user_id=user.id,
            first_name=cand_data["first_name"],
            last_name=cand_data["last_name"],
            phone=cand_data["phone"],
            location=cand_data["location"],
            skills=cand_data["skills"],
            experience_years=cand_data["experience_years"],
            education=cand_data["education"],
            bio=cand_data["bio"]
        )
        db.add(candidate)
        candidates.append(candidate)
        print(f"✓ Created candidate: {cand_data['first_name']} {cand_data['last_name']}")
    
    db.flush()
    
    # Create Jobs
    jobs_data = [
        {
            "employer": employers[0],  # TechCorp
            "title": "Senior Python Developer",
            "description": "We're looking for an experienced Python developer to join our backend team. You'll be working on building scalable APIs and microservices.",
            "requirements": "5+ years Python, FastAPI/Django, PostgreSQL, Docker, AWS",
            "responsibilities": "Design and build REST APIs, optimize database queries, mentor junior developers, participate in code reviews",
            "location": "San Francisco, CA",
            "work_mode": WorkMode.HYBRID,
            "job_type": JobType.FULL_TIME,
            "salary_min": 120000,
            "salary_max": 180000,
            "currency": "USD",
            "skills_required": ["Python", "FastAPI", "PostgreSQL", "Docker", "AWS"],
            "experience_level": "Senior",
            "status": JobStatus.ACTIVE
        },
        {
            "employer": employers[0],  # TechCorp
            "title": "React Frontend Developer",
            "description": "Join our frontend team to build beautiful, responsive user interfaces for our SaaS platform.",
            "requirements": "3+ years React, TypeScript, TailwindCSS, responsive design",
            "responsibilities": "Build reusable components, implement responsive designs, optimize performance, collaborate with designers",
            "location": "San Francisco, CA",
            "work_mode": WorkMode.REMOTE,
            "job_type": JobType.FULL_TIME,
            "salary_min": 100000,
            "salary_max": 150000,
            "currency": "USD",
            "skills_required": ["React", "TypeScript", "TailwindCSS", "JavaScript"],
            "experience_level": "Mid-level",
            "status": JobStatus.ACTIVE
        },
        {
            "employer": employers[1],  # InnovateAI
            "title": "Machine Learning Engineer",
            "description": "Build cutting-edge ML models and deploy them at scale. Work on computer vision, NLP, and recommendation systems.",
            "requirements": "3+ years ML experience, Python, TensorFlow/PyTorch, Deep Learning",
            "responsibilities": "Train and deploy ML models, optimize model performance, research new techniques, collaborate with data scientists",
            "location": "New York, NY",
            "work_mode": WorkMode.HYBRID,
            "job_type": JobType.FULL_TIME,
            "salary_min": 130000,
            "salary_max": 200000,
            "currency": "USD",
            "skills_required": ["Machine Learning", "Python", "TensorFlow", "PyTorch", "Deep Learning"],
            "experience_level": "Mid-level",
            "status": JobStatus.ACTIVE
        },
        {
            "employer": employers[1],  # InnovateAI
            "title": "AI Research Scientist",
            "description": "Join our research team to push the boundaries of AI. Work on novel algorithms and publish papers.",
            "requirements": "PhD in CS/AI, publications in top conferences, strong math background",
            "responsibilities": "Conduct research, publish papers, implement novel algorithms, mentor team members",
            "location": "New York, NY",
            "work_mode": WorkMode.ONSITE,
            "job_type": JobType.FULL_TIME,
            "salary_min": 150000,
            "salary_max": 250000,
            "currency": "USD",
            "skills_required": ["AI Research", "Machine Learning", "Deep Learning", "Mathematics"],
            "experience_level": "Senior",
            "status": JobStatus.ACTIVE
        },
        {
            "employer": employers[2],  # CloudBase
            "title": "DevOps Engineer",
            "description": "Build and maintain our cloud infrastructure. Automate everything and ensure 99.9% uptime.",
            "requirements": "5+ years DevOps, Kubernetes, AWS, Terraform, CI/CD pipelines",
            "responsibilities": "Manage cloud infrastructure, implement CI/CD, monitor systems, optimize costs, on-call rotation",
            "location": "Austin, TX",
            "work_mode": WorkMode.REMOTE,
            "job_type": JobType.FULL_TIME,
            "salary_min": 110000,
            "salary_max": 170000,
            "currency": "USD",
            "skills_required": ["DevOps", "Kubernetes", "AWS", "Terraform", "Docker"],
            "experience_level": "Senior",
            "status": JobStatus.ACTIVE
        },
        {
            "employer": employers[2],  # CloudBase
            "title": "Cloud Solutions Architect",
            "description": "Design cloud architectures for enterprise clients. Work with AWS, Azure, and GCP.",
            "requirements": "7+ years experience, AWS/Azure certifications, microservices architecture",
            "responsibilities": "Design solutions, work with clients, create architecture diagrams, ensure best practices",
            "location": "Remote",
            "work_mode": WorkMode.REMOTE,
            "job_type": JobType.CONTRACT,
            "salary_min": 140000,
            "salary_max": 200000,
            "currency": "USD",
            "skills_required": ["AWS", "Azure", "Cloud Architecture", "Microservices"],
            "experience_level": "Senior",
            "status": JobStatus.ACTIVE
        }
    ]
    
    jobs = []
    for job_data in jobs_data:
        employer = job_data.pop("employer")
        job = Job(
            employer_id=employer.id,
            **job_data,
            posted_date=datetime.now() - timedelta(days=5)
        )
        db.add(job)
        jobs.append(job)
        print(f"✓ Created job: {job.title} at {employer.company_name}")
    
    db.flush()
    
    # Create some applications
    applications_data = [
        {
            "candidate": candidates[0],  # John Doe
            "job": jobs[0],  # Senior Python Developer
            "cover_letter": "I'm excited to apply for the Senior Python Developer position...",
            "status": ApplicationStatus.APPLIED
        },
        {
            "candidate": candidates[0],  # John Doe
            "job": jobs[4],  # DevOps Engineer
            "cover_letter": "With my experience in Python and AWS...",
            "status": ApplicationStatus.REVIEWING
        },
        {
            "candidate": candidates[1],  # Jane Smith
            "job": jobs[2],  # ML Engineer
            "cover_letter": "As a Machine Learning engineer with 3 years of experience...",
            "status": ApplicationStatus.APPLIED
        },
        {
            "candidate": candidates[2],  # Mike Wilson
            "job": jobs[4],  # DevOps Engineer
            "cover_letter": "I'm passionate about DevOps and cloud infrastructure...",
            "status": ApplicationStatus.INTERVIEW
        }
    ]
    
    for app_data in applications_data:
        candidate = app_data["candidate"]
        job = app_data["job"]
        application = Application(
            candidate_id=candidate.id,
            job_id=job.id,
            cover_letter=app_data["cover_letter"],
            status=app_data["status"],
            resume_url=f"/resumes/{candidate.first_name.lower()}_resume.pdf"
        )
        db.add(application)
        print(f"✓ Created application: {candidate.first_name} → {job.title}")
    
    db.commit()
    print("\n✅ Seed data created successfully!")


def print_credentials():
    """Print login credentials"""
    print("\n" + "="*60)
    print("🔐 LOGIN CREDENTIALS")
    print("="*60)
    
    print("\n👔 EMPLOYERS:")
    print("-" * 60)
    print("Email: hr@techcorp.com")
    print("Password: password123")
    print("Company: TechCorp Inc.")
    print()
    print("Email: careers@innovateai.com")
    print("Password: password123")
    print("Company: InnovateAI")
    print()
    print("Email: jobs@cloudbase.io")
    print("Password: password123")
    print("Company: CloudBase Solutions")
    
    print("\n💼 CANDIDATES:")
    print("-" * 60)
    print("Email: john.doe@email.com")
    print("Password: password123")
    print("Name: John Doe (Senior Python Developer)")
    print()
    print("Email: jane.smith@email.com")
    print("Password: password123")
    print("Name: Jane Smith (ML Engineer)")
    print()
    print("Email: mike.wilson@email.com")
    print("Password: password123")
    print("Name: Mike Wilson (DevOps Engineer)")
    
    print("\n" + "="*60)
    print("🌐 ACCESS URLS")
    print("="*60)
    print("Frontend: http://localhost:8080")
    print("Backend API: http://localhost:8000")
    print("API Docs: http://localhost:8000/api/docs")
    print("="*60 + "\n")


def main():
    """Main function"""
    print("\n🚀 Initializing TalentAI Pro Database...")
    print("="*60)
    
    # Drop and recreate tables
    drop_all_tables()
    create_all_tables()
    
    # Create seed data
    db = SessionLocal()
    try:
        create_seed_data(db)
        print_credentials()
        
        print("\n✨ Database initialization complete!")
        print("\n📝 Next steps:")
        print("1. Start backend: cd backend/services/gateway && uvicorn main:app --reload")
        print("2. Frontend is already running at http://localhost:8080")
        print("3. Login with any of the credentials above")
        print("4. Test the platform!\n")
        
    except Exception as e:
        print(f"\n❌ Error: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
