import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import {
    Briefcase,
    FileText,
    Calendar,
    TrendingUp,
    User,
    Loader2,
    Search,
    BookmarkPlus,
} from 'lucide-react';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    created_at: string;
}

export default function CandidateDashboard() {
    const [user, setUser] = useState<any>(null);
    const [profile, setProfile] = useState<any>(null);
    const [recommendedJobs, setRecommendedJobs] = useState<Job[]>([]);
    const [applications, setApplications] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            const [userData, profileData, jobsData, applicationsData] = await Promise.all([
                apiClient.getCurrentUser(),
                apiClient.getMyProfile().catch(() => null),
                apiClient.getJobs({ limit: 6 }),
                apiClient.getApplications().catch(() => []),
            ]);

            setUser(userData);
            setProfile(profileData);
            setRecommendedJobs(jobsData);
            setApplications(applicationsData);
        } catch (error) {
            toast({
                title: 'Error loading dashboard',
                description: 'Please try refreshing the page',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const getProfileCompleteness = () => {
        if (!profile) return 0;
        let score = 0;
        if (profile.first_name) score += 15;
        if (profile.last_name) score += 15;
        if (profile.phone) score += 10;
        if (profile.location) score += 10;
        if (profile.resume_url) score += 20;
        if (profile.skills && profile.skills.length > 0) score += 15;
        if (profile.education && profile.education.length > 0) score += 10;
        if (profile.work_experience && profile.work_experience.length > 0) score += 15;
        return score;
    };

    const profileScore = getProfileCompleteness();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            {/* Header */}
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">TalentAI Pro</h1>
                                <p className="text-sm text-gray-600">Candidate Dashboard</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" onClick={() => navigate('/candidate/profile')}>
                                <User className="h-4 w-4 mr-2" />
                                Profile
                            </Button>
                            <Button variant="ghost" onClick={() => apiClient.logout()}>
                                Logout
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Welcome back, {profile?.first_name || 'there'}! 👋
                    </h2>
                    <p className="text-gray-600">
                        Here's what's happening with your job search today.
                    </p>
                </div>

                {/* Profile Completeness Alert */}
                {profileScore < 100 && (
                    <Card className="mb-6 border-l-4 border-l-yellow-500 bg-yellow-50">
                        <CardContent className="pt-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-yellow-900">
                                        Complete your profile ({profileScore}%)
                                    </h3>
                                    <p className="text-sm text-yellow-700 mt-1">
                                        A complete profile increases your chances of getting matched with relevant jobs
                                    </p>
                                </div>
                                <Button
                                    onClick={() => navigate('/candidate/profile')}
                                    className="bg-yellow-600 hover:bg-yellow-700"
                                >
                                    Complete Profile
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Applications</CardTitle>
                            <FileText className="h-4 w-4 text-blue-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{applications.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">Total submitted</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                            <Calendar className="h-4 w-4 text-green-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">0</div>
                            <p className="text-xs text-muted-foreground mt-1">Upcoming</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Matches</CardTitle>
                            <TrendingUp className="h-4 w-4 text-purple-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{recommendedJobs.length}</div>
                            <p className="text-xs text-muted-foreground mt-1">AI-recommended jobs</p>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Profile Score</CardTitle>
                            <User className="h-4 w-4 text-orange-600" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{profileScore}%</div>
                            <p className="text-xs text-muted-foreground mt-1">Completeness</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Recommended Jobs Section */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
                        <Button variant="outline" onClick={() => navigate('/candidate/jobs')}>
                            <Search className="h-4 w-4 mr-2" />
                            View All Jobs
                        </Button>
                    </div>

                    {recommendedJobs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {recommendedJobs.map((job) => (
                                <Card key={job.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                                    <CardHeader>
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                                                <p className="text-sm text-muted-foreground">{job.location}</p>
                                            </div>
                                            <Button variant="ghost" size="sm">
                                                <BookmarkPlus className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                            {job.description}
                                        </p>
                                        {job.salary_min && job.salary_max && (
                                            <p className="text-sm font-semibold text-green-600 mb-4">
                                                ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                                            </p>
                                        )}
                                        <Button
                                            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                            onClick={() => {
                                                // Apply to job
                                                apiClient
                                                    .createApplication(job.id)
                                                    .then(() => {
                                                        toast({
                                                            title: 'Application submitted!',
                                                            description: 'Good luck with your application',
                                                        });
                                                        loadDashboardData();
                                                    })
                                                    .catch(() => {
                                                        toast({
                                                            title: 'Error',
                                                            description: 'You may have already applied to this job',
                                                            variant: 'destructive',
                                                        });
                                                    });
                                            }}
                                        >
                                            Quick Apply
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <Search className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600 mb-4">No recommended jobs yet</p>
                                <Button onClick={() => navigate('/candidate/jobs')}>Browse Jobs</Button>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Recent Applications */}
                <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Applications</h3>
                    {applications.length > 0 ? (
                        <Card>
                            <CardContent className="p-0">
                                <div className="divide-y">
                                    {applications.slice(0, 5).map((app) => (
                                        <div key={app.id} className="p-4 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <p className="font-medium">Application #{app.id.substring(0, 8)}</p>
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        Applied on {new Date(app.applied_at).toLocaleDateString()}
                                                    </p>
                                                </div>
                                                <Badge variant={
                                                    app.status === 'interview' ? 'default' :
                                                        app.status === 'rejected' ? 'destructive' :
                                                            'secondary'
                                                }>
                                                    {app.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <FileText className="h-12 w-12 text-gray-400 mb-4" />
                                <p className="text-gray-600">No applications yet</p>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}
