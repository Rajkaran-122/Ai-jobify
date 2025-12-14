"""
Job-Candidate Matching Algorithm
Simplified version using skill matching and scoring
(Production would use two-tower neural network with embeddings)
"""
from typing import List, Dict, Any, Tuple
import numpy as np
from dataclasses import dataclass


@dataclass
class CandidateProfile:
    """Candidate profile for matching"""
    id: str
    skills: List[str]
    experience_years: int
    location: str
    salary_expectation: int
    preferences: Dict[str, Any]


@dataclass
class JobPosting:
    """Job posting for matching"""
    id: str
    required_skills: List[str]
    nice_to_have_skills: List[str]
    experience_required: int
    location: str
    salary_max: int
    job_type: str


class JobCandidateMatcher:
    """
    Simplified matching algorithm based on feature scoring
    Production: Two-tower neural network with BERT embeddings
    """
    
    def __init__(self):
        self.weights = {
            "skills_match": 0.40,
            "experience_match": 0.20,
            "location_match": 0.15,
            "salary_match": 0.15,
            "preferences_match": 0.10
        }
    
    def jaccard_similarity(self, set1: set, set2: set) -> float:
        """Calculate Jaccard similarity between two sets"""
        if not set1 or not set2:
            return 0.0
        intersection = len(set1.intersection(set2))
        union = len(set1.union(set2))
        return intersection / union if union > 0 else 0.0
    
    def skills_score(self, candidate: CandidateProfile, job: JobPosting) -> Tuple[float, List[str]]:
        """
        Calculate skills match score
        Returns: (score, match_reasons)
        """
        candidate_skills = set(skill.lower() for skill in candidate.skills)
        required_skills = set(skill.lower() for skill in job.required_skills)
        nice_to_have = set(skill.lower() for skill in job.nice_to_have_skills)
        
        # Required skills match (80% weight)
        required_match = self.jaccard_similarity(candidate_skills, required_skills)
        
        # Nice-to-have skills match (20% weight)
        nice_match = self.jaccard_similarity(candidate_skills, nice_to_have)
        
        score = (required_match * 0.8) + (nice_match * 0.2)
        
        # Generate match reasons
        matched_required = candidate_skills.intersection(required_skills)
        matched_nice = candidate_skills.intersection(nice_to_have)
        
        reasons = []
        if matched_required:
            reasons.append(f"Matches {len(matched_required)}/{len(required_skills)} required skills")
        if matched_nice:
            reasons.append(f"Has {len(matched_nice)} nice-to-have skills")
        
        return score, reasons
    
    def experience_score(self, candidate: CandidateProfile, job: JobPosting) -> Tuple[float, List[str]]:
        """Calculate experience match score"""
        candidate_exp = candidate.experience_years
        required_exp = job.experience_required
        
        if candidate_exp >= required_exp:
            # Candidate meets or exceeds requirement
            if candidate_exp > required_exp * 1.5:
                # Significantly overqualified (slight penalty)
                score = 0.9
                reasons = [f"Has {candidate_exp} years (overqualified)"]
            else:
                score = 1.0
                reasons = [f"Has {candidate_exp} years experience"]
        else:
            # Candidate has less experience (proportional penalty)
            score = candidate_exp / required_exp if required_exp > 0 else 0.5
            reasons = [f"Has {candidate_exp} years (requires {required_exp})"]
        
        return score, reasons
    
    def location_score(self, candidate: CandidateProfile, job: JobPosting) -> Tuple[float, List[str]]:
        """Calculate location match score"""
        # Simplified: exact match or remote preference
        if job.location.lower() == "remote" or candidate.preferences.get("remote", False):
            return 1.0, ["Remote position"]
        
        if candidate.location.lower() == job.location.lower():
            return 1.0, [f"Located in {job.location}"]
        
        # Partial match (same country/state - simplified)
        if candidate.location.split(',')[0].lower() == job.location.split(',')[0].lower():
            return 0.7, ["Similar location"]
        
        return 0.3, ["Different location"]
    
    def salary_score(self, candidate: CandidateProfile, job: JobPosting) -> Tuple[float, List[str]]:
        """Calculate salary alignment score"""
        candidate_expectation = candidate.salary_expectation
        job_offer = job.salary_max
        
        if candidate_expectation <= job_offer:
            # Candidate's expectation is within budget
            diff_percent = (job_offer - candidate_expectation) / job_offer * 100
            return 1.0, [f"Salary expectation: ${candidate_expectation:,} (within budget)"]
        else:
            # Candidate expects more
            diff_percent = (candidate_expectation - job_offer) / candidate_expectation * 100
            if diff_percent < 10:
                return 0.8, [f"Salary expectation slightly above ({diff_percent:.0f}% more)"]
            elif diff_percent < 20:
                return 0.6, [f"Salary expectation above budget ({diff_percent:.0f}% more)"]
            else:
                return 0.3, [f"Salary expectation significantly higher"]
    
    def preferences_score(self, candidate: CandidateProfile, job: JobPosting) -> Tuple[float, List[str]]:
        """Calculate job preferences match"""
        score = 0.0
        reasons = []
        
        # Job type preference
        preferred_types = candidate.preferences.get("job_types", [])
        if job.job_type.lower() in [jt.lower() for jt in preferred_types]:
            score += 0.5
            reasons.append(f"Prefers {job.job_type} positions")
        
        # Work mode preference
        preferred_modes = candidate.preferences.get("work_modes", [])
        if preferred_modes and "hybrid" in [wm.lower() for wm in preferred_modes]:
            score += 0.5
            reasons.append("Open to hybrid work")
        
        return min(score, 1.0), reasons
    
    def calculate_match(
        self,
        candidate: CandidateProfile,
        job: JobPosting
    ) -> Dict[str, Any]:
        """
        Calculate overall match score between candidate and job
        
        Returns:
            Dictionary with match_score (0.0-1.0) and match_reasons
        """
        # Calculate individual component scores
        skills_scr, skills_reasons = self.skills_score(candidate, job)
        exp_scr, exp_reasons = self.experience_score(candidate, job)
        loc_scr, loc_reasons = self.location_score(candidate, job)
        sal_scr, sal_reasons = self.salary_score(candidate, job)
        pref_scr, pref_reasons = self.preferences_score(candidate, job)
        
        # Weighted overall score
        overall_score = (
            skills_scr * self.weights["skills_match"] +
            exp_scr * self.weights["experience_match"] +
            loc_scr * self.weights["location_match"] +
            sal_scr * self.weights["salary_match"] +
            pref_scr * self.weights["preferences_match"]
        )
        
        # Combine all reasons
        all_reasons = skills_reasons + exp_reasons + loc_reasons + sal_reasons + pref_reasons
        
        return {
            "match_score": round(overall_score, 3),
            "match_reasons": all_reasons,
            "component_scores": {
                "skills": round(skills_scr, 3),
                "experience": round(exp_scr, 3),
                "location": round(loc_scr, 3),
                "salary": round(sal_scr, 3),
                "preferences": round(pref_scr, 3)
            }
        }
    
    def rank_candidates(
        self,
        candidates: List[CandidateProfile],
        job: JobPosting,
        top_k: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Rank candidates for a job posting
        
        Returns:
            List of candidate matches sorted by score (descending)
        """
        matches = []
        
        for candidate in candidates:
            match_result = self.calculate_match(candidate, job)
            matches.append({
                "candidate_id": candidate.id,
                **match_result
            })
        
        # Sort by match score descending
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches[:top_k]
    
    def rank_jobs(
        self,
        candidate: CandidateProfile,
        jobs: List[JobPosting],
        top_k: int = 50
    ) -> List[Dict[str, Any]]:
        """
        Rank jobs for a candidate
        
        Returns:
            List of job matches sorted by score (descending)
        """
        matches = []
        
        for job in jobs:
            match_result = self.calculate_match(candidate, job)
            matches.append({
                "job_id": job.id,
                **match_result
            })
        
        # Sort by match score descending
        matches.sort(key=lambda x: x["match_score"], reverse=True)
        
        return matches[:top_k]


# Example usage
if __name__ == "__main__":
    matcher = JobCandidateMatcher()
    
    # Create sample candidate
    candidate = CandidateProfile(
        id="cand_123",
        skills=["Python", "FastAPI", "PostgreSQL", "Docker", "React"],
        experience_years=5,
        location="San Francisco, CA",
        salary_expectation=150000,
        preferences={
            "job_types": ["full-time"],
            "work_modes": ["remote", "hybrid"],
            "remote": True
        }
    )
    
    # Create sample job
    job = JobPosting(
        id="job_456",
        required_skills=["Python", "FastAPI", "PostgreSQL"],
        nice_to_have_skills=["Docker", "Kubernetes", "AWS"],
        experience_required=3,
        location="San Francisco, CA",
        salary_max=160000,
        job_type="full-time"
    )
    
    # Calculate match
    result = matcher.calculate_match(candidate, job)
    print(f"Match Score: {result['match_score']}")
    print(f"Reasons: {result['match_reasons']}")
    print(f"Component Scores: {result['component_scores']}")
