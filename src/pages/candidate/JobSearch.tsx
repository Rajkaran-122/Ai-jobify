import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import { Search, MapPin, DollarSign, Briefcase, Loader2, Filter } from 'lucide-react';
import { JobApplicationModal } from '@/components/job/JobApplicationModal';

interface Job {
    id: string;
    title: string;
    description: string;
    location: string;
    salary_min?: number;
    salary_max?: number;
    job_type?: string;
    work_mode?: string;
    created_at: string;
    employer?: {
        company_name: string;
    };
}

export default function JobSearch() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        loadJobs();
    }, []);

    const loadJobs = async () => {
        try {
            const data = await apiClient.getJobs({ limit: 50 });
            setJobs(data);
        } catch (error) {
            toast({
                title: 'Error loading jobs',
                description: 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredJobs = jobs.filter(job =>
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleApply = (job: Job) => {
        setSelectedJob(job);
        setIsApplicationModalOpen(true);
    };

    const handleApplicationSuccess = () => {
        toast({
            title: 'Application submitted!',
            description: 'Good luck with your application',
        });
        setIsApplicationModalOpen(false);
        setSelectedJob(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Dream Job</h1>
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                            <Input
                                placeholder="Search jobs by title or description..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 h-11"
                            />
                        </div>
                        <Button variant="outline" className="gap-2">
                            <Filter className="h-4 w-4" />
                            Filters
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-4 text-sm text-gray-600">
                    Found {filteredJobs.length} jobs
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredJobs.map((job) => (
                        <Card key={job.id} className="hover:shadow-xl transition-all hover:-translate-y-1">
                            <CardHeader>
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex-1">
                                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {job.job_type && (
                                                <Badge variant="secondary">{job.job_type}</Badge>
                                            )}
                                            {job.work_mode && (
                                                <Badge variant="outline">{job.work_mode}</Badge>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3 mb-4">
                                    <div className="flex items-center text-sm text-gray-600">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        {job.location}
                                    </div>
                                    {job.salary_min && job.salary_max && (
                                        <div className="flex items-center text-sm font-semibold text-green-600">
                                            <DollarSign className="h-4 w-4 mr-2" />
                                            ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                                        </div>
                                    )}
                                </div>

                                <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                                    {job.description}
                                </p>

                                <Button
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                                    onClick={() => handleApply(job)}
                                >
                                    Apply Now
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {filteredJobs.length === 0 && (
                    <Card className="mt-8">
                        <CardContent className="flex flex-col items-center justify-center py-12">
                            <Briefcase className="h-16 w-16 text-gray-400 mb-4" />
                            <p className="text-xl text-gray-600 mb-2">No jobs found</p>
                            <p className="text-sm text-gray-500">Try adjusting your search criteria</p>
                        </CardContent>
                    </Card>
                )}
            </main>

            {/* Application Modal */}
            {selectedJob && (
                <JobApplicationModal
                    isOpen={isApplicationModalOpen}
                    onClose={() => {
                        setIsApplicationModalOpen(false);
                        setSelectedJob(null);
                    }}
                    jobId={selectedJob.id}
                    jobTitle={selectedJob.title}
                    companyName={selectedJob.employer?.company_name || 'Company'}
                    onSuccess={handleApplicationSuccess}
                />
            )}
        </div>
    );
}
