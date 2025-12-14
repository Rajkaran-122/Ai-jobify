import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { JobPostingsTable } from '@/components/dashboard/JobPostingsTable';
import { ApplicantPipeline } from '@/components/dashboard/ApplicantPipeline';
import { AnalyticsCharts } from '@/components/dashboard/AnalyticsCharts';
import { TopApplicants } from '@/components/dashboard/TopApplicants';
import { UpcomingInterviews } from '@/components/dashboard/UpcomingInterviews';
import { TeamMembersList } from '@/components/dashboard/TeamMembersList';
import { Briefcase, Users, Calendar, CheckCircle, Plus, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Mock Data
const stats = [
  { title: 'Active Jobs', value: 8, change: '+2 this week', changeType: 'positive' as const, icon: Briefcase, iconColor: 'bg-primary/10 text-primary' },
  { title: 'Total Applicants', value: 156, change: '+24 new', changeType: 'positive' as const, icon: Users, iconColor: 'bg-accent/10 text-accent' },
  { title: 'Interviews Scheduled', value: 12, change: '3 today', changeType: 'neutral' as const, icon: Calendar, iconColor: 'bg-warning/10 text-warning' },
  { title: 'Hired This Month', value: 3, change: '+1 vs last month', changeType: 'positive' as const, icon: CheckCircle, iconColor: 'bg-success/10 text-success' },
];

const jobs = [
  { id: '1', title: 'Senior Frontend Developer', department: 'Engineering', location: 'San Francisco, CA', type: 'Full-time', applicants: 45, views: 320, status: 'active' as const, postedAt: 'Dec 1, 2024', expiresAt: 'Jan 1, 2025' },
  { id: '2', title: 'Product Manager', department: 'Product', location: 'Remote', type: 'Full-time', applicants: 32, views: 245, status: 'active' as const, postedAt: 'Nov 28, 2024', expiresAt: 'Dec 28, 2024' },
  { id: '3', title: 'UX Designer', department: 'Design', location: 'New York, NY', type: 'Full-time', applicants: 28, views: 189, status: 'active' as const, postedAt: 'Nov 25, 2024', expiresAt: 'Dec 25, 2024' },
  { id: '4', title: 'Data Analyst', department: 'Analytics', location: 'Austin, TX', type: 'Contract', applicants: 18, views: 156, status: 'paused' as const, postedAt: 'Nov 20, 2024', expiresAt: 'Dec 20, 2024' },
  { id: '5', title: 'DevOps Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', applicants: 24, views: 210, status: 'draft' as const, postedAt: '-', expiresAt: '-' },
];

const pipelineStages = [
  { name: 'Applied', count: 156, color: 'bg-muted' },
  { name: 'Screening', count: 45, color: 'bg-primary/20' },
  { name: 'Interview', count: 18, color: 'bg-warning/20' },
  { name: 'Offer', count: 5, color: 'bg-accent/20' },
  { name: 'Hired', count: 3, color: 'bg-success/20' },
];

const topApplicants = [
  { id: '1', name: 'Sarah Chen', role: 'Senior Frontend Developer', initials: 'SC', location: 'San Francisco, CA', appliedAt: '2 days ago', matchScore: 95, stage: 'Interview', skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'GraphQL'] },
  { id: '2', name: 'Michael Park', role: 'Product Manager', initials: 'MP', location: 'New York, NY', appliedAt: '3 days ago', matchScore: 92, stage: 'Screening', skills: ['Product Strategy', 'Agile', 'Data Analysis', 'SQL'] },
  { id: '3', name: 'Emily Johnson', role: 'UX Designer', initials: 'EJ', location: 'Austin, TX', appliedAt: '1 day ago', matchScore: 88, stage: 'Applied', skills: ['Figma', 'User Research', 'Prototyping', 'Design Systems'] },
];

const upcomingInterviews = [
  { id: '1', candidateName: 'Sarah Chen', candidateInitials: 'SC', position: 'Senior Frontend Developer', date: 'Today', time: '2:00 PM', type: 'video' as const, status: 'today' as const },
  { id: '2', candidateName: 'David Kim', candidateInitials: 'DK', position: 'Product Manager', date: 'Tomorrow', time: '10:00 AM', type: 'video' as const, status: 'upcoming' as const },
  { id: '3', candidateName: 'Lisa Wang', candidateInitials: 'LW', position: 'UX Designer', date: 'Dec 10', time: '3:30 PM', type: 'in-person' as const, status: 'upcoming' as const },
];

const teamMembers = [
  { id: '1', name: 'John Doe', email: 'john.doe@techcorp.com', role: 'admin' as const, initials: 'JD', lastActive: '2 min ago', jobsManaged: 8 },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@techcorp.com', role: 'manager' as const, initials: 'JS', lastActive: '1 hour ago', jobsManaged: 5 },
  { id: '3', name: 'Mike Johnson', email: 'mike.johnson@techcorp.com', role: 'recruiter' as const, initials: 'MJ', lastActive: '3 hours ago', jobsManaged: 3 },
  { id: '4', name: 'Sarah Williams', email: 'sarah.williams@techcorp.com', role: 'recruiter' as const, initials: 'SW', lastActive: 'Yesterday', jobsManaged: 4 },
  { id: '5', name: 'Tom Brown', email: 'tom.brown@techcorp.com', role: 'viewer' as const, initials: 'TB', lastActive: '2 days ago', jobsManaged: 0 },
];

const EmployerDashboardPage = () => {
  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's what's happening with your hiring.</p>
        </div>
        <Button className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg">
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Pipeline */}
      <div className="mb-8">
        <ApplicantPipeline stages={pipelineStages} />
      </div>

      {/* Tabs Section */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="bg-secondary/50 border border-border p-1">
          <TabsTrigger value="overview" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
            Overview
          </TabsTrigger>
          <TabsTrigger value="jobs" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
            Job Postings
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="team" className="data-[state=active]:bg-card data-[state=active]:text-foreground">
            Team
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid lg:grid-cols-2 gap-6">
            <TopApplicants applicants={topApplicants} />
            <UpcomingInterviews interviews={upcomingInterviews} />
          </div>

          {/* Recent Jobs Table */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Recent Job Postings</h3>
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
            <JobPostingsTable jobs={jobs.slice(0, 3)} />
          </div>
        </TabsContent>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="border-border hover:bg-secondary">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
          <JobPostingsTable jobs={jobs} />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics">
          <AnalyticsCharts />
        </TabsContent>

        {/* Team Tab */}
        <TabsContent value="team">
          <TeamMembersList members={teamMembers} />
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
};

export default EmployerDashboardPage;
