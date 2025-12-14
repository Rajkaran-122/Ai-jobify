import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative glass rounded-3xl p-8 md:p-16 overflow-hidden">
          {/* Background Effects */}
          <div className="absolute inset-0 bg-gradient-primary opacity-10" />
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />

          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Start Free Today
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
              Ready to Find Your
              <span className="text-gradient"> Perfect Job?</span>
            </h2>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join over 500,000 professionals who have found their dream jobs through our AI-powered platform.
              Create your profile in minutes and start receiving personalized job matches.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-gradient-primary hover:opacity-90 text-primary-foreground font-semibold px-8 h-14 text-lg shadow-lg hover:glow-primary transition-all duration-300"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/employer/dashboard')}
                className="border-border hover:bg-secondary h-14 px-8 text-lg"
              >
                For Employers
              </Button>
            </div>

            <p className="mt-6 text-sm text-muted-foreground">
              No credit card required • Free forever for job seekers
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
