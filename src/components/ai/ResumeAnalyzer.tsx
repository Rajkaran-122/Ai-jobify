import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Loader2,
    CheckCircle2,
    AlertCircle,
    Sparkles,
    FileText,
    TrendingUp,
    Target,
    Lightbulb
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface ResumeAnalyzerProps {
    resumeText?: string;
    targetJobId?: number;
    onAnalysisComplete?: (score: number) => void;
}

interface ATSScore {
    overall_score: number;
    formatting_score: number;
    content_score: number;
    keyword_score: number;
    issues: string[];
    strengths: string[];
    recommendations: string[];
}

interface Suggestion {
    type: string;
    priority: string;
    current_issue: string;
    suggestion: string;
    example?: string;
}

interface AnalysisResult {
    overall_quality_score: number;
    ats_compatibility: ATSScore;
    strengths: string[];
    areas_for_improvement: string[];
    suggestions: Suggestion[];
    keyword_optimization: {
        target_job?: string;
        keyword_match_score: number;
        matched_keywords: string[];
        missing_keywords: string[];
        recommendation: string;
    };
}

export const ResumeAnalyzer: React.FC<ResumeAnalyzerProps> = ({
    resumeText,
    targetJobId,
    onAnalysisComplete
}) => {
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const { toast } = useToast();

    const handleAnalyze = async () => {
        if (!resumeText) {
            toast({
                title: 'No Resume',
                description: 'Please upload a resume first',
                variant: 'destructive',
            });
            return;
        }

        setIsAnalyzing(true);

        try {
            const response = await apiClient.analyzeResume({
                resume_text: resumeText,
                target_job_id: targetJobId
            });

            setAnalysisResult(response);

            if (onAnalysisComplete) {
                onAnalysisComplete(response.overall_quality_score);
            }

            toast({
                title: 'Analysis Complete!',
                description: `Your resume scored ${response.overall_quality_score}/100`,
            });
        } catch (error: any) {
            toast({
                title: 'Analysis Failed',
                description: error.message || 'Failed to analyze resume',
                variant: 'destructive',
            });
        } finally {
            setIsAnalyzing(false);
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBadge = (score: number) => {
        if (score >= 80) return { variant: 'default' as const, label: 'Excellent' };
        if (score >= 60) return { variant: 'secondary' as const, label: 'Good' };
        return { variant: 'destructive' as const, label: 'Needs Work' };
    };

    const getPriorityColor = (priority: string) => {
        if (priority === 'high') return 'destructive';
        if (priority === 'medium') return 'secondary';
        return 'outline';
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Resume Analyzer
                    </CardTitle>
                    <CardDescription>
                        Get instant feedback on your resume's ATS compatibility and quality
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Button
                        onClick={handleAnalyze}
                        disabled={isAnalyzing || !resumeText}
                        className="w-full bg-gradient-primary"
                        size="lg"
                    >
                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Analyze Resume
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {analysisResult && (
                <>
                    {/* Overall Score */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Overall Quality Score</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-6xl font-bold text-gradient">
                                    {analysisResult.overall_quality_score}
                                </div>
                                <Badge {...getScoreBadge(analysisResult.overall_quality_score)}>
                                    {getScoreBadge(analysisResult.overall_quality_score).label}
                                </Badge>
                            </div>
                            <Progress value={analysisResult.overall_quality_score} className="h-3" />
                        </CardContent>
                    </Card>

                    {/* ATS Compatibility */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="w-5 h-5" />
                                ATS Compatibility
                            </CardTitle>
                            <CardDescription>
                                How well your resume works with Applicant Tracking Systems
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Score Breakdown */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Formatting</span>
                                        <span className={`text-lg font-bold ${getScoreColor(analysisResult.ats_compatibility.formatting_score)}`}>
                                            {analysisResult.ats_compatibility.formatting_score}%
                                        </span>
                                    </div>
                                    <Progress value={analysisResult.ats_compatibility.formatting_score} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Content</span>
                                        <span className={`text-lg font-bold ${getScoreColor(analysisResult.ats_compatibility.content_score)}`}>
                                            {analysisResult.ats_compatibility.content_score}%
                                        </span>
                                    </div>
                                    <Progress value={analysisResult.ats_compatibility.content_score} />
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Keywords</span>
                                        <span className={`text-lg font-bold ${getScoreColor(analysisResult.ats_compatibility.keyword_score)}`}>
                                            {analysisResult.ats_compatibility.keyword_score}%
                                        </span>
                                    </div>
                                    <Progress value={analysisResult.ats_compatibility.keyword_score} />
                                </div>
                            </div>

                            {/* Issues & Strengths */}
                            <Tabs defaultValue="issues" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="issues">
                                        Issues ({analysisResult.ats_compatibility.issues.length})
                                    </TabsTrigger>
                                    <TabsTrigger value="strengths">
                                        Strengths ({analysisResult.ats_compatibility.strengths.length})
                                    </TabsTrigger>
                                </TabsList>

                                <TabsContent value="issues" className="space-y-2">
                                    {analysisResult.ats_compatibility.issues.map((issue, idx) => (
                                        <Alert key={idx} variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>{issue}</AlertDescription>
                                        </Alert>
                                    ))}
                                </TabsContent>

                                <TabsContent value="strengths" className="space-y-2">
                                    {analysisResult.ats_compatibility.strengths.map((strength, idx) => (
                                        <Alert key={idx}>
                                            <CheckCircle2 className="h-4 w-4" />
                                            <AlertDescription>{strength}</AlertDescription>
                                        </Alert>
                                    ))}
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>

                    {/* Keyword Optimization */}
                    {targetJobId && analysisResult.keyword_optimization && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Target className="w-5 h-5" />
                                    Keyword Optimization
                                </CardTitle>
                                {analysisResult.keyword_optimization.target_job && (
                                    <CardDescription>
                                        For: {analysisResult.keyword_optimization.target_job}
                                    </CardDescription>
                                )}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Match Score</span>
                                        <span className={`text-2xl font-bold ${getScoreColor(analysisResult.keyword_optimization.keyword_match_score)}`}>
                                            {analysisResult.keyword_optimization.keyword_match_score}%
                                        </span>
                                    </div>
                                    <Progress value={analysisResult.keyword_optimization.keyword_match_score} />
                                    <p className="text-sm text-muted-foreground">
                                        {analysisResult.keyword_optimization.recommendation}
                                    </p>
                                </div>

                                {analysisResult.keyword_optimization.missing_keywords.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">Missing Keywords:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keyword_optimization.missing_keywords.slice(0, 10).map((keyword, idx) => (
                                                <Badge key={idx} variant="destructive">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {analysisResult.keyword_optimization.matched_keywords.length > 0 && (
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-medium">Matched Keywords:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {analysisResult.keyword_optimization.matched_keywords.slice(0, 15).map((keyword, idx) => (
                                                <Badge key={idx} variant="secondary">
                                                    {keyword}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* AI Suggestions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Lightbulb className="w-5 h-5" />
                                AI-Powered Suggestions
                            </CardTitle>
                            <CardDescription>
                                Specific recommendations to improve your resume
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {analysisResult.suggestions.map((suggestion, idx) => (
                                <Card key={idx} className="border-l-4 border-l-primary">
                                    <CardContent className="pt-4 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Badge variant={getPriorityColor(suggestion.priority)}>
                                                {suggestion.priority} priority
                                            </Badge>
                                            <Badge variant="outline">{suggestion.type}</Badge>
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm">{suggestion.current_issue}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                💡 {suggestion.suggestion}
                                            </p>
                                            {suggestion.example && (
                                                <div className="mt-2 p-2 bg-secondary rounded text-xs">
                                                    <strong>Example:</strong> {suggestion.example}
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                                    Strengths
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {analysisResult.strengths.map((strength, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-green-600">•</span>
                                            {strength}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="w-5 h-5 text-yellow-600" />
                                    Areas for Improvement
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {analysisResult.areas_for_improvement.map((area, idx) => (
                                        <li key={idx} className="text-sm flex items-start gap-2">
                                            <span className="text-yellow-600">•</span>
                                            {area}
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </>
            )}
        </div>
    );
};
