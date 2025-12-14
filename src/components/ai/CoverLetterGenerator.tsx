import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Sparkles, Copy, Download, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiClient } from '@/lib/api';

interface CoverLetterGeneratorProps {
    jobId: number;
    jobTitle: string;
    companyName: string;
    onGenerated?: (coverLetter: string) => void;
}

type ToneOption = 'professional' | 'enthusiastic' | 'concise';

export const CoverLetterGenerator: React.FC<CoverLetterGeneratorProps> = ({
    jobId,
    jobTitle,
    companyName,
    onGenerated
}) => {
    const [tone, setTone] = useState<ToneOption>('professional');
    const [customPoints, setCustomPoints] = useState('');
    const [generatedLetter, setGeneratedLetter] = useState('');
    const [keyPoints, setKeyPoints] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [wordCount, setWordCount] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const { toast } = useToast();

    const handleGenerate = async () => {
        setIsGenerating(true);

        try {
            const customPointsList = customPoints
                .split('\n')
                .filter(p => p.trim())
                .map(p => p.trim());

            const response = await apiClient.generateCoverLetter({
                job_id: jobId,
                tone,
                custom_points: customPointsList.length > 0 ? customPointsList : undefined
            });

            setGeneratedLetter(response.cover_letter);
            setKeyPoints(response.key_points_highlighted);
            setSuggestions(response.suggestions);
            setWordCount(response.word_count);

            if (onGenerated) {
                onGenerated(response.cover_letter);
            }

            toast({
                title: 'Cover Letter Generated!',
                description: `${response.word_count} words in ${response.tone_used} tone`,
            });
        } catch (error: any) {
            toast({
                title: 'Generation Failed',
                description: error.message || 'Failed to generate cover letter',
                variant: 'destructive',
            });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedLetter);
        toast({
            title: 'Copied!',
            description: 'Cover letter copied to clipboard',
        });
    };

    const handleDownload = () => {
        const blob = new Blob([generatedLetter], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `cover-letter-${companyName}-${jobTitle}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        toast({
            title: 'Downloaded!',
            description: 'Cover letter saved to your device',
        });
    };

    const toneDescriptions = {
        professional: 'Polished and business-appropriate',
        enthusiastic: 'Passionate and energetic',
        concise: 'Direct and to-the-point'
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-primary" />
                        AI Cover Letter Generator
                    </CardTitle>
                    <CardDescription>
                        Generate a personalized cover letter for {jobTitle} at {companyName}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Tone Selection */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">Tone</label>
                        <Tabs value={tone} onValueChange={(v) => setTone(v as ToneOption)}>
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="professional">Professional</TabsTrigger>
                                <TabsTrigger value="enthusiastic">Enthusiastic</TabsTrigger>
                                <TabsTrigger value="concise">Concise</TabsTrigger>
                            </TabsList>
                        </Tabs>
                        <p className="text-xs text-muted-foreground">
                            {toneDescriptions[tone]}
                        </p>
                    </div>

                    {/* Custom Points */}
                    <div className="space-y-3">
                        <label className="text-sm font-medium">
                            Custom Points to Highlight (Optional)
                        </label>
                        <Textarea
                            placeholder="e.g., Mention remote work experience&#10;Highlight team leadership&#10;Emphasize technical skills"
                            value={customPoints}
                            onChange={(e) => setCustomPoints(e.target.value)}
                            rows={4}
                            className="resize-none"
                        />
                        <p className="text-xs text-muted-foreground">
                            Enter one point per line
                        </p>
                    </div>

                    {/* Generate Button */}
                    <Button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="w-full bg-gradient-primary"
                        size="lg"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 mr-2" />
                                Generate Cover Letter
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Generated Letter */}
            {generatedLetter && (
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Your Cover Letter</CardTitle>
                                <CardDescription>
                                    {wordCount} words • {tone} tone
                                </CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? 'Preview' : 'Edit'}
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopy}
                                >
                                    <Copy className="w-4 h-4 mr-2" />
                                    Copy
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleDownload}
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Download
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleGenerate}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isEditing ? (
                            <Textarea
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                rows={20}
                                className="font-serif"
                            />
                        ) : (
                            <div className="whitespace-pre-wrap font-serif text-sm leading-relaxed">
                                {generatedLetter}
                            </div>
                        )}

                        {/* Key Points */}
                        {keyPoints.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Highlighted Points:</h4>
                                <div className="flex flex-wrap gap-2">
                                    {keyPoints.map((point, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            {point}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="space-y-2">
                                <h4 className="text-sm font-medium">Suggestions:</h4>
                                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                    {suggestions.map((suggestion, idx) => (
                                        <li key={idx}>{suggestion}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
};
