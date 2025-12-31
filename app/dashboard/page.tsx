'use client';

import { useSession } from 'next-auth/react';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { formatNumber, cn } from '@/lib/utils';
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
  { title: 'Total Videos', value: 24, change: '+3 this week', changeType: 'positive' as const, icon: Video, color: 'indigo' },
  { title: 'Clips Generated', value: 156, change: '+45 today', changeType: 'positive' as const, icon: Scissors, color: 'cyan' },
  { title: 'Scheduled Posts', value: 12, change: 'This week', changeType: 'neutral' as const, icon: Calendar, color: 'orange' },
  { title: 'Total Views', value: formatNumber(2400000), change: '+23%', changeType: 'positive' as const, icon: Eye, color: 'green' },
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

function getViralityVariant(score: number): 'success' | 'warning' | 'purple' {
  if (score >= 90) return 'success';
  if (score >= 85) return 'warning';
  return 'purple';
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name?.split(' ')[0] || 'there';

  return (
    <div className="flex flex-col gap-7">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-5 border-b border-[var(--border)]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] mb-1 tracking-tight">
            {getGreeting()}, {userName}! <span className="inline-block animate-wave">👋</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-sm sm:text-base">
            Here&apos;s what&apos;s happening with your content today
          </p>
        </div>
        <Link href="/dashboard/upload">
          <Button icon={Upload} size="lg">New Video</Button>
        </Link>
      </div>

      {/* Stats Grid - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
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

      {/* Two Column Layout - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Processing Videos */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
              <Clock size={16} className="text-cyan-400" aria-hidden="true" />
            </div>
            <h3 className="font-semibold text-base text-[var(--text-primary)]">Processing</h3>
            <Badge variant="info" size="sm" className="ml-auto">{processingVideos.length} active</Badge>
          </div>
          <div className="p-6 flex flex-col gap-5">
            {processingVideos.map((video) => (
              <div key={video.id} className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-[var(--text-primary)] truncate flex-1 pr-4">
                    {video.title}
                  </p>
                  <span className="text-xs text-[var(--text-muted)] bg-[var(--bg-secondary)] px-3 py-1.5 rounded-full flex-shrink-0">
                    ~{video.eta}
                  </span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
                  <span>{video.progress}% complete</span>
                  <span className="flex items-center gap-1">
                    <Sparkles size={12} className="text-purple-400" /> AI analyzing...
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Clips */}
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl overflow-hidden">
          <div className="px-6 py-5 border-b border-[var(--border)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500/15 flex items-center justify-center">
                <Flame size={16} className="text-orange-400" aria-hidden="true" />
              </div>
              <h3 className="font-semibold text-base text-[var(--text-primary)]">Top Clips Today</h3>
            </div>
            <Link 
              href="/dashboard/clips" 
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
            >
              View All <ArrowRight size={14} />
            </Link>
          </div>
          <div className="p-4 flex flex-col gap-3">
            {topClips.map((clip, index) => (
              <div 
                key={clip.id} 
                className={cn(
                  'flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] border border-transparent',
                  'hover:bg-[var(--bg-elevated)] hover:border-[var(--border)] transition-all duration-200 cursor-pointer group'
                )}
              >
                <div className="relative w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
                  <Play size={18} className="text-white ml-0.5" aria-hidden="true" />
                  <span className="absolute -top-1.5 -left-1.5 w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-[var(--bg-card)] shadow-md">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-[var(--text-primary)] truncate mb-1">
                    {clip.title}
                  </p>
                  <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Eye size={12} aria-hidden="true" /> {formatNumber(clip.views)}
                    </span>
                    <span>{Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <Badge variant={getViralityVariant(clip.viralityScore)} className="flex items-center gap-1">
                  <TrendingUp size={12} aria-hidden="true" />
                  {clip.viralityScore}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-6">
        <h3 className="text-base font-semibold text-[var(--text-primary)] mb-5">
          Quick Actions
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <QuickAction 
            icon={Upload}
            title="Upload Video"
            description="Convert long videos into viral clips"
            href="/dashboard/upload"
            colorClass="bg-indigo-500/15 text-indigo-400"
          />
          <QuickAction 
            icon={Calendar}
            title="Schedule Posts"
            description="Plan content across all platforms"
            href="/dashboard/schedule"
            colorClass="bg-cyan-500/15 text-cyan-400"
          />
          <QuickAction 
            icon={BarChart3}
            title="View Analytics"
            description="Track your content performance"
            href="/dashboard/analytics"
            colorClass="bg-orange-500/15 text-orange-400"
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
  colorClass 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
  colorClass: string;
}) {
  return (
    <Link 
      href={href}
      className={cn(
        'flex items-center gap-4 p-5 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]',
        'hover:bg-[var(--bg-elevated)] hover:border-[var(--border-hover)] hover:-translate-y-0.5',
        'transition-all duration-200 group'
      )}
    >
      <div className={cn(
        'w-13 h-13 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110',
        colorClass
      )}
      style={{ width: '52px', height: '52px' }}
      >
        <Icon size={24} aria-hidden="true" />
      </div>
      <div>
        <h4 className="font-semibold text-[var(--text-primary)] text-[15px] mb-1">
          {title}
        </h4>
        <p className="text-[13px] text-[var(--text-muted)] leading-snug">
          {description}
        </p>
      </div>
    </Link>
  );
}
