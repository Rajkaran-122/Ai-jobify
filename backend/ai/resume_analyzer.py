"""
Enhanced Resume Analyzer with AI-Powered Insights

Analyzes resumes for:
- ATS (Applicant Tracking System) compatibility
- Content quality and completeness
- Keyword optimization for target jobs
- Industry-specific suggestions
- Gap analysis and improvements
"""

from typing import Optional, List, Dict, Tuple
from datetime import datetime
import openai
from pydantic import BaseModel
import os
import re

# Import existing resume parser
import sys
sys.path.append('..')
from ml_models.resume_parser.parser import ResumeParser

class ATSCompatibility(BaseModel):
    """ATS compatibility analysis"""
    overall_score: int  # 0-100
    formatting_score: int
    content_score: int
    keyword_score: int
    issues: List[str]
    strengths: List[str]
    recommendations: List[str]

class GapAnalysis(BaseModel):
    """Gap analysis between resume and job"""
    missing_skills: List[str]
    missing_keywords: List[str]
    experience_gap: Optional[str]
    suggestions: List[str]
    priority_improvements: List[str]

class ResumeSuggestion(BaseModel):
    """Individual suggestion for improvement"""
    type: str  # content, formatting, keywords, achievements
    priority: str  # high, medium, low
    current_issue: str
    suggestion: str
    example: Optional[str]

class ResumeAnalysisResult(BaseModel):
    """Complete resume analysis result"""
    ats_compatibility: ATSCompatibility
    overall_quality_score: int
    suggestions: List[ResumeSuggestion]
    strengths: List[str]
    areas_for_improvement: List[str]
    keyword_optimization: Dict
    analyzed_at: datetime

