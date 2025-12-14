"""
FastAPI Gateway Service - Main API entry point for TalentAI Pro
"""
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from typing import List, Optional
import os
from dotenv import load_dotenv

from shared.database import get_db, engine, Base
from shared import models, schemas
from shared.auth import (
    verify_password, get_password_hash,
    create_access_token, create_refresh_token, decode_token
)

# Import AI features router
try:
    from api.v1.ai_features import router as ai_router
    AI_FEATURES_AVAILABLE = True
except ImportError:
    AI_FEATURES_AVAILABLE = False
    print("Warning: AI features not available. Install requirements/ai.txt dependencies.")

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="TalentAI Pro API",
    description="AI-Powered Job Platform with Intelligent Automation",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "http://localhost:8080"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register AI features router
if AI_FEATURES_AVAILABLE:
    app.include_router(ai_router, prefix="/api/v1")
    print("✅ AI Features enabled")
else:
    print("⚠️  AI Features disabled - set OPENAI_API_KEY to enable")

security = HTTPBearer()


# Dependency to get current user from JWT token
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    token = credentials.credentials
    payload = decode_token(token)
    
    if payload is None or payload.get("type") != "access":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    return user


# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "api-gateway", "version": "1.0.0"}


# ==================== Authentication Endpoints ====================

@app.post("/api/v1/auth/register", response_model=schemas.UserResponse, status_code=status.HTTP_201_CREATED)
async def register(user_data: schemas.UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    existing_user = db.query(models.User).filter(models.User.email == user_data.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    new_user = models.User(
        email=user_data.email,
        password_hash=hashed_password,
        role=user_data.role
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create corresponding profile based on role
    if user_data.role == models.UserRole.EMPLOYER:
        employer_profile = models.EmployerProfile(
            user_id=new_user.id,
            company_name="",  # To be filled later
        )
        db.add(employer_profile)
    elif user_data.role == models.UserRole.CANDIDATE:
        candidate_profile = models.CandidateProfile(
            user_id=new_user.id
        )
        db.add(candidate_profile)
    
    db.commit()
    
    return new_user


@app.post("/api/v1/auth/login", response_model=schemas.Token)
async def login(credentials: schemas.UserLogin, db: Session = Depends(get_db)):
    """Login and get access token"""
    user = db.query(models.User).filter(models.User.email == credentials.email).first()
    
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is deactivated"
        )
    
    # Generate tokens
    access_token = create_access_token(data={"sub": str(user.id), "role": user.role.value})
    refresh_token = create_refresh_token(data={"sub": str(user.id)})
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer"
    }


@app.get("/api/v1/auth/me", response_model=schemas.UserResponse)
async def get_current_user_info(current_user: models.User = Depends(get_current_user)):
    """Get current user information"""
    return current_user


# ==================== Job Endpoints ====================

@app.post("/api/v1/jobs", response_model=schemas.JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(
    job_data: schemas.JobCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new job posting (employers only)"""
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can post jobs"
        )
    
    employer_profile = db.query(models.EmployerProfile).filter(
        models.EmployerProfile.user_id == current_user.id
    ).first()
    
    if not employer_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Employer profile not found"
        )
    
    new_job = models.Job(
        employer_id=employer_profile.id,
        **job_data.dict()
    )
    
    db.add(new_job)
    db.commit()
    db.refresh(new_job)
    
    return new_job


@app.get("/api/v1/jobs", response_model=List[schemas.JobResponse])
async def list_jobs(
    skip: int = 0,
    limit: int = 20,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """List all active job postings"""
    query = db.query(models.Job)
    
    if status:
        query = query.filter(models.Job.status == status)
    else:
        query = query.filter(models.Job.status == models.JobStatus.ACTIVE)
    
    jobs = query.offset(skip).limit(limit).all()
    return jobs


@app.get("/api/v1/jobs/{job_id}", response_model=schemas.JobResponse)
async def get_job(job_id: str, db: Session = Depends(get_db)):
    """Get job details by ID"""
    job = db.query(models.Job).filter(models.Job.id == job_id).first()
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    return job


# ==================== Application Endpoints ====================

@app.post("/api/v1/applications", response_model=schemas.ApplicationResponse, status_code=status.HTTP_201_CREATED)
async def create_application(
    application_data: schemas.ApplicationCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Apply to a job (candidates only)"""
    if current_user.role != models.UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can apply to jobs"
        )
    
    candidate_profile = db.query(models.CandidateProfile).filter(
        models.CandidateProfile.user_id == current_user.id
    ).first()
    
    if not candidate_profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Candidate profile not found"
        )
    
    # Check if job exists
    job = db.query(models.Job).filter(models.Job.id == application_data.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Check for duplicate application
    existing_application = db.query(models.Application).filter(
        models.Application.job_id == application_data.job_id,
        models.Application.candidate_id == candidate_profile.id
    ).first()
    
    if existing_application:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You have already applied to this job"
        )
    
    new_application = models.Application(
        job_id=application_data.job_id,
        candidate_id=candidate_profile.id,
        cover_letter=application_data.cover_letter,
        resume_url=candidate_profile.resume_url
    )
    
    db.add(new_application)
    db.commit()
    db.refresh(new_application)
    
    # TODO: Trigger automated screening workflow via Celery
    
    return new_application


@app.get("/api/v1/applications", response_model=List[schemas.ApplicationResponse])
async def list_applications(
    job_id: Optional[str] = None,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """List applications (filtered by user role)"""
    if current_user.role == models.UserRole.CANDIDATE:
        # Candidates see their own applications
        candidate_profile = db.query(models.CandidateProfile).filter(
            models.CandidateProfile.user_id == current_user.id
        ).first()
        
        if not candidate_profile:
            return []
        
        query = db.query(models.Application).filter(
            models.Application.candidate_id == candidate_profile.id
        )
    
    elif current_user.role == models.UserRole.EMPLOYER:
        # Employers see applications to their jobs
        employer_profile = db.query(models.EmployerProfile).filter(
            models.EmployerProfile.user_id == current_user.id
        ).first()
        
        if not employer_profile:
            return []
        
        job_ids = db.query(models.Job.id).filter(
            models.Job.employer_id == employer_profile.id
        ).subquery()
        
        query = db.query(models.Application).filter(
            models.Application.job_id.in_(job_ids)
        )
        
        if job_id:
            query = query.filter(models.Application.job_id == job_id)
    else:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Unauthorized"
        )
    
    applications = query.all()
    return applications


# ==================== Candidate Profile Endpoints ====================

@app.get("/api/v1/candidates/me", response_model=schemas.CandidateProfileResponse)
async def get_my_candidate_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's candidate profile"""
    if current_user.role != models.UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )
    
    profile = db.query(models.CandidateProfile).filter(
        models.CandidateProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )
    
    return profile


