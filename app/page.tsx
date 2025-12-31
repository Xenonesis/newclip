'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { 
  Sparkles, 
  Play, 
  Scissors, 
  Calendar, 
  BarChart3,
  Zap,
  Globe,
  CheckCircle,
  ArrowRight,
  Star
} from 'lucide-react';

const features = [
  { icon: Scissors, title: 'AI Clip Detection', description: 'Automatically find the most viral-worthy moments in your videos using advanced AI.', color: '#6366f1' },
  { icon: Sparkles, title: 'Auto Captions', description: 'Generate animated captions in 34+ languages with trending styles like Hormozi.', color: '#22d3ee' },
  { icon: Calendar, title: 'Smart Scheduling', description: 'Schedule posts across all platforms with AI-powered optimal timing suggestions.', color: '#f97316' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track performance across all platforms with actionable insights and trends.', color: '#10b981' },
  { icon: Globe, title: '14+ Platforms', description: 'Publish to TikTok, Instagram, YouTube, LinkedIn, Twitter, and more.', color: '#ec4899' },
  { icon: Zap, title: 'Lightning Fast', description: 'Process a 1-hour video in under 5 minutes with our GPU-powered pipeline.', color: '#eab308' },
];

const testimonials = [
  { name: 'Sarah Chen', role: 'YouTuber, 500K subs', content: 'ClipFlow AI saves me 10+ hours per week. The clips it generates consistently go viral on TikTok.', avatar: '👩‍💻' },
  { name: 'Marcus Johnson', role: 'Social Media Agency', content: 'We manage 20+ clients with ClipFlow. The scheduling and analytics features are game-changers.', avatar: '👨‍💼' },
  { name: 'Elena Rodriguez', role: 'Online Coach', content: 'The auto-captions feature alone is worth it. My engagement has increased by 300%.', avatar: '👩‍🏫' },
];

const pricingPlans = [
  { name: 'Starter', price: '$9', period: '/month', features: ['5 videos/month', '50 clips', '2 social accounts', 'Basic captions'], popular: false },
  { name: 'Pro', price: '$29', period: '/month', features: ['50 videos/month', '500 clips', '10 social accounts', 'All caption styles', 'Analytics dashboard', 'Priority support'], popular: true },
  { name: 'Agency', price: '$99', period: '/month', features: ['Unlimited videos', 'Unlimited clips', '50 social accounts', 'White-label solution', 'Team collaboration', 'API access'], popular: false },
];

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--bg-primary)' }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: 'rgba(10, 10, 15, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: 'linear-gradient(to bottom right, #6366f1, #a855f7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={18} style={{ color: 'white' }} />
            </div>
            <span style={{ fontSize: '20px', fontWeight: 'bold', background: 'linear-gradient(to right, #6366f1, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ClipFlow</span>
          </Link>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <a href="#features" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Features</a>
            <a href="#pricing" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Pricing</a>
            <a href="#testimonials" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Testimonials</a>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Link href="/dashboard" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>Log In</Link>
            <Link href="/dashboard"><Button>Get Started</Button></Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ paddingTop: '160px', paddingBottom: '96px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', textAlign: 'center' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(99, 102, 241, 0.1)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            marginBottom: '32px'
          }}>
            <Sparkles size={16} style={{ color: '#6366f1' }} />
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#6366f1' }}>AI-Powered Video Repurposing</span>
          </div>
          
          {/* Headline */}
          <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 'bold', lineHeight: 1.1, marginBottom: '24px' }}>
            Turn Long Videos Into
            <span style={{ display: 'block', background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Viral Short Clips</span>
          </h1>
          
          {/* Subheadline */}
          <p style={{ fontSize: '20px', color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 40px' }}>
            Upload once, publish everywhere. ClipFlow AI automatically finds the best moments, 
            adds captions, and schedules posts across all your social platforms.
          </p>
          
          {/* CTAs */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '64px' }}>
            <Link href="/dashboard">
              <Button size="lg" icon={ArrowRight} iconPosition="right">Start Free Trial</Button>
            </Link>
            <Button variant="secondary" size="lg" icon={Play}>Watch Demo</Button>
          </div>
          
          {/* Social Proof */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '32px', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ display: 'flex' }}>
                {['🎬', '🎥', '📹', '🎞️'].map((emoji, i) => (
                  <div key={i} style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--bg-card)',
                    border: '2px solid var(--bg-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    marginLeft: i > 0 ? '-8px' : 0
                  }}>
                    {emoji}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '14px' }}>10,000+ creators</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {[1,2,3,4,5].map((i) => (
                <Star key={i} size={16} style={{ color: '#eab308', fill: '#eab308' }} />
              ))}
              <span style={{ fontSize: '14px', marginLeft: '8px' }}>4.9/5 rating</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" style={{ padding: '96px 24px', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '16px' }}>Everything You Need</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '640px', margin: '0 auto' }}>
              From AI-powered clip detection to multi-platform publishing, ClipFlow has all the tools to grow your audience.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {features.map((feature) => (
              <div 
                key={feature.title}
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  backgroundColor: `${feature.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '16px'
                }}>
                  <feature.icon size={24} style={{ color: feature.color }} />
                </div>
                <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-muted)' }}>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '96px 24px', backgroundColor: 'var(--bg-secondary)', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '16px' }}>Loved by Creators</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Join thousands of content creators saving time and growing their audience.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            {testimonials.map((testimonial) => (
              <div 
                key={testimonial.name}
                style={{
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-card)',
                  border: '1px solid var(--border)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '16px' }}>
                  {[1,2,3,4,5].map((i) => (
                    <Star key={i} size={14} style={{ color: '#eab308', fill: '#eab308' }} />
                  ))}
                </div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>&ldquo;{testimonial.content}&rdquo;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    background: 'linear-gradient(to bottom right, #6366f1, #a855f7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px'
                  }}>
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p style={{ fontWeight: 500, fontSize: '14px' }}>{testimonial.name}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '96px 24px', scrollMarginTop: '80px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 'bold', marginBottom: '16px' }}>Simple Pricing</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>
              Start free, upgrade when you need more.
            </p>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', maxWidth: '960px', margin: '0 auto' }}>
            {pricingPlans.map((plan) => (
              <div 
                key={plan.name}
                style={{
                  position: 'relative',
                  padding: '24px',
                  borderRadius: '12px',
                  backgroundColor: plan.popular ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-card)',
                  border: plan.popular ? '1px solid rgba(99, 102, 241, 0.5)' : '1px solid var(--border)',
                  boxShadow: plan.popular ? '0 4px 20px rgba(99, 102, 241, 0.15)' : 'none'
                }}
              >
                {plan.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    padding: '4px 12px',
                    backgroundColor: '#6366f1',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: 500,
                    borderRadius: '9999px'
                  }}>
                    Most Popular
                  </div>
                )}
                <h3 style={{ fontSize: '20px', fontWeight: 600, marginBottom: '8px' }}>{plan.name}</h3>
                <div style={{ marginBottom: '24px' }}>
                  <span style={{ fontSize: '36px', fontWeight: 'bold' }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)' }}>{plan.period}</span>
                </div>
                <ul style={{ listStyle: 'none', padding: 0, marginBottom: '32px' }}>
                  {plan.features.map((feature) => (
                    <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', marginBottom: '12px' }}>
                      <CheckCircle size={16} style={{ color: '#10b981', flexShrink: 0 }} />
                      <span style={{ color: 'var(--text-secondary)' }}>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button variant={plan.popular ? 'primary' : 'secondary'} style={{ width: '100%' }}>
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '96px 24px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            padding: '48px',
            borderRadius: '16px',
            background: 'linear-gradient(to right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2))',
            border: '1px solid rgba(99, 102, 241, 0.3)'
          }}>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 'bold', marginBottom: '16px' }}>
              Ready to Go Viral?
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px', marginBottom: '32px', maxWidth: '560px', margin: '0 auto 32px' }}>
              Join 10,000+ creators using ClipFlow AI to grow their audience across all platforms.
            </p>
            <Link href="/dashboard">
              <Button size="lg" icon={ArrowRight} iconPosition="right">Start Your Free Trial</Button>
            </Link>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginTop: '16px' }}>
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '48px 24px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                background: 'linear-gradient(to bottom right, #6366f1, #a855f7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={18} style={{ color: 'white' }} />
              </div>
              <span style={{ fontSize: '20px', fontWeight: 'bold' }}>ClipFlow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '32px', fontSize: '14px', color: 'var(--text-muted)' }}>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Terms</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>Contact</a>
              <a href="#" style={{ color: 'inherit', textDecoration: 'none' }}>API Docs</a>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
              © 2024 ClipFlow AI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