class EnhancedResumeAnalyzer:
    """
    AI-powered resume analyzer
    
    Extends the existing resume parser with GPT-4 powered analysis
    for ATS compatibility, content quality, and optimization suggestions.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with OpenAI API key"""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key required")
        openai.api_key = self.api_key
        self.model = os.getenv("AI_MODEL", "gpt-4-turbo-preview")
        
        # Initialize base parser
        self.base_parser = ResumeParser()
    
    def analyze_resume(
        self,
        resume_text: str,
        target_job: Optional[Dict] = None
    ) -> ResumeAnalysisResult:
        """
        Comprehensive resume analysis
        
        Args:
            resume_text: Full text of the resume
            target_job: Optional job details to analyze fit
            
        Returns:
            Complete analysis with scores and suggestions
        """
        # Parse resume using existing parser
        parsed_resume = self.base_parser.parse_text(resume_text)
        
        # Analyze ATS compatibility
        ats_analysis = self.analyze_ats_compatibility(resume_text, parsed_resume)
        
        # Generate AI-powered suggestions
        suggestions = self.generate_suggestions(resume_text, parsed_resume, target_job)
        
        # Analyze keyword optimization
        keyword_analysis = self.analyze_keywords(resume_text, target_job)
        
        # Calculate overall quality score
        overall_score = self._calculate_overall_score(
            ats_analysis,
            parsed_resume,
            keyword_analysis
        )
        
        # Identify strengths
        strengths = self._identify_strengths(resume_text, parsed_resume)
        
        # Identify areas for improvement
        areas_for_improvement = self._identify_areas_for_improvement(
            resume_text,
            parsed_resume,
            ats_analysis
        )
        
        return ResumeAnalysisResult(
            ats_compatibility=ats_analysis,
            overall_quality_score=overall_score,
            suggestions=suggestions,
            strengths=strengths,
            areas_for_improvement=areas_for_improvement,
            keyword_optimization=keyword_analysis,
            analyzed_at=datetime.utcnow()
        )
    
    def analyze_ats_compatibility(
        self,
        resume_text: str,
        parsed_data: Dict
    ) -> ATSCompatibility:
        """
        Analyze how well resume will perform in ATS systems
        
        Checks:
        - Formatting simplicity
        - Section headers
        - Keyword presence
        - File format issues
        - Contact information
        """
        issues = []
        strengths = []
        recommendations = []
        
        # Formatting checks
        formatting_score = 100
        
        # Check for tables (ATS problem)
        if "┌" in resume_text or "│" in resume_text or "table" in resume_text.lower():
            issues.append("Contains tables which may not parse correctly in ATS")
            formatting_score -= 15
            recommendations.append("Replace tables with simple bullet points")
        
        # Check for images/graphics
        if any(word in resume_text.lower() for word in ["image", "graphic", "photo"]):
            issues.append("May contain images which ATS cannot read")
            formatting_score -= 10
            recommendations.append("Remove images and use text descriptions instead")
        
        # Check for standard section headers
        standard_sections = ["experience", "education", "skills"]
        found_sections = []
        for section in standard_sections:
            if section in resume_text.lower():
                found_sections.append(section)
        
        if len(found_sections) >= 3:
            strengths.append("Contains standard section headers")
        else:
            issues.append("Missing standard section headers (Experience, Education, Skills)")
            formatting_score -= 20
            recommendations.append("Add clear section headers: Experience, Education, Skills")
        
        # Content analysis
        content_score = 100
        
        # Check contact information
        contact_info = parsed_data.get("contact", {})
        if not contact_info.get("email"):
            issues.append("Email address not clearly identified")
            content_score -= 25
            recommendations.append("Add email address at the top of resume")
        else:
            strengths.append("Email address clearly present")
        
        if not contact_info.get("phone"):
            issues.append("Phone number not clearly identified")
            content_score -= 15
            recommendations.append("Add phone number in contact section")
        
        # Check for bullet points
        bullet_count = resume_text.count("•") + resume_text.count("-") + resume_text.count("*")
        if bullet_count > 10:
            strengths.append("Good use of bullet points")
        else:
            issues.append("Limited use of bullet points for achievements")
            content_score -= 10
            recommendations.append("Use bullet points to highlight achievements")
        
        # Check for quantifiable achievements
        has_numbers = bool(re.search(r'\d+%', resume_text))
        if has_numbers:
            strengths.append("Contains quantifiable achievements")
        else:
            issues.append("Lacks quantifiable results and metrics")
            content_score -= 15
            recommendations.append("Add numbers and percentages to achievements (e.g., 'Increased sales by 30%')")
        
        # Keyword analysis
        skills = parsed_data.get("skills", [])
        keyword_score = min(100, len(skills) * 5)  # 5 points per skill, max 100
        
        if len(skills) < 10:
            issues.append("Limited technical skills listed")
            recommendations.append("Add more relevant technical skills")
        else:
            strengths.append(f"Contains {len(skills)} identified skills")
        
        # Calculate overall ATS score
        overall_score = int((formatting_score + content_score + keyword_score) / 3)
        
        return ATSCompatibility(
            overall_score=overall_score,
            formatting_score=formatting_score,
            content_score=content_score,
            keyword_score=keyword_score,
            issues=issues,
            strengths=strengths,
            recommendations=recommendations
        )
    
    def generate_suggestions(
        self,
        resume_text: str,
        parsed_data: Dict,
        target_job: Optional[Dict] = None
    ) -> List[ResumeSuggestion]:
        """
        Generate AI-powered improvement suggestions
        
        Uses GPT-4 to analyze resume and provide specific,
        actionable recommendations
        """
        suggestions = []
        
        # Build context for AI
        context = f"""
Resume Text:
{resume_text[:2000]}  # First 2000 chars to save tokens

Parsed Skills: {', '.join(parsed_data.get('skills', [])[:15])}
Experience Years: {parsed_data.get('years_experience', 'Unknown')}
"""
        
        if target_job:
            context += f"""
Target Job: {target_job.get('title', '')}
Required Skills: {', '.join(target_job.get('skills_required', [])[:10])}
"""
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": """You are an expert resume reviewer and career coach.
Analyze resumes and provide specific, actionable suggestions for improvement.
Focus on: content quality, achievement quantification, keyword optimization,
and ATS compatibility."""
                    },
                    {
                        "role": "user",
                        "content": f"""{context}

Provide 5-7 specific suggestions to improve this resume. For each suggestion:
1. Identify the issue
2. Explain why it matters  
3. Provide an example of how to fix it

