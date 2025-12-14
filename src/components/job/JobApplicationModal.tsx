import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';
import {
    Upload,
    FileText,
    Loader2,
    Sparkles,
    CheckCircle2,
    Edit,
    X,
    Plus
} from 'lucide-react';

interface JobApplicationModalProps {
    isOpen: boolean;
    onClose: () => void;
    jobId: string;
    jobTitle: string;
    companyName: string;
    onSuccess?: () => void;
}

interface ApplicationData {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    experience: string;
    education: string;
    skills: string[];
    coverLetter: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    resumeFile?: File;
}

export const JobApplicationModal: React.FC<JobApplicationModalProps> = ({
    isOpen,
    onClose,
    jobId,
    jobTitle,
    companyName,
    onSuccess
}) => {
    const [step, setStep] = useState<'upload' | 'form' | 'review'>('upload');
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [isParsingResume, setIsParsingResume] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);

    const [applicationData, setApplicationData] = useState<ApplicationData>({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        experience: '',
        education: '',
        skills: [],
        coverLetter: '',
        linkedinUrl: '',
        portfolioUrl: '',
    });

    const [newSkill, setNewSkill] = useState('');
    const { toast } = useToast();

    const handleFileUpload = async (file: File) => {
        if (!file) return;

        // Check file type
        const validTypes = ['application/pdf', 'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'text/plain'];

        if (!validTypes.includes(file.type)) {
            toast({
                title: 'Invalid file type',
                description: 'Please upload a PDF, DOC, DOCX, or TXT file',
                variant: 'destructive',
            });
            return;
        }

        // Check file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            toast({
                title: 'File too large',
                description: 'Please upload a file smaller than 5MB',
                variant: 'destructive',
            });
            return;
        }

        setResumeFile(file);
        setIsParsingResume(true);

        try {
            // Read file as text
            const text = await readFileAsText(file);

            // Parse with AI (using our resume parser)
            const parsedData = await parseResumeWithAI(text);

            // Auto-fill form
            setApplicationData(prev => ({
                ...prev,
                fullName: parsedData.name || prev.fullName,
                email: parsedData.email || prev.email,
                phone: parsedData.phone || prev.phone,
                location: parsedData.location || prev.location,
                experience: parsedData.experience || prev.experience,
                education: parsedData.education || prev.education,
                skills: parsedData.skills || prev.skills,
                resumeFile: file,
            }));

            toast({
                title: 'Resume parsed successfully!',
                description: 'Your details have been auto-filled. Please review and edit if needed.',
            });

            // Move to form step
            setStep('form');
        } catch (error) {
            toast({
                title: 'Parsing failed',
                description: 'We couldn\'t parse your resume automatically. Please fill the form manually.',
                variant: 'destructive',
            });
            setStep('form');
        } finally {
            setIsParsingResume(false);
        }
    };

    const readFileAsText = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target?.result as string);
            reader.onerror = reject;
            reader.readAsText(file);
        });
    };

    const parseResumeWithAI = async (text: string) => {
        // Call our backend resume parser
        // For now, simple extraction (can be replaced with actual API call)

        // Extract email
        const emailMatch = text.match(/[\w.-]+@[\w.-]+\.\w+/);
        const email = emailMatch ? emailMatch[0] : '';

        // Extract phone
        const phoneMatch = text.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
        const phone = phoneMatch ? phoneMatch[0] : '';

        // Extract skills (common technical skills)
        const commonSkills = [
            'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'TypeScript',
            'Angular', 'Vue', 'Django', 'Flask', 'FastAPI', 'AWS', 'Docker',
            'Kubernetes', 'MongoDB', 'PostgreSQL', 'MySQL', 'Git', 'CI/CD',
            'Machine Learning', 'TensorFlow', 'PyTorch', 'SQL', 'NoSQL'
        ];

        const foundSkills = commonSkills.filter(skill =>
            text.toLowerCase().includes(skill.toLowerCase())
        );

        // Extract name (usually first line)
        const lines = text.split('\n').filter(line => line.trim());
        const name = lines[0]?.trim() || '';

        return {
            name,
            email,
            phone,
            location: '',
            experience: '',
            education: '',
            skills: foundSkills,
        };
    };

    const handleGenerateCoverLetter = async () => {
        setIsGeneratingCoverLetter(true);
        try {
            const response = await apiClient.generateCoverLetter({
                job_id: parseInt(jobId),
                tone: 'professional',
            });

            setApplicationData(prev => ({
                ...prev,
                coverLetter: response.cover_letter,
            }));

            toast({
                title: 'Cover letter generated!',
                description: 'AI-powered cover letter added. Feel free to customize it.',
            });
        } catch (error) {
            toast({
                title: 'Generation failed',
                description: 'Please write your cover letter manually',
                variant: 'destructive',
            });
        } finally {
            setIsGeneratingCoverLetter(false);
        }
    };

    const handleSubmit = async () => {
        // Validation
        if (!applicationData.fullName || !applicationData.email || !applicationData.phone) {
            toast({
                title: 'Missing required fields',
                description: 'Please fill in your name, email, and phone number',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            await apiClient.createApplication(jobId, applicationData.coverLetter);

            toast({
                title: 'Application submitted!',
                description: `Your application for ${jobTitle} has been sent successfully.`,
            });

            onSuccess?.();
            onClose();
        } catch (error: any) {
            toast({
                title: 'Submission failed',
                description: error.message || 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const addSkill = () => {
        if (newSkill.trim() && !applicationData.skills.includes(newSkill.trim())) {
            setApplicationData(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()],
            }));
            setNewSkill('');
        }
    };

    const removeSkill = (skill: string) => {
        setApplicationData(prev => ({
            ...prev,
            skills: prev.skills.filter(s => s !== skill),
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl">Apply for {jobTitle}</DialogTitle>
                    <DialogDescription>
                        {companyName} • {step === 'upload' ? 'Upload Resume' : step === 'form' ? 'Application Details' : 'Review & Submit'}
                    </DialogDescription>
                </DialogHeader>

                {/* Step Indicator */}
                <div className="flex items-center justify-center gap-2 my-4">
                    <div className={`flex items-center gap-2 ${step === 'upload' ? 'text-primary' : 'text-green-600'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'upload' ? 'bg-primary text-white' : 'bg-green-600 text-white'
                            }`}>
                            {step !== 'upload' ? <CheckCircle2 className="w-5 h-5" /> : '1'}
                        </div>
                        <span className="text-sm font-medium">Upload</span>
                    </div>
                    <div className="w-12 h-0.5 bg-gray-300" />
                    <div className={`flex items-center gap-2 ${step === 'form' ? 'text-primary' : step === 'review' ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'form' ? 'bg-primary text-white' :
                                step === 'review' ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            {step === 'review' ? <CheckCircle2 className="w-5 h-5" /> : '2'}
                        </div>
                        <span className="text-sm font-medium">Details</span>
                    </div>
                    <div className="w-12 h-0.5 bg-gray-300" />
                    <div className={`flex items-center gap-2 ${step === 'review' ? 'text-primary' : 'text-gray-400'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'review' ? 'bg-primary text-white' : 'bg-gray-300 text-gray-600'
                            }`}>
                            3
                        </div>
                        <span className="text-sm font-medium">Review</span>
                    </div>
                </div>

                {/* Step 1: Upload Resume */}
                {step === 'upload' && (
                    <div className="space-y-6">
                        <Tabs defaultValue="upload">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="upload">Upload Resume</TabsTrigger>
                                <TabsTrigger value="manual" onClick={() => setStep('form')}>Fill Manually</TabsTrigger>
                            </TabsList>

                            <TabsContent value="upload" className="space-y-4">
                                <div
                                    className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary transition-colors cursor-pointer"
                                    onDragOver={(e) => e.preventDefault()}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        const file = e.dataTransfer.files[0];
                                        if (file) handleFileUpload(file);
                                    }}
                                    onClick={() => document.getElementById('resume-upload')?.click()}
                                >
                                    {isParsingResume ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <Loader2 className="w-12 h-12 animate-spin text-primary" />
                                            <p className="text-lg font-medium">Parsing your resume...</p>
                                            <p className="text-sm text-muted-foreground">This will only take a moment</p>
                                        </div>
                                    ) : resumeFile ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <CheckCircle2 className="w-12 h-12 text-green-600" />
                                            <p className="text-lg font-medium">{resumeFile.name}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {(resumeFile.size / 1024).toFixed(2)} KB
                                            </p>
                                            <Button variant="outline" size="sm" onClick={(e) => {
                                                e.stopPropagation();
                                                setResumeFile(null);
                                            }}>
                                                Choose Different File
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-4">
                                            <Upload className="w-12 h-12 text-gray-400" />
                                            <div>
                                                <p className="text-lg font-medium">Drop your resume here</p>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    or click to browse
                                                </p>
                                            </div>
                                            <Badge variant="secondary">PDF, DOC, DOCX, TXT • Max 5MB</Badge>
                                        </div>
                                    )}
                                    <input
                                        id="resume-upload"
                                        type="file"
                                        accept=".pdf,.doc,.docx,.txt"
                                        className="hidden"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) handleFileUpload(file);
                                        }}
                                    />
                                </div>

                                <Card className="bg-blue-50 border-blue-200">
                                    <CardContent className="pt-4">
                                        <div className="flex gap-3">
                                            <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                                            <div className="text-sm text-blue-900">
                                                <p className="font-medium mb-1">AI-Powered Auto-Fill</p>
                                                <p className="text-blue-700">
                                                    Upload your resume and we'll automatically extract your information using AI.
                                                    You can review and edit everything before submitting.
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                )}

                {/* Step 2: Form Details */}
                {step === 'form' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            {/* Personal Information */}
                            <div className="col-span-2">
                                <h3 className="font-semibold text-lg mb-4">Personal Information</h3>
                            </div>

                            <div>
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                    id="fullName"
                                    value={applicationData.fullName}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, fullName: e.target.value }))}
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={applicationData.email}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, email: e.target.value }))}
                                    placeholder="john@example.com"
                                />
                            </div>

                            <div>
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    value={applicationData.phone}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, phone: e.target.value }))}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>

                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    value={applicationData.location}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, location: e.target.value }))}
                                    placeholder="San Francisco, CA"
                                />
                            </div>

                            {/* Professional Details */}
                            <div className="col-span-2 mt-4">
                                <h3 className="font-semibold text-lg mb-4">Professional Details</h3>
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="experience">Work Experience</Label>
                                <Textarea
                                    id="experience"
                                    value={applicationData.experience}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, experience: e.target.value }))}
                                    placeholder="Briefly describe your work experience..."
                                    rows={4}
                                />
                            </div>

                            <div className="col-span-2">
                                <Label htmlFor="education">Education</Label>
                                <Textarea
                                    id="education"
                                    value={applicationData.education}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, education: e.target.value }))}
                                    placeholder="Your education background..."
                                    rows={3}
                                />
                            </div>

                            {/* Skills */}
                            <div className="col-span-2">
                                <Label>Skills</Label>
                                <div className="flex gap-2 mt-2">
                                    <Input
                                        value={newSkill}
                                        onChange={(e) => setNewSkill(e.target.value)}
                                        placeholder="Add a skill..."
                                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                    />
                                    <Button type="button" onClick={addSkill} size="icon">
                                        <Plus className="w-4 h-4" />
                                    </Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {applicationData.skills.map((skill) => (
                                        <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                                            {skill}
                                            <button
                                                onClick={() => removeSkill(skill)}
                                                className="ml-1 hover:bg-red-100 rounded-full p-0.5"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {/* Links */}
                            <div>
                                <Label htmlFor="linkedinUrl">LinkedIn (Optional)</Label>
                                <Input
                                    id="linkedinUrl"
                                    value={applicationData.linkedinUrl}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                                    placeholder="https://linkedin.com/in/..."
                                />
                            </div>

                            <div>
                                <Label htmlFor="portfolioUrl">Portfolio (Optional)</Label>
                                <Input
                                    id="portfolioUrl"
                                    value={applicationData.portfolioUrl}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                                    placeholder="https://yourportfolio.com"
                                />
                            </div>

                            {/* Cover Letter */}
                            <div className="col-span-2 mt-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label htmlFor="coverLetter">Cover Letter</Label>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="sm"
                                        onClick={handleGenerateCoverLetter}
                                        disabled={isGeneratingCoverLetter}
                                    >
                                        {isGeneratingCoverLetter ? (
                                            <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</>
                                        ) : (
                                            <><Sparkles className="w-4 h-4 mr-2" /> Generate with AI</>
                                        )}
                                    </Button>
                                </div>
                                <Textarea
                                    id="coverLetter"
                                    value={applicationData.coverLetter}
                                    onChange={(e) => setApplicationData(prev => ({ ...prev, coverLetter: e.target.value }))}
                                    placeholder="Write a compelling cover letter..."
                                    rows={8}
                                />
                            </div>
                        </div>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => setStep('upload')}>
                                Back
                            </Button>
                            <Button onClick={() => setStep('review')}>
                                Review Application
                            </Button>
                        </div>
                    </div>
                )}

                {/* Step 3: Review */}
                {step === 'review' && (
                    <div className="space-y-6">
                        <Card>
                            <CardContent className="pt-6 space-y-4">
                                <div>
                                    <h4 className="font-semibold text-sm text-muted-foreground mb-2">Personal Information</h4>
                                    <p className="font-medium">{applicationData.fullName}</p>
                                    <p className="text-sm text-muted-foreground">{applicationData.email}</p>
                                    <p className="text-sm text-muted-foreground">{applicationData.phone}</p>
                                    {applicationData.location && (
                                        <p className="text-sm text-muted-foreground">{applicationData.location}</p>
                                    )}
                                </div>

                                {applicationData.skills.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Skills</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {applicationData.skills.map((skill) => (
                                                <Badge key={skill} variant="secondary">{skill}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {applicationData.experience && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Experience</h4>
                                        <p className="text-sm whitespace-pre-wrap">{applicationData.experience}</p>
                                    </div>
                                )}

                                {applicationData.education && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Education</h4>
                                        <p className="text-sm whitespace-pre-wrap">{applicationData.education}</p>
                                    </div>
                                )}

                                {applicationData.coverLetter && (
                                    <div>
                                        <h4 className="font-semibold text-sm text-muted-foreground mb-2">Cover Letter</h4>
                                        <p className="text-sm whitespace-pre-wrap">{applicationData.coverLetter}</p>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <div className="flex justify-between pt-4">
                            <Button variant="outline" onClick={() => setStep('form')}>
                                <Edit className="w-4 h-4 mr-2" />
                                Edit Details
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="bg-gradient-primary"
                            >
                                {isSubmitting ? (
                                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
                                ) : (
                                    <>Submit Application</>
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};
