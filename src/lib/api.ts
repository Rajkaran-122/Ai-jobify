/**
 * API Client for TalentAI Pro
 * Centralized Axios instance with authentication and error handling
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

class ApiClient {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: API_BASE_URL,
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Request interceptor - add auth token
        this.client.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('access_token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );

        // Response interceptor - handle errors and token refresh
        this.client.interceptors.response.use(
            (response) => response,
            async (error: AxiosError) => {
                const originalRequest = error.config;

                // Handle 401 Unauthorized
                if (error.response?.status === 401 && originalRequest) {
                    // Try to refresh token
                    const refreshToken = localStorage.getItem('refresh_token');
                    if (refreshToken) {
                        try {
                            const response = await axios.post(`${API_BASE_URL}/api/v1/auth/refresh`, {
                                refresh_token: refreshToken,
                            });

                            const { access_token, refresh_token: new_refresh_token } = response.data;
                            localStorage.setItem('access_token', access_token);
                            localStorage.setItem('refresh_token', new_refresh_token);

                            // Retry original request
                            originalRequest.headers.Authorization = `Bearer ${access_token}`;
                            return this.client(originalRequest);
                        } catch (refreshError) {
                            // Refresh failed, logout user
                            localStorage.removeItem('access_token');
                            localStorage.removeItem('refresh_token');
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    } else {
                        // No refresh token, redirect to login
                        window.location.href = '/login';
                    }
                }

                return Promise.reject(error);
            }
        );
    }

    // Auth endpoints
    async register(email: string, password: string, role: 'employer' | 'candidate') {
        const response = await this.client.post('/api/v1/auth/register', {
            email,
            password,
            role,
        });
        return response.data;
    }

    async login(email: string, password: string) {
        const response = await this.client.post('/api/v1/auth/login', {
            email,
            password,
        });

        const { access_token, refresh_token } = response.data;
        localStorage.setItem('access_token', access_token);
        localStorage.setItem('refresh_token', refresh_token);

        return response.data;
    }

    async getCurrentUser() {
        const response = await this.client.get('/api/v1/auth/me');
        return response.data;
    }

    logout() {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
    }

    // Job endpoints
    async getJobs(params?: { skip?: number; limit?: number; status?: string }) {
        const response = await this.client.get('/api/v1/jobs', { params });
        return response.data;
    }

    async getJob(jobId: string) {
        const response = await this.client.get(`/api/v1/jobs/${jobId}`);
        return response.data;
    }

    async createJob(jobData: any) {
        const response = await this.client.post('/api/v1/jobs', jobData);
        return response.data;
    }

    async updateJob(jobId: string, jobData: any) {
        const response = await this.client.put(`/api/v1/jobs/${jobId}`, jobData);
        return response.data;
    }

    async deleteJob(jobId: string) {
        await this.client.delete(`/api/v1/jobs/${jobId}`);
    }

    // Application endpoints
    async getApplications(jobId?: string) {
        const params = jobId ? { job_id: jobId } : {};
        const response = await this.client.get('/api/v1/applications', { params });
        return response.data;
    }

    async createApplication(jobId: string, coverLetter?: string) {
        const response = await this.client.post('/api/v1/applications', {
            job_id: jobId,
            cover_letter: coverLetter,
        });
        return response.data;
    }

    // Candidate profile endpoints
    async getMyProfile() {
        const response = await this.client.get('/api/v1/candidates/me');
        return response.data;
    }

    async updateMyProfile(profileData: any) {
        const response = await this.client.put('/api/v1/candidates/me', profileData);
        return response.data;
    }

    // Employer profile endpoints
    async getMyEmployerProfile() {
        const response = await this.client.get('/api/v1/employers/me');
        return response.data;
    }

    async updateMyEmployerProfile(profileData: any) {
        const response = await this.client.put('/api/v1/employers/me', profileData);
        return response.data;
    }

    // AI Features endpoints
    async generateCoverLetter(data: {
        job_id: number;
        tone?: string;
        custom_points?: string[];
    }) {
        const response = await this.client.post('/api/v1/ai/generate-cover-letter', data);
        return response.data;
    }

    async analyzeResume(data: {
        resume_text?: string;
        target_job_id?: number;
    }) {
        const response = await this.client.post('/api/v1/ai/analyze-resume', data);
        return response.data;
    }

    async optimizeKeywords(jobId: number, resumeText: string) {
        const response = await this.client.post('/api/v1/ai/optimize-keywords', null, {
            params: { job_id: jobId },
            data: { resume_text: resumeText }
        });
        return response.data;
    }

    async getAIUsageStats() {
        const response = await this.client.get('/api/v1/ai/usage-stats');
        return response.data;
    }

    async getMatchScore(jobId: number) {
        const response = await this.client.get(`/api/v1/ai/match-score/${jobId}`);
        return response.data;
    }
}

export const apiClient = new ApiClient();
export default apiClient;
