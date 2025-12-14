"""
Job-Candidate Matching Tasks
Automated matching and ranking
"""
from celery import Task
from workers.celery_app import app
from ml_models.matching.matcher import JobCandidateMatcher, CandidateProfile, JobPosting
from shared.database import SessionLocal
from shared import models
import logging

logger = logging.getLogger(__name__)

# Initialize matcher
matcher = JobCandidateMatcher()


@app.task(name='workers.tasks.matching.match_candidates_for_job', bind=True)
def match_candidates_for_job_task(self: Task, job_id: str, top_k: int = 100) -> dict:
    """
    Find and rank top candidates for a job posting
    
    Args:
        job_id: UUID of job posting
        top_k: Number of top candidates to return
    
    Returns:
        Dictionary with matched candidates
    """
    db = SessionLocal()
    try:
        logger.info(f"Matching candidates for job {job_id}")
        
        # Fetch job
        job = db.query(models.Job).filter(models.Job.id == job_id).first()
        if not job:
            return {'status': 'error', 'message': 'Job not found'}
        
        # Convert to matching model format
        job_posting = JobPosting(
            id=str(job.id),
            required_skills=job.requirements or [],
            nice_to_have_skills=job.nice_to_have or [],
            experience_required=0,  # Could be extracted from description
            location=job.location or '',
            salary_max=job.salary_max or 0,
            job_type=job.job_type or 'full-time'
        )
        
        # Fetch all active candidates
        candidates = db.query(models.CandidateProfile).limit(1000).all()
        
        candidate_profiles = []
        for candidate in candidates:
            candidate_profiles.append(CandidateProfile(
                id=str(candidate.id),
                skills=candidate.skills or [],
                experience_years=candidate.experience_years or 0,
                location=candidate.location or '',
                salary_expectation=candidate.preferences.get('salary_min', 0) if candidate.preferences else 0,
                preferences=candidate.preferences or {}
            ))
        
        # Run matching
        matches = matcher.rank_candidates(candidate_profiles, job_posting, top_k=top_k)
        
        # Store matches in database
        for match_data in matches:
            existing_match = db.query(models.JobMatch).filter(
                models.JobMatch.job_id == job_id,
                models.JobMatch.candidate_id == match_data['candidate_id']
            ).first()
            
            if existing_match:
                existing_match.match_score = match_data['match_score']
                existing_match.match_reasons = match_data['match_reasons']
            else:
                new_match = models.JobMatch(
                    job_id=job_id,
                    candidate_id=match_data['candidate_id'],
                    match_score=match_data['match_score'],
                    match_reasons=match_data['match_reasons']
                )
                db.add(new_match)
        
        db.commit()
        logger.info(f"Created {len(matches)} matches for job {job_id}")
        
        return {
            'status': 'success',
            'job_id': job_id,
            'matches_count': len(matches)
        }
        
    except Exception as e:
        logger.error(f"Error matching candidates for job {job_id}: {str(e)}")
        db.rollback()
        return {
            'status': 'error',
            'job_id': job_id,
            'error': str(e)
        }
    finally:
        db.close()


@app.task(name='workers.tasks.matching.match_jobs_for_candidate')
def match_jobs_for_candidate_task(candidate_id: str, top_k: int = 50) -> dict:
    """
    Find and rank top jobs for a candidate
    
    Args:
        candidate_id: UUID of candidate
        top_k: Number of top jobs to return
    
    Returns:
        Dictionary with matched jobs
    """
    db = SessionLocal()
    try:
        logger.info(f"Matching jobs for candidate {candidate_id}")
        
        # Fetch candidate
        candidate = db.query(models.CandidateProfile).filter(
            models.CandidateProfile.id == candidate_id
        ).first()
        
        if not candidate:
            return {'status': 'error', 'message': 'Candidate not found'}
        
        # Convert to matching model format
        candidate_profile = CandidateProfile(
            id=str(candidate.id),
            skills=candidate.skills or [],
            experience_years=candidate.experience_years or 0,
            location=candidate.location or '',
            salary_expectation=candidate.preferences.get('salary_min', 0) if candidate.preferences else 0,
            preferences=candidate.preferences or {}
        )
        
        # Fetch active jobs
        jobs = db.query(models.Job).filter(
            models.Job.status == models.JobStatus.ACTIVE
        ).limit(500).all()
        
        job_postings = []
        for job in jobs:
            job_postings.append(JobPosting(
                id=str(job.id),
                required_skills=job.requirements or [],
                nice_to_have_skills=job.nice_to_have or [],
                experience_required=0,
                location=job.location or '',
                salary_max=job.salary_max or 0,
                job_type=job.job_type or 'full-time'
            ))
        
        # Run matching
        matches = matcher.rank_jobs(candidate_profile, job_postings, top_k=top_k)
        
        # Store matches
        for match_data in matches:
            existing_match = db.query(models.JobMatch).filter(
                models.JobMatch.job_id == match_data['job_id'],
                models.JobMatch.candidate_id == candidate_id
            ).first()
            
            if existing_match:
                existing_match.match_score = match_data['match_score']
                existing_match.match_reasons = match_data['match_reasons']
            else:
                new_match = models.JobMatch(
                    job_id=match_data['job_id'],
                    candidate_id=candidate_id,
                    match_score=match_data['match_score'],
                    match_reasons=match_data['match_reasons']
                )
                db.add(new_match)
        
        db.commit()
        logger.info(f"Created {len(matches)} matches for candidate {candidate_id}")
        
        return {
            'status': 'success',
            'candidate_id': candidate_id,
            'matches_count': len(matches)
        }
        
    except Exception as e:
        logger.error(f"Error matching jobs for candidate {candidate_id}: {str(e)}")
        db.rollback()
        return {
            'status': 'error',
            'candidate_id': candidate_id,
            'error': str(e)
        }
    finally:
        db.close()
