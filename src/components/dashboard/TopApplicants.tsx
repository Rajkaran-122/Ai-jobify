import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star, MapPin, Calendar, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Applicant {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  initials: string;
  location: string;
  appliedAt: string;
  matchScore: number;
  stage: string;
  skills: string[];
}

interface TopApplicantsProps {
  applicants: Applicant[];
}

export const TopApplicants = ({ applicants }: TopApplicantsProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-success bg-success/10';
    if (score >= 80) return 'text-warning bg-warning/10';
    return 'text-muted-foreground bg-muted';
  };

  return (
    <div className="glass rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Top Candidates</h3>
          <p className="text-sm text-muted-foreground">AI-ranked matches</p>
        </div>
        <Button variant="ghost" className="text-primary hover:text-primary/80">
          View All
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      <div className="space-y-4">
        {applicants.map((applicant, index) => (
          <div
            key={applicant.id}
            className="p-4 rounded-xl bg-secondary/30 hover:bg-secondary/50 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              {/* Rank */}
              <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-sm font-bold text-primary-foreground">
                {index + 1}
              </div>

              {/* Avatar */}
              <Avatar className="w-12 h-12">
                <AvatarImage src={applicant.avatar} />
                <AvatarFallback className="bg-primary/10 text-primary">{applicant.initials}</AvatarFallback>
              </Avatar>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {applicant.name}
                    </p>
                    <p className="text-sm text-muted-foreground">{applicant.role}</p>
                  </div>
                  <div className={cn("px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1", getScoreColor(applicant.matchScore))}>
                    <Star className="w-3 h-3" />
                    {applicant.matchScore}%
                  </div>
                </div>

                {/* Meta */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {applicant.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {applicant.appliedAt}
                  </span>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-1.5">
                  {applicant.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground">
                      {skill}
                    </span>
                  ))}
                  {applicant.skills.length > 3 && (
                    <span className="px-2 py-0.5 text-xs rounded-full bg-secondary text-muted-foreground">
                      +{applicant.skills.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/50">
              <Button size="sm" className="flex-1 bg-gradient-primary hover:opacity-90 text-primary-foreground">
                Schedule Interview
              </Button>
              <Button size="sm" variant="outline" className="flex-1 border-border hover:bg-secondary">
                View Profile
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
