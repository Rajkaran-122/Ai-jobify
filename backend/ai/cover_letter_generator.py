"""
AI-Powered Cover Letter Generator

Generates personalized, professional cover letters using GPT-4 based on:
- User profile and experience
- Job requirements and description
- Company culture and values
- Multiple tone options
"""

from typing import Optional, List, Dict
from datetime import datetime
import openai
from pydantic import BaseModel
import os

class CoverLetterRequest(BaseModel):
    """Request model for cover letter generation"""
    user_profile: Dict
    job_description: str
    company_info: Dict
    tone: str = "professional"  # professional, enthusiastic, concise
    custom_points: Optional[List[str]] = None
    max_length: int = 500  # words

class CoverLetterResponse(BaseModel):
    """Response model for generated cover letter"""
    cover_letter: str
    key_points_highlighted: List[str]
    tone_used: str
    word_count: int
    suggestions: List[str]
    generated_at: datetime

class CoverLetterGenerator:
    """
    AI-powered cover letter generation service
    
    Uses GPT-4 to create personalized, professional cover letters
    that highlight relevant experience and show culture fit.
    """
    
    def __init__(self, api_key: Optional[str] = None):
        """Initialize with OpenAI API key"""
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        if not self.api_key:
            raise ValueError("OpenAI API key required")
        openai.api_key = self.api_key
        self.model = os.getenv("AI_MODEL", "gpt-4-turbo-preview")
    
    def generate(
        self,
        user_profile: Dict,
        job: Dict,
        company: Dict,
        tone: str = "professional",
        custom_points: Optional[List[str]] = None
    ) -> CoverLetterResponse:
        """
        Generate a personalized cover letter
        
        Args:
            user_profile: Candidate's profile with experience, skills, etc.
            job: Job posting details
            company: Company information
            tone: Writing tone (professional, enthusiastic, concise)
            custom_points: Specific points to highlight
            
        Returns:
            CoverLetterResponse with generated content and metadata
        """
        try:
            # Build the prompt
            prompt = self._build_prompt(user_profile, job, company, tone, custom_points)
            
            # Call GPT-4
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": self._get_system_message(tone)
                    },
                    {
                        "role": "user",
                        "content": prompt
                    }
                ],
                temperature=0.7,
                max_tokens=1000
            )
            
            # Extract generated content
            cover_letter = response.choices[0].message.content.strip()
            
            # Analyze what was included
            key_points = self._extract_key_points(cover_letter, user_profile, job)
            
            # Generate suggestions for improvement
            suggestions = self._generate_suggestions(cover_letter, user_profile, job)
            
            # Calculate word count
            word_count = len(cover_letter.split())
            
            return CoverLetterResponse(
                cover_letter=cover_letter,
                key_points_highlighted=key_points,
                tone_used=tone,
                word_count=word_count,
                suggestions=suggestions,
                generated_at=datetime.utcnow()
            )
            
        except Exception as e:
            raise Exception(f"Cover letter generation failed: {str(e)}")
    
    def _build_prompt(
        self,
        user_profile: Dict,
        job: Dict,
        company: Dict,
        tone: str,
        custom_points: Optional[List[str]]
    ) -> str:
        """Build the GPT-4 prompt"""
        
        # Extract key information
        name = user_profile.get("full_name", "Candidate")
        experience = user_profile.get("experience_summary", "")
        skills = ", ".join(user_profile.get("skills", [])[:10])
        achievements = user_profile.get("top_achievements", [])
        
        job_title = job.get("title", "")
        job_requirements = job.get("requirements", "")
        job_responsibilities = job.get("responsibilities", "")
        
        company_name = company.get("name", "the company")
        company_values = company.get("culture_values", "")
        company_mission = company.get("mission", "")
        
        # Build structured prompt
        prompt = f"""
Generate a professional cover letter for the following job application:

CANDIDATE INFORMATION:
- Name: {name}
- Key Skills: {skills}
- Experience Summary: {experience}
"""
        
        if achievements:
            prompt += f"\n- Notable Achievements:\n"
            for achievement in achievements[:3]:
                prompt += f"  • {achievement}\n"
        
        prompt += f"""
JOB DETAILS:
- Position: {job_title}
- Company: {company_name}
- Key Requirements: {job_requirements}
- Main Responsibilities: {job_responsibilities}

COMPANY INFORMATION:
- Mission: {company_mission}
- Culture & Values: {company_values}
"""
        
        if custom_points:
            prompt += f"\nPLEASE HIGHLIGHT THESE POINTS:\n"
            for point in custom_points:
                prompt += f"- {point}\n"
        
        prompt += f"""
REQUIREMENTS:
1. Address the hiring manager professionally
2. Show genuine enthusiasm for {company_name} and the {job_title} role
3. Match candidate's experience to job requirements specifically
4. Highlight relevant achievements with quantifiable results
5. Demonstrate culture fit and alignment with company values
6. Keep it concise (300-400 words)
7. End with a strong call to action
8. Use {tone} tone throughout
9. Make it personal, not generic
10. Avoid clichés and overused phrases

Generate the cover letter now:
"""
        
        return prompt
    
    def _get_system_message(self, tone: str) -> str:
        """Get system message based on tone"""
        base = "You are an expert career coach and professional writer specializing in creating compelling cover letters that get results."
        
        tone_instructions = {
            "professional": "Write in a polished, business-appropriate tone. Be confident but not boastful.",
            "enthusiastic": "Write with genuine enthusiasm and energy. Show passion for the opportunity while remaining professional.",
            "concise": "Write concisely and directly. Every sentence should add value. Avoid fluff."
        }
        
        return f"{base} {tone_instructions.get(tone, tone_instructions['professional'])}"
    
    def _extract_key_points(
        self,
        cover_letter: str,
        user_profile: Dict,
        job: Dict
    ) -> List[str]:
        """Analyze which key points were highlighted in the cover letter"""
        key_points = []
        
        skills = user_profile.get("skills", [])
        requirements = job.get("skills_required", [])
        
        # Check for skill mentions
        for skill in skills[:10]:
            if skill.lower() in cover_letter.lower():
                key_points.append(f"Highlighted skill: {skill}")
        
        # Check for experience level
        exp_years = user_profile.get("experience_years", 0)
        if str(exp_years) in cover_letter or "years" in cover_letter.lower():
            key_points.append(f"Mentioned experience level")
        
        # Check for achievements
        achievements = user_profile.get("top_achievements", [])
        for achievement in achievements[:3]:
            # Simple keyword matching (can be improved)
            achievement_words = achievement.lower().split()[:3]
            if any(word in cover_letter.lower() for word in achievement_words):
                key_points.append(f"Included achievement")
                break
        
        return key_points
    
    def _generate_suggestions(
        self,
        cover_letter: str,
        user_profile: Dict,
        job: Dict
    ) -> List[str]:
        """Generate suggestions for improvement"""
        suggestions = []
        
        # Check length
        word_count = len(cover_letter.split())
        if word_count < 250:
            suggestions.append("Consider adding more specific examples of your achievements")
        elif word_count > 450:
            suggestions.append("Try to make it more concise - aim for 300-400 words")
        
        # Check for quantifiable results
        has_numbers = any(char.isdigit() for char in cover_letter)
        if not has_numbers:
            suggestions.append("Add quantifiable results (e.g., '30% increase', 'managed 10+ projects')")
        
        # Check for company name mentions
        company_name = job.get("company", {}).get("name", "")
        if company_name and company_name.lower() not in cover_letter.lower():
            suggestions.append(f"Mention {company_name} more to show research and interest")
        
        # Check for specific job title
        job_title = job.get("title", "")
        if job_title and job_title.lower() not in cover_letter.lower():
            suggestions.append(f"Reference the specific role: {job_title}")
        
        return suggestions
    
    def analyze_job_requirements(self, job: Dict) -> Dict:
        """
        Analyze job description to extract key requirements
        
        Returns structured data about what the job needs
        """
        description = job.get("description", "")
        requirements = job.get("requirements", "")
        
        combined_text = f"{description}\n{requirements}"
        
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are an expert at analyzing job descriptions. Extract key requirements and categorize them."
                    },
                    {
                        "role": "user",
                        "content": f"""
Analyze this job description and extract:
1. Required technical skills
2. Required soft skills
3. Experience level needed
4. Key responsibilities
5. Must-have qualifications
6. Nice-to-have qualifications

Job Description:
{combined_text}

Return as JSON with categories.
"""
                    }
                ],
                temperature=0.3,
                max_tokens=500
            )
            
            # Parse response (simplified - in production, use proper JSON parsing)
            analysis = response.choices[0].message.content
            
            return {"analysis": analysis}
            
        except Exception as e:
            return {"error": str(e)}
    
    def extract_relevant_experience(
        self,
        user_profile: Dict,
        job: Dict
    ) -> List[Dict]:
        """
        Extract most relevant experiences from user profile for this job
        
        Returns ranked list of relevant experiences
        """
        experiences = user_profile.get("work_experience", [])
        job_requirements = job.get("requirements", "")
        job_skills = job.get("skills_required", [])
        
        relevant_experiences = []
        
        for exp in experiences:
            relevance_score = 0
            matched_skills = []
            
            exp_description = exp.get("description", "").lower()
            exp_title = exp.get("title", "").lower()
            
            # Check skill matches
            for skill in job_skills:
                if skill.lower() in exp_description or skill.lower() in exp_title:
                    relevance_score += 1
                    matched_skills.append(skill)
            
            # Check requirement keywords
            req_keywords = job_requirements.lower().split()
            for keyword in req_keywords:
                if len(keyword) > 4 and keyword in exp_description:
                    relevance_score += 0.5
            
            if relevance_score > 0:
                relevant_experiences.append({
                    "experience": exp,
                    "relevance_score": relevance_score,
                    "matched_skills": matched_skills
                })
        
        # Sort by relevance
        relevant_experiences.sort(key=lambda x: x["relevance_score"], reverse=True)
        
        return relevant_experiences[:5]  # Top 5 most relevant
    
    def customize_for_company(
        self,
        user_profile: Dict,
        job: Dict,
        company: Dict
    ) -> str:
        """
        Generate company-specific talking points
        
        Returns paragraph highlighting company fit
        """
        try:
            company_name = company.get("name", "")
            company_values = company.get("culture_values", "")
            company_mission = company.get("mission", "")
            user_values = user_profile.get("values", "")
            
            prompt = f"""
Based on this information, write a brief paragraph (3-4 sentences) explaining why the candidate is a great fit for this company's culture:

Company: {company_name}
Company Values: {company_values}
Company Mission: {company_mission}

Candidate's Values: {user_values}
Candidate's Work Style: {user_profile.get('work_style', '')}

Make it specific, authentic, and compelling.
"""
            
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a career coach helping candidates articulate culture fit."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=200
            )
            
            return response.choices[0].message.content.strip()
            
        except Exception as e:
            return ""


