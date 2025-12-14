import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import { Briefcase, Loader2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function JobPostingForm() {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        location: '',
        job_type: 'full-time',
        work_mode: 'hybrid',
        salary_min: '',
        salary_max: '',
        salary_currency: 'USD',
        requirements: [''],
        nice_to_have: [''],
        responsibilities: [''],
        benefits: [''],
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Clean up empty arrays
            const cleanData = {
                ...formData,
                salary_min: formData.salary_min ? parseInt(formData.salary_min) : undefined,
                salary_max: formData.salary_max ? parseInt(formData.salary_max) : undefined,
                requirements: formData.requirements.filter(r => r.trim()),
                nice_to_have: formData.nice_to_have.filter(r => r.trim()),
                responsibilities: formData.responsibilities.filter(r => r.trim()),
                benefits: formData.benefits.filter(r => r.trim()),
            };

            await apiClient.createJob(cleanData);

            toast({
                title: 'Job posted successfully!',
                description: 'Your job posting is now live',
            });

            navigate('/employer/jobs');
        } catch (error: any) {
            toast({
                title: 'Error posting job',
                description: error.response?.data?.detail || 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const addArrayItem = (field: 'requirements' | 'nice_to_have' | 'responsibilities' | 'benefits') => {
        setFormData({
            ...formData,
            [field]: [...formData[field], ''],
        });
    };

    const removeArrayItem = (field: 'requirements' | 'nice_to_have' | 'responsibilities' | 'benefits', index: number) => {
        const newArray = formData[field].filter((_, i) => i !== index);
        setFormData({
            ...formData,
            [field]: newArray,
        });
    };

    const updateArrayItem = (field: 'requirements' | 'nice_to_have' | 'responsibilities' | 'benefits', index: number, value: string) => {
        const newArray = [...formData[field]];
        newArray[index] = value;
        setFormData({
            ...formData,
            [field]: newArray,
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" onClick={() => navigate('/employer/dashboard')}>
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back
                        </Button>
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
                                <p className="text-sm text-gray-600">Fill in the details to create your job posting</p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Basic Information</CardTitle>
                            <CardDescription>Essential details about the position</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="title">Job Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Senior Python Developer"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>

                            <div>
                                <Label htmlFor="description">Job Description *</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe the role, what they'll be working on, and what makes this opportunity exciting..."
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    rows={6}
                                    className="resize-none"
                                />
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formData.description.length} characters
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="e.g., San Francisco, CA"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="job_type">Job Type</Label>
                                    <Select value={formData.job_type} onValueChange={(value) => setFormData({ ...formData, job_type: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="full-time">Full-time</SelectItem>
                                            <SelectItem value="part-time">Part-time</SelectItem>
                                            <SelectItem value="contract">Contract</SelectItem>
                                            <SelectItem value="internship">Internship</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div>
                                    <Label htmlFor="work_mode">Work Mode</Label>
                                    <Select value={formData.work_mode} onValueChange={(value) => setFormData({ ...formData, work_mode: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="remote">Remote</SelectItem>
                                            <SelectItem value="hybrid">Hybrid</SelectItem>
                                            <SelectItem value="onsite">On-site</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Compensation */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Compensation</CardTitle>
                            <CardDescription>Salary range and benefits</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="salary_min">Minimum Salary</Label>
                                    <Input
                                        id="salary_min"
                                        type="number"
                                        placeholder="120000"
                                        value={formData.salary_min}
                                        onChange={(e) => setFormData({ ...formData, salary_min: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="salary_max">Maximum Salary</Label>
                                    <Input
                                        id="salary_max"
                                        type="number"
                                        placeholder="180000"
                                        value={formData.salary_max}
                                        onChange={(e) => setFormData({ ...formData, salary_max: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="salary_currency">Currency</Label>
                                    <Select value={formData.salary_currency} onValueChange={(value) => setFormData({ ...formData, salary_currency: value })}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="USD">USD</SelectItem>
                                            <SelectItem value="EUR">EUR</SelectItem>
                                            <SelectItem value="GBP">GBP</SelectItem>
                                            <SelectItem value="INR">INR</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Benefits</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('benefits')}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                {formData.benefits.map((benefit, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input
                                            placeholder="e.g., Health insurance, 401(k) matching"
                                            value={benefit}
                                            onChange={(e) => updateArrayItem('benefits', index, e.target.value)}
                                        />
                                        {formData.benefits.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('benefits', index)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Requirements */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Requirements</CardTitle>
                            <CardDescription>Skills and qualifications needed</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Required Skills *</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('requirements')}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                {formData.requirements.map((req, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input
                                            placeholder="e.g., 5+ years Python experience"
                                            value={req}
                                            onChange={(e) => updateArrayItem('requirements', index, e.target.value)}
                                        />
                                        {formData.requirements.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('requirements', index)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <Label>Nice to Have</Label>
                                    <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('nice_to_have')}>
                                        <Plus className="h-4 w-4 mr-1" />
                                        Add
                                    </Button>
                                </div>
                                {formData.nice_to_have.map((item, index) => (
                                    <div key={index} className="flex gap-2 mb-2">
                                        <Input
                                            placeholder="e.g., Experience with Kubernetes"
                                            value={item}
                                            onChange={(e) => updateArrayItem('nice_to_have', index, e.target.value)}
                                        />
                                        {formData.nice_to_have.length > 1 && (
                                            <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('nice_to_have', index)}>
                                                <Minus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Responsibilities */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Responsibilities</CardTitle>
                            <CardDescription>What will they be doing day-to-day?</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-between items-center mb-2">
                                <Label>Key Responsibilities</Label>
                                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem('responsibilities')}>
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add
                                </Button>
                            </div>
                            {formData.responsibilities.map((resp, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <Input
                                        placeholder="e.g., Lead backend architecture decisions"
                                        value={resp}
                                        onChange={(e) => updateArrayItem('responsibilities', index, e.target.value)}
                                    />
                                    {formData.responsibilities.length > 1 && (
                                        <Button type="button" variant="ghost" size="sm" onClick={() => removeArrayItem('responsibilities', index)}>
                                            <Minus className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Actions */}
                    <div className="flex justify-end gap-4">
                        <Button type="button" variant="outline" onClick={() => navigate('/employer/dashboard')}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Posting...
                                </>
                            ) : (
                                <>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Post Job
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    );
}