@app.put("/api/v1/candidates/me", response_model=schemas.CandidateProfileResponse)
async def update_my_candidate_profile(
    profile_data: schemas.CandidateProfileCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's candidate profile"""
    if current_user.role != models.UserRole.CANDIDATE:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only candidates can access this endpoint"
        )
    
    profile = db.query(models.CandidateProfile).filter(
        models.CandidateProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Candidate profile not found"
        )
    
    # Update profile fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


# ==================== Employer Profile Endpoints ====================

@app.get("/api/v1/employers/me", response_model=schemas.EmployerProfileResponse)
async def get_my_employer_profile(
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get current user's employer profile"""
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access this endpoint"
        )
    
    profile = db.query(models.EmployerProfile).filter(
        models.EmployerProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found"
        )
    
    return profile


@app.put("/api/v1/employers/me", response_model=schemas.EmployerProfileResponse)
async def update_my_employer_profile(
    profile_data: schemas.EmployerProfileCreate,
    current_user: models.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update current user's employer profile"""
    if current_user.role != models.UserRole.EMPLOYER:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only employers can access this endpoint"
        )
    
    profile = db.query(models.EmployerProfile).filter(
        models.EmployerProfile.user_id == current_user.id
    ).first()
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Employer profile not found"
        )
    
    # Update profile fields
    for field, value in profile_data.dict(exclude_unset=True).items():
        setattr(profile, field, value)
    
    db.commit()
    db.refresh(profile)
    
    return profile


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
