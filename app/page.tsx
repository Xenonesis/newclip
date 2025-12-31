'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  Play, 
  Scissors, 
  Calendar, 
  BarChart3,
  Users,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Star,
  ChevronRight
} from 'lucide-react';

const features = [
  {
    icon: Scissors,
    title: 'AI Clip Detection',
    description: 'Automatically find the most viral-worthy moments in your videos using advanced AI.',
    gradient: 'from-indigo-500 to-purple-600'
  },
  {
    icon: Sparkles,
    title: 'Auto Captions',
    description: 'Generate animated captions in 34+ languages with trending styles like Hormozi.',
    gradient: 'from-cyan-500 to-blue-600'
  },
  {
    icon: Calendar,
    title: 'Smart Scheduling',
    description: 'Schedule posts across all platforms with AI-powered optimal timing suggestions.',
    gradient: 'from-orange-500 to-red-600'
  },
  {
    icon: BarChart3,
    title: 'Analytics Dashboard',
    description: 'Track performance across all platforms with actionable insights and trends.',
    gradient: 'from-green-500 to-emerald-600'
  },
  {
    icon: Globe,
    title: '14+ Platforms',
    description: 'Publish to TikTok, Instagram, YouTube, LinkedIn, Twitter, and more.',
    gradient: 'from-pink-500 to-rose-600'
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Process a 1-hour video in under 5 minutes with our GPU-powered pipeline.',
    gradient: 'from-yellow-500 to-amber-600'
  },
];

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'YouTuber, 500K subs',
    content: 'ClipFlow AI saves me 10+ hours per week. The clips it generates consistently go viral on TikTok.',
    avatar: '👩‍💻'
  },
  {
    name: 'Marcus Johnson',
    role: 'Social Media Agency',
    content: 'We manage 20+ clients with ClipFlow. The scheduling and analytics features are game-changers.',
    avatar: '👨‍💼'
  },
  {
    name: 'Elena Rodriguez',
    role: 'Online Coach',
    content: 'The auto-captions feature alone is worth it. My engagement has increased by 300%.',
    avatar: '👩‍🏫'
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '$9',
    period: '/month',
    features: ['5 videos/month', '50 clips', '2 social accounts', 'Basic captions'],
    popular: false
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/month',
    features: ['50 videos/month', '500 clips', '10 social accounts', 'All caption styles', 'Analytics dashboard', 'Priority support'],
    popular: true
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/month',
    features: ['Unlimited videos', 'Unlimited clips', '50 social accounts', 'White-label solution', 'Team collaboration', 'API access'],
    popular: false
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/80 backdrop-blur-xl border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">ClipFlow</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Features</a>
            <a href="#pricing" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Pricing</a>
            <a href="#testimonials" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">Testimonials</a>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              Log In
            </Link>
            <Link href="/dashboard">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--primary)]/10 border border-[var(--primary)]/30 mb-8">
            <Sparkles size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-medium text-[var(--primary)]">AI-Powered Video Repurposing</span>
          </div>
          
          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Turn Long Videos Into
            <span className="block gradient-text">Viral Short Clips</span>
          </h1>
          
          {/* Subheadline */}
          <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10">
            Upload once, publish everywhere. ClipFlow AI automatically finds the best moments, 
            adds captions, and schedules posts across all your social platforms.
          </p>
          
          {/* CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
            <Link href="/dashboard">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="text-base px-8">
                Start Free Trial
              </Button>
            </Link>
            <Button variant="secondary" size="lg" icon={Play} className="text-base px-8">
              Watch Demo
            </Button>
          </div>
          
          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {['🎬', '🎥', '📹', '🎞️'].map((emoji, i) => (
                  <div key={i} className="w-8 h-8 rounded-full bg-[var(--bg-card)] border-2 border-[var(--bg-primary)] flex items-center justify-center text-sm">
                    {emoji}
                  </div>
                ))}
              </div>
              <span className="text-sm">10,000+ creators</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={16} className="text-yellow-500 fill-yellow-500" />
              ))}
              <span className="text-sm ml-2">4.9/5 rating</span>
            </div>
          </div>
        </div>
        
        {/* Hero Image/Preview */}
        <div className="max-w-6xl mx-auto mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-primary)] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-xl border border-[var(--border)] bg-[var(--bg-card)] overflow-hidden shadow-2xl shadow-indigo-500/10">
            <div className="h-10 bg-[var(--bg-secondary)] border-b border-[var(--border)] flex items-center gap-2 px-4">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <div className="aspect-video bg-gradient-to-br from-indigo-500/10 to-purple-600/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[var(--primary)] flex items-center justify-center mb-4 shadow-lg shadow-indigo-500/30">
                  <Play size={32} className="text-white ml-1" />
                </div>
                <p className="text-[var(--text-muted)]">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything You Need</h2>
            <p className="text-[var(--text-secondary)] text-lg max-w-2xl mx-auto">
              From AI-powered clip detection to multi-platform publishing, ClipFlow has all the tools to grow your audience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div 
                key={feature.title}
                className="group p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={24} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-[var(--text-muted)]">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 px-6 bg-[var(--bg-secondary)] scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Join thousands of content creators saving time and growing their audience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-[var(--text-secondary)] mb-6">&ldquo;{testimonial.content}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-lg">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-sm">{testimonial.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 px-6 scroll-mt-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">Simple Pricing</h2>
            <p className="text-[var(--text-secondary)] text-lg">
              Start free, upgrade when you need more.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative p-6 rounded-xl border ${
                  plan.popular 
                    ? 'bg-gradient-to-b from-[var(--primary)]/10 to-transparent border-[var(--primary)]/50 shadow-lg shadow-indigo-500/10' 
                    : 'bg-[var(--bg-card)] border-[var(--border)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-[var(--primary)] text-white text-xs font-medium rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-[var(--text-muted)]">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      <span className="text-[var(--text-secondary)]">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={plan.popular ? 'primary' : 'secondary'} 
                  className="w-full"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="p-12 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-[var(--primary)]/30">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Go Viral?
            </h2>
            <p className="text-[var(--text-secondary)] text-lg mb-8 max-w-xl mx-auto">
              Join 10,000+ creators using ClipFlow AI to grow their audience across all platforms.
            </p>
            <Link href="/dashboard">
              <Button size="lg" icon={ArrowRight} iconPosition="right" className="text-base px-8">
                Start Your Free Trial
              </Button>
            </Link>
            <p className="text-sm text-[var(--text-muted)] mt-4">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold">ClipFlow</span>
            </div>
            <div className="flex items-center gap-8 text-sm text-[var(--text-muted)]">
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Privacy</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Terms</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">Contact</a>
              <a href="#" className="hover:text-[var(--text-primary)] transition-colors">API Docs</a>
            </div>
            <p className="text-sm text-[var(--text-muted)]">
              © 2024 ClipFlow AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
