import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, Briefcase, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const navLinks = [
  { name: 'Find Jobs', href: '/candidate/jobs' },
  { name: 'Companies', href: '#companies' },
  { name: 'AI Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
];

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate('/register');
  };

  const handleSignIn = () => {
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass border-b border-border/50">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center group-hover:glow-primary transition-all duration-300">
              <Briefcase className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Job<span className="text-gradient">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link to="/employer/dashboard">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Employer Dashboard
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-foreground"
              onClick={handleSignIn}
            >
              Sign In
            </Button>
            <Button
              className="bg-gradient-primary hover:opacity-90 text-primary-foreground shadow-lg hover:glow-primary transition-all duration-300"
              onClick={handleGetStarted}
            >
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-[500px] pb-6" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-4 pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/employer/dashboard"
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 text-sm font-medium py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Employer Dashboard
            </Link>
            <div className="flex flex-col gap-3 pt-4 border-t border-border">
              <Button
                variant="ghost"
                className="justify-start text-muted-foreground"
                onClick={() => {
                  handleSignIn();
                  setIsMenuOpen(false);
                }}
              >
                Sign In
              </Button>
              <Button
                className="bg-gradient-primary text-primary-foreground"
                onClick={() => {
                  handleGetStarted();
                  setIsMenuOpen(false);
                }}
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};
