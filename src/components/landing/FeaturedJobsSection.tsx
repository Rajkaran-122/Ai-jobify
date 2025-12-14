import { MapPin, Clock, DollarSign, Bookmark, ArrowRight, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

const featuredJobs = [
  {
    id: 1,
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    logo: '🏢',
    location: 'San Francisco, CA',
    type: 'Full-time',
    salary: '$120k - $180k',
    tags: ['React', 'TypeScript', 'Next.js'],
    matchScore: 95,
    postedAt: '2 days ago',
    isRemote: true,
  },
  {
    id: 2,
    title: 'Product Manager',
    company: 'StartupXYZ',
    logo: '🚀',
    location: 'New York, NY',
    type: 'Full-time',
    salary: '$140k - $200k',
    tags: ['Product Strategy', 'Agile', 'B2B SaaS'],
    matchScore: 88,
    postedAt: '1 day ago',
    isRemote: false,
  },
  {
    id: 3,
    title: 'Machine Learning Engineer',
    company: 'AI Labs',
    logo: '🤖',
    location: 'Remote',
    type: 'Full-time',
    salary: '$150k - $220k',
    tags: ['Python', 'TensorFlow', 'MLOps'],
    matchScore: 92,
    postedAt: '3 days ago',
    isRemote: true,
  },
  {
    id: 4,
    title: 'UX Designer',
    company: 'DesignCo',
    logo: '🎨',
    location: 'Austin, TX',
    type: 'Full-time',
    salary: '$90k - $130k',
    tags: ['Figma', 'User Research', 'Prototyping'],
    matchScore: 85,
    postedAt: '5 days ago',
    isRemote: true,
  },
];

const getMatchScoreColor = (score: number) => {
  if (score >= 90) return 'bg-success text-success-foreground';
  if (score >= 80) return 'bg-warning text-warning-foreground';
  return 'bg-muted text-muted-foreground';
};

export const FeaturedJobsSection = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookmarkedJobs, setBookmarkedJobs] = useState<number[]>([]);

  const handleApply = (jobId: number, jobTitle: string) => {
    // Check if user is logged in (you can implement proper auth check)
    const token = localStorage.getItem('token');

    if (!token) {
      toast({
        title: 'Login Required',
        description: 'Please login to apply for jobs',
        variant: 'destructive',
      });
      navigate('/login');
      return;
    }

    // Navigate to candidate dashboard or show application modal
    toast({
      title: 'Application Started',
      description: `Applying for ${jobTitle}...`,
    });
    navigate('/candidate/dashboard');
  };

  const handleBookmark = (jobId: number) => {
    if (bookmarkedJobs.includes(jobId)) {
      setBookmarkedJobs(bookmarkedJobs.filter(id => id !== jobId));
      toast({
        title: 'Removed from saved jobs',
      });
    } else {
      setBookmarkedJobs([...bookmarkedJobs, jobId]);
      toast({
        title: 'Job saved!',
        description: 'Added to your saved jobs',
      });
    }
  };

  const handleViewAllJobs = () => {
    navigate('/candidate/jobs');
  };

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">
              Featured <span className="text-gradient">Jobs</span>
            </h2>
            <p className="text-muted-foreground">
              Top opportunities from leading companies, matched just for you.
            </p>
          </div>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80 self-start sm:self-auto"
            onClick={handleViewAllJobs}
          >
            View All Jobs
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {/* Jobs Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {featuredJobs.map((job, index) => (
            <div
              key={job.id}
              className="group glass rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => navigate('/candidate/jobs')}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center text-2xl">
                    {job.logo}
                  </div>

                  {/* Job Info */}
                  <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                      <span>{job.company}</span>
                      {job.isRemote && (
                        <Badge variant="secondary" className="bg-primary/10 text-primary border-0 text-xs">
                          Remote
                        </Badge>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {job.title}
                    </h3>
                  </div>
                </div>

                {/* Bookmark */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(job.id);
                  }}
                  className={`p-2 rounded-lg hover:bg-secondary transition-colors ${bookmarkedJobs.includes(job.id)
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  <Bookmark className={`w-5 h-5 ${bookmarkedJobs.includes(job.id) ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {job.type}
                </span>
                <span className="flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4" />
                  {job.salary}
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {job.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 text-xs rounded-full bg-secondary text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <span className="text-sm text-muted-foreground">{job.postedAt}</span>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${getMatchScoreColor(job.matchScore)}`}>
                    {job.matchScore}% Match
                  </span>
                  <Button
                    size="sm"
                    className="bg-gradient-primary hover:opacity-90 text-primary-foreground"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApply(job.id, job.title);
                    }}
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
