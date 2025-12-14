import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import apiClient from '@/lib/api';
import { Briefcase, Loader2, Save, Upload } from 'lucide-react';

export default function CandidateProfile() {
    const [profile, setProfile] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();

    useEffect(() => {
        loadProfile();
    }, []);

    const loadProfile = async () => {
        try {
            const data = await apiClient.getMyProfile();
            setProfile(data);
        } catch (error) {
            toast({
                title: 'Error loading profile',
                description: 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await apiClient.updateMyProfile(profile);
            toast({
                title: 'Profile updated',
                description: 'Your profile has been saved successfully',
            });
        } catch (error) {
            toast({
                title: 'Error saving profile',
                description: 'Please try again',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
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
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-4">
                            <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                                <Briefcase className="h-5 w-5 text-white" />
                            </div>
                            <h1 className="text-2xl font-bold text-gray-900">Edit Profile</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" onClick={() => navigate('/candidate/dashboard')}>
                                Cancel
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving}>
                                {isSaving ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    {/* Personal Information */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Personal Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="firstName">First Name</Label>
                                    <Input
                                        id="firstName"
                                        value={profile?.first_name || ''}
                                        onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="lastName">Last Name</Label>
                                    <Input
                                        id="lastName"
                                        value={profile?.last_name || ''}
                                        onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="phone">Phone</Label>
                                <Input
                                    id="phone"
                                    value={profile?.phone || ''}
                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label htmlFor="location">Location</Label>
                                <Input
                                    id="location"
                                    placeholder="e.g., San Francisco, CA"
                                    value={profile?.location || ''}
                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Resume */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Resume</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-sm text-gray-600 mb-2">
                                    {profile?.resume_url ? 'Resume uploaded' : 'Upload your resume'}
                                </p>
                                <Button variant="outline">
                                    <Upload className="h-4 w-4 mr-2" />
                                    Choose File
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Skills</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Label htmlFor="skills">Add your skills (comma-separated)</Label>
                            <Input
                                id="skills"
                                placeholder="Python, React, PostgreSQL, Docker"
                                value={profile?.skills?.map((s: any) => s.name || s).join(', ') || ''}
                                onChange={(e) => {
                                    const skills = e.target.value.split(',').map(s => s.trim()).filter(s => s);
                                    setProfile({ ...profile, skills });
                                }}
                            />
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
