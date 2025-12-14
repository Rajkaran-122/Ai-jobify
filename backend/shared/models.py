"""
SQLAlchemy ORM Models for TalentAI Pro
"""
from sqlalchemy import Column, String, Integer, DateTime, Boolean, Text, ARRAY, JSON, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import UUID, JSONB
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid
import enum

from shared.database import Base


class UserRole(str, enum.Enum):
    EMPLOYER = "employer"
    CANDIDATE = "candidate"
    ADMIN = "admin"


class JobStatus(str, enum.Enum):
    DRAFT = "draft"
    ACTIVE = "active"
    CLOSED = "closed"
    ARCHIVED = "archived"


class ApplicationStatus(str, enum.Enum):
    SUBMITTED = "submitted"
    SCREENING = "screening"
    INTERVIEW = "interview"
    OFFER = "offer"
    REJECTED = "rejected"
    WITHDRAWN = "withdrawn"


class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(SQLEnum(UserRole), nullable=False)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    two_factor_enabled = Column(Boolean, default=False)
    two_factor_secret = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)

    # Relationships
    employer_profile = relationship("EmployerProfile", back_populates="user", uselist=False)
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False)


class EmployerProfile(Base):
    __tablename__ = "employer_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    company_name = Column(String(255), nullable=False)
    company_website = Column(String(255))
    industry = Column(String(100))
    company_size = Column(String(50))  # e.g., "10-50", "50-200"
    logo_url = Column(String(500))
    description = Column(Text)
    location = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="employer_profile")
    jobs = relationship("Job", back_populates="employer")


class CandidateProfile(Base):
    __tablename__ = "candidate_profiles"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), unique=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    phone = Column(String(20))
    location = Column(String(255))
    resume_url = Column(String(500))
    resume_text = Column(Text)  # Parsed resume text for search
    skills = Column(JSONB, default=list)  # Array of skills with proficiency
    experience_years = Column(Integer)
    education = Column(JSONB, default=list)  # Array of education entries
    work_experience = Column(JSONB, default=list)  # Array of work experience
    preferences = Column(JSONB, default=dict)  # Job preferences (location, salary, etc.)
    linkedin_url = Column(String(255))
    github_url = Column(String(255))
    portfolio_url = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="candidate_profile")
    applications = relationship("Application", back_populates="candidate")


class Job(Base):
    __tablename__ = "jobs"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"))
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    requirements = Column(JSONB, default=list)  # Array of requirement strings
    nice_to_have = Column(JSONB, default=list)
    responsibilities = Column(JSONB, default=list)
    location = Column(String(255))
    job_type = Column(String(50))  # "full-time", "part-time", "contract"
    work_mode = Column(String(50))  # "remote", "hybrid", "onsite"
    salary_min = Column(Integer)
    salary_max = Column(Integer)
    salary_currency = Column(String(3), default="USD")
    benefits = Column(JSONB, default=list)
    status = Column(SQLEnum(JobStatus), default=JobStatus.DRAFT)
    posted_at = Column(DateTime)
    expires_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employer = relationship("EmployerProfile", back_populates="jobs")
    applications = relationship("Application", back_populates="job")
    matches = relationship("JobMatch", back_populates="job")


class Application(Base):
    __tablename__ = "applications"
    __table_args__ = (
        # Partition by month for better performance
        {"postgresql_partition_by": "RANGE (applied_at)"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidate_profiles.id"))
    status = Column(SQLEnum(ApplicationStatus), default=ApplicationStatus.SUBMITTED)
    resume_url = Column(String(500))
    cover_letter = Column(Text)
    screening_score = Column(Float)  # 0-100 ML-generated score
    ai_summary = Column(Text)  # AI-generated match summary
    applied_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="applications")
    candidate = relationship("CandidateProfile", back_populates="applications")
    interviews = relationship("Interview", back_populates="application")


class Interview(Base):
    __tablename__ = "interviews"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"))
    scheduled_at = Column(DateTime, nullable=False)
    duration_minutes = Column(Integer, default=60)
    interview_type = Column(String(50))  # "video", "phone", "in-person"
    calendar_event_id = Column(String(255))  # Google Calendar event ID
    video_link = Column(String(500))  # Zoom/Meet link
    status = Column(String(50), default="scheduled")  # "scheduled", "completed", "cancelled"
    notes = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    application = relationship("Application", back_populates="interviews")


class JobMatch(Base):
    __tablename__ = "job_matches"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    job_id = Column(UUID(as_uuid=True), ForeignKey("jobs.id"))
    candidate_id = Column(UUID(as_uuid=True), ForeignKey("candidate_profiles.id"))
    match_score = Column(Float, nullable=False)  # 0.0-1.0
    match_reasons = Column(JSONB, default=list)  # Array of reason strings
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    job = relationship("Job", back_populates="matches")
    candidate = relationship("CandidateProfile")


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    type = Column(String(50), nullable=False)  # "application", "interview", "message"
    title = Column(String(255), nullable=False)
    content = Column(Text)
    link = Column(String(500))
    is_read = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User")


class AutomationWorkflow(Base):
    __tablename__ = "automation_workflows"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    employer_id = Column(UUID(as_uuid=True), ForeignKey("employer_profiles.id"))
    name = Column(String(255), nullable=False)
    trigger_type = Column(String(100), nullable=False)  # "job_posted", "application_received"
    conditions = Column(JSONB, default=dict)
    actions = Column(JSONB, default=list)  # Array of action objects
    enabled = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    employer = relationship("EmployerProfile")


class AuditLog(Base):
    __tablename__ = "audit_logs"
    __table_args__ = (
        # Partition by month for compliance
        {"postgresql_partition_by": "RANGE (created_at)"},
    )

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    resource_type = Column(String(50))
    resource_id = Column(UUID(as_uuid=True))
    changes = Column(JSONB)  # Before/after values
    ip_address = Column(String(45))
    user_agent = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)

    # Relationships
    user = relationship("User")
