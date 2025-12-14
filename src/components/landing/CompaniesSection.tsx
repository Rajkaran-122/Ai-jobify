import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const companies = [
  { name: 'Google', logo: '🔵', jobs: 156 },
  { name: 'Microsoft', logo: '🟦', jobs: 234 },
  { name: 'Apple', logo: '🍎', jobs: 89 },
  { name: 'Amazon', logo: '📦', jobs: 312 },
  { name: 'Meta', logo: '🔷', jobs: 178 },
  { name: 'Netflix', logo: '🔴', jobs: 67 },
  { name: 'Tesla', logo: '⚡', jobs: 145 },
  { name: 'Spotify', logo: '🟢', jobs: 98 },
];

export const CompaniesSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-subtle" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Top Companies
            <span className="text-gradient"> Hiring Now</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Join thousands of professionals working at the world's leading companies.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className="group glass rounded-xl p-6 text-center hover:border-primary/50 transition-all duration-300 cursor-pointer hover:-translate-y-1"
            >
              <div className="w-16 h-16 mx-auto rounded-xl bg-secondary flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">
                {company.logo}
              </div>
              <h3 className="font-semibold text-foreground mb-1">{company.name}</h3>
              <p className="text-sm text-muted-foreground">{company.jobs} open positions</p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Button variant="ghost" className="text-primary hover:text-primary/80">
            View All Companies
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </section>
  );
};
