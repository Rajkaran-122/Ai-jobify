import React, { useState } from 'react';
import { CoverLetterGenerator } from '@/components/ai/CoverLetterGenerator';
import { ResumeAnalyzer } from '@/components/ai/ResumeAnalyzer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles } from 'lucide-react';

const AIFeaturesDemo = () => {
    const [selectedJobId] = useState(1); // Mock job ID
    const [resumeText] = useState(`
John Doe
john.doe@email.com | 555-1234

PROFESSIONAL SUMMARY
Experienced software engineer with 5+ years in full-stack development, specializing in Python and React. Proven track record of building scalable applications and leading development teams.

EXPERIENCE
Senior Software Engineer - TechCorp (2020-Present)
• Built production-ready ML pipeline processing 1M+ records daily
• Reduced API latency by 60% through optimization
• Led team of 4 developers on major product launch
• Implemented CI/CD pipeline reducing deployment time by 75%

Software Engineer - StartupXYZ (2018-2020)
• Developed RESTful APIs serving 100K+ daily active users
• Created real-time dashboard using React and WebSockets
• Optimized database queries improving performance by 45%

EDUCATION
BS Computer Science - University of Technology (2018)
GPA: 3.8/4.0

SKILLS
Python, JavaScript, React, Node.js, FastAPI, Django, PostgreSQL, MongoDB, Redis, Docker, Kubernetes, AWS, Git, CI/CD, Machine Learning, TensorFlow, scikit-learn
  `.trim());

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <div className="container mx-auto max-w-6xl space-y-6">
                {/* Header */}
                <Card className="bg-gradient-primary text-primary-foreground">
                    <CardHeader>
                        <CardTitle className="text-3xl flex items-center gap-2">
                            <Sparkles className="w-8 h-8" />
                            AI-Powered Features
                        </CardTitle>
                        <CardDescription className="text-primary-foreground/80 text-lg">
                            Experience next-generation job search with AI assistance
                        </CardDescription>
                    </CardHeader>
                </Card>

                {/* Main Content */}
                <Tabs defaultValue="cover-letter" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cover-letter">Cover Letter Generator</TabsTrigger>
                        <TabsTrigger value="resume-analyzer">Resume Analyzer</TabsTrigger>
                    </TabsList>

                    <TabsContent value="cover-letter" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Cover Letter Generator</CardTitle>
                                <CardDescription>
                                    Generate personalized, professional cover letters in seconds
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <CoverLetterGenerator
                                    jobId={selectedJobId}
                                    jobTitle="Senior Python Developer"
                                    companyName="TechCorp Inc."
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>

                    <TabsContent value="resume-analyzer" className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>AI Resume Analyzer</CardTitle>
                                <CardDescription>
                                    Get instant feedback on your resume's quality and ATS compatibility
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ResumeAnalyzer
                                    resumeText={resumeText}
                                    targetJobId={selectedJobId}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>

                {/* Feature Cards */}
                <div className="grid md:grid-cols-3 gap-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">🎯 Smart Matching</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                AI analyzes your profile and matches you with relevant opportunities
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">📊 ATS Optimization</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Ensure your resume passes Applicant Tracking Systems
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">💼 Career Insights</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Get personalized career advice and improvement suggestions
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AIFeaturesDemo;
