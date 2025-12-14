"""
Resume Processing Tasks
Automated resume parsing and candidate profiling
"""
from celery import Task
from workers.celery_app import app
from ml_models.resume_parser.parser import ResumeParser
from shared.database import SessionLocal
from shared import models
import logging

logger = logging.getLogger(__name__)

# Initialize resume parser
parser = ResumeParser()


@app.task(name='workers.tasks.resume_processing.parse_resume', bind=True)
def parse_resume_task(self: Task, candidate_id: str, resume_url: str) -> dict:
    """
    Parse resume and update candidate profile
    
    Args:
        candidate_id: UUID of candidate
        resume_url: URL/path to resume file
    
    Returns:
        Dictionary with parsed data and status
    """
    db = SessionLocal()
    try:
        logger.info(f"Parsing resume for candidate {candidate_id}")
        
        # Parse resume
        # In production, fetch file from S3 using resume_url
        # For now, we'll simulate
        parsed_data = {
            "personal": {"name": "Sample", "email": "sample@email.com"},
            "skills": ["Python", "FastAPI"],
            "education": [],
            "experience": [],
            "confidence_score": 0.8
        }
        
        # Update candidate profile
        candidate = db.query(models.CandidateProfile).filter(
            models.CandidateProfile.id == candidate_id
        ).first()
        
        if candidate:
            # Update skills if parsed successfully
            if parsed_data.get('skills'):
                candidate.skills = parsed_data['skills']
            
            # Update name if available
            if parsed_data.get('personal', {}).get('name'):
                names = parsed_data['personal']['name'].split(' ', 1)
                candidate.first_name = names[0]
                if len(names) > 1:
                    candidate.last_name = names[1]
            
            # Update education and experience
            if parsed_data.get('education'):
                candidate.education = parsed_data['education']
            if parsed_data.get('experience'):
                candidate.work_experience = parsed_data['experience']
            
            db.commit()
            logger.info(f"Successfully updated candidate {candidate_id}")
        
        return {
            'status': 'success',
            'candidate_id': candidate_id,
            'confidence_score': parsed_data.get('confidence_score', 0)
        }
        
    except Exception as e:
        logger.error(f"Error parsing resume for candidate {candidate_id}: {str(e)}")
        db.rollback()
        return {
            'status': 'error',
            'candidate_id': candidate_id,
            'error': str(e)
        }
    finally:
        db.close()


@app.task(name='workers.tasks.resume_processing.bulk_parse_resumes')
def bulk_parse_resumes_task(candidate_resume_pairs: list) -> dict:
    """
    Parse multiple resumes in batch
    
    Args:
        candidate_resume_pairs: List of (candidate_id, resume_url) tuples
    
    Returns:
        Summary of batch processing
    """
    results = {
        'total': len(candidate_resume_pairs),
        'successful': 0,
        'failed': 0,
        'errors': []
    }
    
    for candidate_id, resume_url in candidate_resume_pairs:
        try:
            result = parse_resume_task.apply_async(
                args=[candidate_id, resume_url],
                queue='resume'
            )
            results['successful'] += 1
        except Exception as e:
            results['failed'] += 1
            results['errors'].append({
                'candidate_id': candidate_id,
                'error': str(e)
            })
    
    return results