# Example usage
if __name__ == "__main__":
    # Initialize generator
    generator = CoverLetterGenerator()
    
    # Sample data
    user_profile = {
        "full_name": "John Doe",
        "experience_summary": "5 years of Python development experience with focus on ML and web applications",
        "skills": ["Python", "FastAPI", "React", "Machine Learning", "PostgreSQL"],
        "experience_years": 5,
        "top_achievements": [
            "Built ML pipeline processing 1M+ records/day",
            "Reduced API latency by 60% through optimization",
            "Led team of 4 developers on major product launch"
        ]
    }
    
    job = {
        "title": "Senior Python Developer",
        "requirements": "5+ years Python, FastAPI experience, ML background",
        "responsibilities": "Build scalable APIs, optimize performance, mentor junior developers",
        "skills_required": ["Python", "FastAPI", "ML", "Docker"],
        "company": {"name": "TechCorp"}
    }
    
    company = {
        "name": "TechCorp",
        "culture_values": "Innovation, collaboration, continuous learning",
        "mission": "Building AI solutions that improve lives"
    }
    
    # Generate cover letter
    result = generator.generate(user_profile, job, company, tone="professional")
    
    print("Generated Cover Letter:")
    print("-" * 80)
    print(result.cover_letter)
    print("-" * 80)
    print(f"\nWord Count: {result.word_count}")
    print(f"Key Points: {result.key_points_highlighted}")
    print(f"Suggestions: {result.suggestions}")
