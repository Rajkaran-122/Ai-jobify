"""
AI Features API Endpoints

Provides REST API access to AI-powered features:
- Cover letter generation
- Resume analysis
- ATS compatibility scoring
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import BaseModel

from ...database import get_db
from ...core.dependencies import get_current_user
from ...models.user import User
from ...models.job import Job
from ...models.application import Application
from ...ai.cover_letter_generator import CoverLetterGenerator
from ...ai.resume_analyzer import EnhancedResumeAnalyzer

router = APIRouter(prefix="/ai", tags=["AI Features"])

# Initialize AI services
cover_letter_gen = CoverLetterGenerator()
resume_analyzer = EnhancedResumeAnalyzer()


# Request/Response Models
class GenerateCoverLetterRequest(BaseModel):
    """Request to generate cover letter"""
    job_id: int
    tone: str = "professional"  # professional, enthusiastic, concise
    custom_points: Optional[List[str]] = None

class GenerateCoverLetterResponse(BaseModel):
    """Cover letter generation response"""
    cover_letter: str
    key_points_highlighted: List[str]
    tone_used: str
    word_count: int
    suggestions: List[str]

class AnalyzeResumeRequest(BaseModel):
    """Request to analyze resume"""
    resume_text: Optional[str] = None  # Or get from user's saved resume
    target_job_id: Optional[int] = None

class ATSScoreResponse(BaseModel):
    """ATS compatibility score"""
    overall_score: int
    formatting_score: int
    content_score: int
    keyword_score: int
    issues: List[str]
    strengths: List[str]
    recommendations: List[str]

class ResumeAnalysisResponse(BaseModel):
    """Complete resume analysis"""
    overall_quality_score: int
    ats_compatibility: ATSScoreResponse
    strengths: List[str]
    areas_for_improvement: List[str]
    suggestions: List[dict]
    keyword_optimization: dict


# Endpoints

@router.post("/generate-cover-letter", response_model=GenerateCoverLetterResponse)
async def generate_cover_letter(
    request: GenerateCoverLetterRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Generate AI-powered cover letter for a job
    
    Creates a personalized, professional cover letter based on:
    - User's profile and experience
    - Job requirements and description
    - Company culture and values
    - Selected tone
    """
    # Get job details
    job = db.query(Job).filter(Job.id == request.job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # Get user profile data
    user_profile = {
        "full_name": current_user.full_name,
        "experience_summary": getattr(current_user.candidate_profile, "experience_summary", ""),
        "skills": getattr(current_user.candidate_profile, "skills", []),
        "experience_years": getattr(current_user.candidate_profile, "experience_years", 0),
        "top_achievements": getattr(current_user.candidate_profile, "achievements", [])
    }
    
    # Get job data
    job_data = {
        "title": job.title,
        "requirements": job.requirements,
        "responsibilities": job.responsibilities,
        "skills_required": job.skills_required or [],
        "company": {"name": job.employer.company_name if job.employer else "the company"}
    }
    
    # Get company data
    company_data = {
        "name": job.employer.company_name if job.employer else "",
        "culture_values": getattr(job.employer, "culture_values", ""),
        "mission": getattr(job.employer, "mission", "")
    }
    
    try:
        # Generate cover letter
        result = cover_letter_gen.generate(
            user_profile=user_profile,
            job=job_data,
            company=company_data,
            tone=request.tone,
            custom_points=request.custom_points
        )
        
        return GenerateCoverLetterResponse(
            cover_letter=result.cover_letter,
            key_points_highlighted=result.key_points_highlighted,
            tone_used=result.tone_used,
            word_count=result.word_count,
            suggestions=result.suggestions
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Cover letter generation failed: {str(e)}"
        )


@router.post("/analyze-resume", response_model=ResumeAnalysisResponse)
async def analyze_resume(
    request: AnalyzeResumeRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Analyze resume for ATS compatibility and quality
    
    Provides:
    - ATS compatibility score (0-100)
    - Content quality assessment
    - Keyword optimization
    - Specific improvement suggestions
    - Gap analysis if target job provided
    """
    # Get resume text
    resume_text = request.resume_text
    
    if not resume_text:
        # Try to get from user's saved resume
        if hasattr(current_user, 'candidate_profile') and current_user.candidate_profile:
            # In production, fetch actual resume file content
            resume_text = getattr(current_user.candidate_profile, "resume_text", None)
        
        if not resume_text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No resume provided and no saved resume found"
            )
    
    # Get target job if specified
    target_job = None
    if request.target_job_id:
        job = db.query(Job).filter(Job.id == request.target_job_id).first()
        if job:
            target_job = {
                "title": job.title,
                "requirements": job.requirements,
                "skills_required": job.skills_required or []
            }
    
    try:
        # Analyze resume
        result = resume_analyzer.analyze_resume(
            resume_text=resume_text,
            target_job=target_job
        )
        
        # Convert to response format
        return ResumeAnalysisResponse(
            overall_quality_score=result.overall_quality_score,
            ats_compatibility=ATSScoreResponse(
                overall_score=result.ats_compatibility.overall_score,
                formatting_score=result.ats_compatibility.formatting_score,
                content_score=result.ats_compatibility.content_score,
                keyword_score=result.ats_compatibility.keyword_score,
                issues=result.ats_compatibility.issues,
                strengths=result.ats_compatibility.strengths,
                recommendations=result.ats_compatibility.recommendations
            ),
            strengths=result.strengths,
            areas_for_improvement=result.areas_for_improvement,
            suggestions=[
                {
                    "type": s.type,
                    "priority": s.priority,
                    "current_issue": s.current_issue,
                    "suggestion": s.suggestion,
                    "example": s.example
                }
                for s in result.suggestions
            ],
            keyword_optimization=result.keyword_optimization
        )
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Resume analysis failed: {str(e)}"
        )


@router.get("/match-score/{job_id}")
async def get_ai_match_score(
    job_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get detailed AI match score for a specific job
    
    Returns enhanced matching analysis including:
    - Overall match score
    - Skill match breakdown
    - Experience alignment
    - Culture fit indicators
    - Specific match reasons
    """
    # Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    # In production, use the enhanced matcher
    # For now, return basic structure
    return {
        "job_id": job_id,
        "match_score": 85,
        "breakdown": {
            "skills": 90,
            "experience": 80,
            "location": 100,
            "salary": 75
        },
        "match_reasons": [
            "Strong technical skill alignment",
            "Experience level matches requirements",
            "Location preference compatible"
        ],
        "suggestions": [
            "Highlight Python experience in application",
            "Mention FastAPI projects"
        ]
    }


@router.post("/optimize-keywords")
async def optimize_resume_keywords(
    job_id: int,
    resume_text: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get keyword optimization suggestions for a specific job
    
    Analyzes resume vs job description and recommends
    which keywords to add for better ATS performance
    """
    # Get job
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job not found"
        )
    
    target_job = {
        "title": job.title,
        "requirements": job.requirements,
        "skills_required": job.skills_required or []
    }
    
    try:
        # Analyze keywords
        result = resume_analyzer.analyze_keywords(resume_text, target_job)
        
        return {
            "keyword_match_score": result.get("keyword_match_score", 0),
            "matched_keywords": result.get("matched_keywords", []),
            "missing_keywords": result.get("missing_keywords", []),
            "recommendation": result.get("recommendation", "")
        }
    
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Keyword optimization failed: {str(e)}"
        )


@router.get("/usage-stats")
async def get_ai_usage_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get user's AI feature usage statistics
    
    Returns:
    - Cover letters generated this month
    - Resume analyses performed
    - Remaining quota (if applicable)
    """
    # This would track actual usage from database
    # For now, return mock data
    return {
        "cover_letters_generated": 5,
        "resumes_analyzed": 3,
        "monthly_quota": {
            "cover_letters": 20,
            "resume_analyses": 10,
            "remaining_cover_letters": 15,
            "remaining_analyses": 7
        },
        "upgrade_available": True,
        "current_plan": "free"
    }
