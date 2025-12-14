"""
Initialize AI module

Contains AI-powered services:
- Cover Letter Generator
- Resume Analyzer
- Interview Coach (coming soon)
- Salary Predictor (coming soon)
"""

from .cover_letter_generator import CoverLetterGenerator, CoverLetterResponse
from .resume_analyzer import EnhancedResumeAnalyzer, ResumeAnalysisResult, ATSCompatibility

__all__ = [
    "CoverLetterGenerator",
    "CoverLetterResponse",
    "EnhancedResumeAnalyzer",
    "ResumeAnalysisResult",
    "ATSCompatibility"
]
