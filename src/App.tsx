import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import EmployerDashboardPage from "./pages/employer/EmployerDashboardPage";
import JobPostingForm from "./pages/employer/JobPostingForm";
import CandidateDashboard from "./pages/candidate/Dashboard";
import CandidateProfile from "./pages/candidate/Profile";
import JobSearch from "./pages/candidate/JobSearch";
import AIFeaturesDemo from "./pages/AIFeaturesDemo";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Employer Routes */}
          <Route path="/employer/dashboard" element={<EmployerDashboardPage />} />
          <Route path="/employer/jobs" element={<EmployerDashboardPage />} />
          <Route path="/employer/jobs/new" element={<JobPostingForm />} />
          <Route path="/employer/applicants" element={<EmployerDashboardPage />} />
          <Route path="/employer/analytics" element={<EmployerDashboardPage />} />
          <Route path="/employer/messages" element={<EmployerDashboardPage />} />
          <Route path="/employer/team" element={<EmployerDashboardPage />} />
          <Route path="/employer/settings" element={<EmployerDashboardPage />} />

          {/* Candidate Routes */}
          <Route path="/candidate/dashboard" element={<CandidateDashboard />} />
          <Route path="/candidate/profile" element={<CandidateProfile />} />
          <Route path="/candidate/jobs" element={<JobSearch />} />
          <Route path="/candidate/applications" element={<CandidateDashboard />} />
          <Route path="/candidate/interviews" element={<CandidateDashboard />} />

          {/* AI Features */}
          <Route path="/ai-features" element={<AIFeaturesDemo />} />

          {/* Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
