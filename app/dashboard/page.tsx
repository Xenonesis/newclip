'use client';

import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import Link from 'next/link';
import { 
  Video, 
  Scissors, 
  Calendar, 
  Eye, 
  TrendingUp,
  Play,
  Clock,
  ArrowRight,
  Flame,
  Upload,
  BarChart3,
  Sparkles
} from 'lucide-react';

// Mock data
const stats = [
  { title: 'Total Videos', value: 24, change: '+3 this week', changeType: 'positive' as const, icon: Video, color: '#6366f1' },
  { title: 'Clips Generated', value: 156, change: '+45 today', changeType: 'positive' as const, icon: Scissors, color: '#22d3ee' },
  { title: 'Scheduled Posts', value: 12, change: 'This week', changeType: 'neutral' as const, icon: Calendar, color: '#f59e0b' },
  { title: 'Total Views', value: formatNumber(2400000), change: '+23%', changeType: 'positive' as const, icon: Eye, color: '#10b981' },
];

const processingVideos = [
  { id: 1, title: 'Podcast Episode 45: AI in Business', progress: 75, eta: '2 min' },
  { id: 2, title: 'Interview with Alex Thompson', progress: 45, eta: '5 min' },
];

const topClips = [
  { id: 1, title: 'AI Tips #3 - Automation', viralityScore: 92, views: 15200, duration: 42 },
  { id: 2, title: 'Morning Routine for Success', viralityScore: 88, views: 8700, duration: 38 },
  { id: 3, title: 'Work From Home Setup', viralityScore: 85, views: 6500, duration: 55 },
];

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Header */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        flexWrap: 'wrap', 
        gap: '16px',
        paddingBottom: '20px',
        borderBottom: '1px solid var(--border)'
      }}>
        <div>
          <h1 style={{ 
            fontSize: '28px', 
            fontWeight: 700, 
            color: 'var(--text-primary)',
            marginBottom: '6px'
          }}>
            {getGreeting()}, there! 👋
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>
            Here&apos;s what&apos;s happening with your content today
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button icon={Upload} size="lg">New Video</Button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px' 
      }}>
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            changeType={stat.changeType}
            icon={stat.icon}
            iconColor={stat.color}
          />
        ))}
      </div>

      {/* Two Column Layout */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', 
        gap: '24px' 
      }}>
        {/* Processing Videos */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(34, 211, 238, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Clock size={18} style={{ color: '#22d3ee' }} />
            </div>
            <h3 style={{ fontWeight: 600, fontSize: '17px' }}>Processing</h3>
            <span style={{
              marginLeft: 'auto',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: 'rgba(34, 211, 238, 0.1)',
              color: '#22d3ee'
            }}>
              {processingVideos.length} active
            </span>
          </div>
          <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {processingVideos.map((video) => (
              <div key={video.id} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <p style={{ 
                    fontSize: '14px', 
                    fontWeight: 500, 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap', 
                    flex: 1, 
                    paddingRight: '16px',
                    color: 'var(--text-primary)'
                  }}>
                    {video.title}
                  </p>
                  <span style={{ 
                    fontSize: '12px', 
                    color: 'var(--text-muted)',
                    backgroundColor: 'var(--bg-secondary)',
                    padding: '4px 12px',
                    borderRadius: '12px'
                  }}>
                    ~{video.eta}
                  </span>
                </div>
                <div style={{ 
                  height: '8px', 
                  backgroundColor: 'var(--bg-secondary)', 
                  borderRadius: '9999px', 
                  overflow: 'hidden' 
                }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      background: 'linear-gradient(90deg, #6366f1, #a855f7)',
                      borderRadius: '9999px',
                      width: `${video.progress}%`
                    }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                    {video.progress}% complete
                  </p>
                  <span style={{ fontSize: '11px', color: '#a855f7', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} /> AI analyzing...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clips */}
        <div style={{
          backgroundColor: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: '16px',
          overflow: 'hidden'
        }}>
          <div style={{ 
            padding: '20px 24px', 
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                backgroundColor: 'rgba(249, 115, 22, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={18} style={{ color: '#f97316' }} />
              </div>
              <h3 style={{ fontWeight: 600, fontSize: '17px' }}>Top Clips Today</h3>
            </div>
            <Link href="/dashboard/clips" style={{ textDecoration: 'none' }}>
              <span style={{ 
                fontSize: '13px', 
                color: 'var(--text-muted)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                cursor: 'pointer'
              }}>
                View All <ArrowRight size={14} />
              </span>
            </Link>
          </div>
          <div style={{ padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {topClips.map((clip, index) => (
              <div 
                key={clip.id} 
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '14px',
                  borderRadius: '12px',
                  backgroundColor: 'var(--bg-secondary)',
                  cursor: 'pointer'
                }}
              >
                <div style={{ 
                  position: 'relative',
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '10px', 
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)'
                }}>
                  <Play size={20} style={{ color: 'white', marginLeft: '2px' }} />
                  <span style={{
                    position: 'absolute',
                    top: '-6px',
                    left: '-6px',
                    width: '22px',
                    height: '22px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    fontSize: '11px',
                    fontWeight: 700,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid var(--bg-card)'
                  }}>
                    {index + 1}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ 
                    fontWeight: 500, 
                    fontSize: '14px', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis', 
                    whiteSpace: 'nowrap',
                    color: 'var(--text-primary)',
                    marginBottom: '4px'
                  }}>
                    {clip.title}
                  </p>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    fontSize: '12px', 
                    color: 'var(--text-muted)' 
                  }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Eye size={12} /> {formatNumber(clip.views)}
                    </span>
                    <span>{Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: clip.viralityScore >= 90 ? 'rgba(34, 197, 94, 0.15)' : 'rgba(234, 179, 8, 0.15)',
                  color: clip.viralityScore >= 90 ? '#4ade80' : '#facc15',
                  fontSize: '13px',
                  fontWeight: 600
                }}>
                  <TrendingUp size={14} />
                  {clip.viralityScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '16px',
        padding: '24px'
      }}>
        <h3 style={{ 
          fontSize: '17px', 
          fontWeight: 600, 
          marginBottom: '20px',
          color: 'var(--text-primary)'
        }}>
          Quick Actions
        </h3>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
          gap: '16px' 
        }}>
          <QuickAction 
            icon={Upload}
            title="Upload Video"
            description="Convert long videos into viral clips"
            href="/dashboard/upload"
            color="#6366f1"
          />
          <QuickAction 
            icon={Calendar}
            title="Schedule Posts"
            description="Plan content across all platforms"
            href="/dashboard/schedule"
            color="#22d3ee"
          />
          <QuickAction 
            icon={BarChart3}
            title="View Analytics"
            description="Track your content performance"
            href="/dashboard/analytics"
            color="#f97316"
          />
        </div>
      </div>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  color 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
  color: string;
}) {
  return (
    <Link 
      href={href}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '20px',
        borderRadius: '14px',
        backgroundColor: 'var(--bg-secondary)',
        border: '1px solid var(--border)',
        textDecoration: 'none',
        color: 'inherit'
      }}
    >
      <div style={{
        width: '52px',
        height: '52px',
        borderRadius: '14px',
        backgroundColor: `${color}20`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <Icon size={24} style={{ color }} />
      </div>
      <div>
        <h4 style={{ 
          fontWeight: 600, 
          color: 'var(--text-primary)',
          fontSize: '15px',
          marginBottom: '4px'
        }}>
          {title}
        </h4>
        <p style={{ 
          fontSize: '13px', 
          color: 'var(--text-muted)'
        }}>
          {description}
        </p>
      </div>
    </Link>
  );
}
