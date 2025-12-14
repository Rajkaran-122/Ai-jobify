import { Target, FileText, MessageSquare, TrendingUp, Zap, Shield } from 'lucide-react';

const features = [
  {
    icon: Target,
    title: 'Smart Job Matching',
    description: 'Our AI analyzes your profile to find jobs that truly match your skills, experience, and career goals.',
    highlights: ['95% accuracy', 'Skill matching', 'Culture fit analysis'],
  },
  {
    icon: FileText,
    title: 'Resume Analysis',
    description: 'Get instant feedback and suggestions to improve your resume and stand out to recruiters.',
    highlights: ['ATS optimization', 'Industry insights', 'Keyword analysis'],
  },
  {
    icon: MessageSquare,
    title: 'Interview Prep',
    description: 'Practice with AI mock interviews and get real-time tips to ace your next interview.',
    highlights: ['Common questions', 'Personalized tips', 'Confidence score'],
  },
  {
    icon: TrendingUp,
    title: 'Salary Insights',
    description: 'Know your worth with real-time salary data and AI-powered predictions for your role.',
    highlights: ['Market rates', 'Trend analysis', 'Negotiation tips'],
  },
  {
    icon: Zap,
    title: 'Instant Applications',
    description: 'Apply to multiple jobs with one click using your saved profile and AI-generated cover letters.',
    highlights: ['One-click apply', 'Auto cover letters', 'Application tracking'],
  },
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your data is encrypted and you control who sees your profile. Job search in complete confidentiality.',
    highlights: ['End-to-end encryption', 'Incognito mode', 'GDPR compliant'],
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-6">
            <Zap className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-muted-foreground">
              AI-Powered Features
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Supercharge Your
            <span className="text-gradient"> Job Search</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Leverage cutting-edge AI technology to find, apply, and land your dream job faster than ever.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group glass rounded-2xl p-8 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:glow-primary transition-all duration-300">
                <feature.icon className="w-7 h-7 text-primary-foreground" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                {feature.description}
              </p>

              {/* Highlights */}
              <ul className="space-y-2">
                {feature.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {highlight}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