Format as: PRIORITY | TYPE | ISSUE | SUGGESTION | EXAMPLE
Types: content, formatting, keywords, achievements
Priority: high, medium, low
"""
                    }
                ],
                temperature=0.7,
                max_tokens=800
            )
            
            # Parse AI response into structured suggestions
            ai_suggestions = response.choices[0].message.content.strip().split('\n')
            
            for item in ai_suggestions:
                if '|' in item:
                    parts = [p.strip() for p in item.split('|')]
                    if len(parts) >= 4:
                        suggestions.append(ResumeSuggestion(
                            type=parts[1].lower() if len(parts) > 1 else "content",
                            priority=parts[0].lower() if parts[0].lower() in ["high", "medium", "low"] else "medium",
                            current_issue=parts[2] if len(parts) > 2 else "",
                            suggestion=parts[3] if len(parts) > 3 else "",
                            example=parts[4] if len(parts) > 4 else None
                        ))
        
        except Exception as e:
            # Fallback to rule-based suggestions if AI fails
            suggestions.append(ResumeSuggestion(
                type="content",
                priority="high",
                current_issue="Unable to get AI analysis",
                suggestion="Review resume for quantifiable achievements and relevant keywords",
                example=None
            ))
        
        return suggestions
    
    def analyze_keywords(
        self,
        resume_text: str,
        target_job: Optional[Dict] = None
    ) -> Dict:
        """
        Analyze keyword optimization
        
        Returns analysis of keyword usage and recommendations
        """
        if not target_job:
            return {
                "target_job": None,
                "keyword_match_score": 0,
                "matched_keywords": [],
                "missing_keywords": []
            }
        
        # Extract keywords from job
        job_title = target_job.get("title", "")
        job_requirements = target_job.get("requirements", "")
        job_skills = target_job.get("skills_required", [])
        
        # Combine all job keywords
        job_text = f"{job_title} {job_requirements} {' '.join(job_skills)}".lower()
        job_keywords = set([
            word for word in job_text.split()
            if len(word) > 3 and word.isalpha()
        ])
        
        # Check which keywords are in resume
        resume_lower = resume_text.lower()
        matched = []
        missing = []
        
        for keyword in job_keywords:
            if keyword in resume_lower:
                matched.append(keyword)
            else:
                missing.append(keyword)
        
        # Calculate match score
        total_keywords = len(job_keywords)
        match_score = int((len(matched) / total_keywords * 100)) if total_keywords > 0 else 0
        
        return {
            "target_job": job_title,
            "keyword_match_score": match_score,
            "matched_keywords": matched[:20],  # Top 20
            "missing_keywords": missing[:15],  # Top 15 missing
            "recommendation": self._get_keyword_recommendation(match_score)
        }
    
    def compare_to_job(
        self,
        resume_text: str,
        parsed_data: Dict,
        job: Dict
    ) -> GapAnalysis:
        """
        Compare resume directly to job requirements
        
        Identifies gaps and provides targeted recommendations
        """
        # Get job requirements
        job_skills = set([s.lower() for s in job.get("skills_required", [])])
        job_experience_level = job.get("experience_level", "")
        
        # Get resume skills
        resume_skills = set([s.lower() for s in parsed_data.get("skills", [])])
        resume_years = parsed_data.get("years_experience", 0)
        
        # Find missing skills
        missing_skills = list(job_skills - resume_skills)
        
        # Analyze keyword match
        keyword_analysis = self.analyze_keywords(resume_text, job)
        missing_keywords = keyword_analysis.get("missing_keywords", [])
        
        # Analyze experience gap
        experience_gap = None
        if "senior" in job_experience_level.lower() and resume_years < 5:
            experience_gap = "Position requires senior-level experience (5+ years)"
        elif "mid" in job_experience_level.lower() and resume_years < 3:
            experience_gap = "Position requires mid-level experience (3+ years)"
        
        # Generate suggestions
        suggestions = []
        priority_improvements = []
        
        if missing_skills:
            suggestions.append(f"Add these skills if you have them: {', '.join(missing_skills[:5])}")
            priority_improvements.append(f"Highlight experience with {missing_skills[0]}")
        
        if missing_keywords:
            suggestions.append(f"Include these keywords: {', '.join(missing_keywords[:5])}")
        
        if experience_gap:
            suggestions.append("Emphasize leadership and senior responsibilities in your experience")
        
        # Analyze with AI for deeper insights
        try:
            ai_analysis = self._get_ai_gap_analysis(resume_text, job)
            if ai_analysis:
                suggestions.extend(ai_analysis.get("suggestions", [])[:3])
        except:
            pass  # Continue with rule-based analysis if AI fails
        
        return GapAnalysis(
            missing_skills=missing_skills,
            missing_keywords=missing_keywords,
            experience_gap=experience_gap,
            suggestions=suggestions[:10],
            priority_improvements=priority_improvements[:5]
        )
    
    def _calculate_overall_score(
        self,
        ats_analysis: ATSCompatibility,
        parsed_data: Dict,
        keyword_analysis: Dict
    ) -> int:
        """Calculate overall resume quality score"""
        # Weight different components
        ats_weight = 0.4
        completeness_weight = 0.3
        keyword_weight = 0.3
        
        # ATS score
        ats_score = ats_analysis.overall_score
        
        # Completeness score
        completeness = 0
        if parsed_data.get("contact", {}).get("email"):
            completeness += 20
        if parsed_data.get("contact", {}).get("phone"):
            completeness += 15
        if len(parsed_data.get("skills", [])) >= 10:
            completeness += 25
        if len(parsed_data.get("experience", [])) >= 2:
            completeness += 25
        if parsed_data.get("education"):
            completeness += 15
        
        # Keyword score
        keyword_score = keyword_analysis.get("keyword_match_score", 50)
        
        # Calculate weighted average
        overall = int(
            ats_score * ats_weight +
            completeness * completeness_weight +
            keyword_score * keyword_weight
        )
        
        return min(100, max(0, overall))
    
    def _identify_strengths(self, resume_text: str, parsed_data: Dict) -> List[str]:
        """Identify resume strengths"""
        strengths = []
        
        if len(parsed_data.get("skills", [])) >= 15:
            strengths.append("Comprehensive skills section")
        
        if re.search(r'\d+%', resume_text):
            strengths.append("Includes quantifiable achievements")
        
        if len(parsed_data.get("experience", [])) >= 3:
            strengths.append("Strong work history")
        
        if parsed_data.get("education"):
            strengths.append("Education clearly documented")
        
        word_count = len(resume_text.split())
        if 400 <= word_count <= 800:
            strengths.append("Appropriate resume length")
        
        return strengths
    
    def _identify_areas_for_improvement(
        self,
        resume_text: str,
        parsed_data: Dict,
        ats_analysis: ATSCompatibility
    ) -> List[str]:
        """Identify areas needing improvement"""
        areas = []
        
        if ats_analysis.overall_score < 70:
            areas.append("ATS compatibility needs improvement")
        
        if len(parsed_data.get("skills", [])) < 10:
            areas.append("Add more relevant technical skills")
        
        if not re.search(r'\d+%', resume_text):
            areas.append("Include quantifiable achievements with metrics")
        
        if len(resume_text.split()) > 1000:
            areas.append("Resume is too long - aim for 1-2 pages")
        
        return areas
    
    def _get_keyword_recommendation(self, score: int) -> str:
        """Get recommendation based on keyword match score"""
        if score >= 80:
            return "Excellent keyword match with target role"
        elif score >= 60:
            return "Good keyword coverage, consider adding a few more relevant terms"
        elif score >= 40:
            return "Moderate keyword match, add more job-specific keywords"
        else:
            return "Low keyword match, significantly increase relevant terminology"
    
    def _get_ai_gap_analysis(self, resume_text: str, job: Dict) -> Optional[Dict]:
        """Use AI to identify gaps"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a technical recruiter analyzing candidate fit."
                    },
                    {
                        "role": "user",
                        "content": f"""
Compare this resume to the job requirements and identify the top 3 gaps:

Job: {job.get('title')}
Requirements: {job.get('requirements', '')}

Resume (excerpt): {resume_text[:1000]}

List 3 specific gaps and how to address them.
"""
                    }
                ],
                temperature=0.5,
                max_tokens=300
            )
            
            suggestions = response.choices[0].message.content.strip().split('\n')
            return {"suggestions": [s for s in suggestions if s.strip()]}
            
        except:
            return None


# Example usage
if __name__ == "__main__":
    analyzer = EnhancedResumeAnalyzer()
    
    sample_resume = """
John Doe
john.doe@email.com | 555-1234

EXPERIENCE
Senior Python Developer - TechCorp (2020-Present)
- Built ML pipeline processing 1M records daily
- Reduced API latency by 60%
- Led team of 4 developers

EDUCATION
BS Computer Science - University (2018)

SKILLS
Python, FastAPI, React, Machine Learning, Docker
"""
    
    sample_job = {
        "title": "Senior Python Developer",
        "requirements": "5+ years Python, FastAPI, ML experience",
        "skills_required": ["Python", "FastAPI", "Machine Learning", "AWS", "Docker"]
    }
    
    result = analyzer.analyze_resume(sample_resume, sample_job)
    
    print(f"Overall Score: {result.overall_quality_score}/100")
    print(f"ATS Score: {result.ats_compatibility.overall_score}/100")
    print(f"\nStrengths: {result.strengths}")
    print(f"\nAreas for Improvement: {result.areas_for_improvement}")
