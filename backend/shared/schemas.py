"""
Pydantic schemas for API request/response validation
"""
from pydantic import BaseModel, EmailStr, Field, HttpUrl, UUID4
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class UserRole(str, Enum):
    EMPLOYER = "employer"
    CANDIDATE = "candidate"
    ADMIN = "admin"


class JobStatus(str, Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"


class ApplicationStatus(str, Enum):
    SUBMITTED = "submitted"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


# User Schemas
class UserBase(BaseModel):
    email: EmailStr
    role: UserRole


class UserCreate(UserBase):
    password: str = Field(..., min_length=8)


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserResponse(UserBase):
    id: UUID4
    is_active: bool
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


# Employer Profile Schemas
class EmployerProfileBase(BaseModel):
    company_name: str = Field(..., min_length=1, max_length=255)
    company_website: Optional[HttpUrl] = None
    industry: Optional[str] = None
    company_size: Optional[str] = None
    description: Optional[str] = None
    location: Optional[str] = None


class EmployerProfileCreate(EmployerProfileBase):
    pass


class EmployerProfileResponse(EmployerProfileBase):
    id: UUID4
    user_id: UUID4
    logo_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Candidate Profile Schemas
class CandidateProfileBase(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    skills: Optional[List[Dict[str, Any]]] = []
    experience_years: Optional[int] = None
    education: Optional[List[Dict[str, Any]]] = []
    work_experience: Optional[List[Dict[str, Any]]] = []
    preferences: Optional[Dict[str, Any]] = {}


class CandidateProfileCreate(CandidateProfileBase):
    pass


class CandidateProfileResponse(CandidateProfileBase):
    id: UUID4
    user_id: UUID4
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Job Schemas
class JobBase(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: str = Field(..., min_length=10)
    requirements: List[str] = []
    nice_to_have: List[str] = []
    responsibilities: List[str] = []
    location: Optional[str] = None
    job_type: Optional[str] = None
    work_mode: Optional[str] = None
    salary_min: Optional[int] = None
    salary_max: Optional[int] = None
    salary_currency: str = "USD"
    benefits: List[str] = []


class JobCreate(JobBase):
    pass


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[JobStatus] = None
    # ... other optional fields


class JobResponse(JobBase):
    id: UUID4
    employer_id: UUID4
    status: JobStatus
    posted_at: Optional[datetime] = None
    expires_at: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Application Schemas
class ApplicationBase(BaseModel):
    cover_letter: Optional[str] = None


class ApplicationCreate(ApplicationBase):
    job_id: UUID4


class ApplicationResponse(ApplicationBase):
    id: UUID4
    job_id: UUID4
    candidate_id: UUID4
    status: ApplicationStatus
    screening_score: Optional[float] = None
    ai_summary: Optional[str] = None
    applied_at: datetime

    class Config:
        from_attributes = True


# Interview Schemas
class InterviewBase(BaseModel):
    scheduled_at: datetime
    duration_minutes: int = 60
    interview_type: str


class InterviewCreate(InterviewBase):
    application_id: UUID4


class InterviewResponse(InterviewBase):
    id: UUID4
    application_id: UUID4
    calendar_event_id: Optional[str] = None
    video_link: Optional[str] = None
    status: str

    class Config:
        from_attributes = True


# Job Match Schemas
class JobMatchResponse(BaseModel):
    id: UUID4
    job_id: UUID4
    candidate_id: UUID4
    match_score: float
    match_reasons: List[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Resume Parsing Schemas
class ResumeParseRequest(BaseModel):
    resume_url: str
    candidate_id: Optional[UUID4] = None


class ResumeParseResponse(BaseModel):
    personal: Dict[str, Any]
    education: List[Dict[str, Any]]
    experience: List[Dict[str, Any]]
    skills: List[str]
    confidence_score: float


# Pagination
class PaginationParams(BaseModel):
    skip: int = Field(0, ge=0)
    limit: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    total: int
    items: List[Any]
    page: int
    pages: int
