'use client';

import { StatCard } from '@/components/ui/StatCard';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { formatNumber } from '@/lib/utils';
import { 
  Video, 
  Scissors, 
  Calendar, 
  Eye, 
  TrendingUp,
  Play,
  Clock,
  ArrowRight,
  Flame
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

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Good morning, Aditya! 👋</h1>
          <p className="text-[var(--text-secondary)] mt-1">Here&apos;s what&apos;s happening with your content</p>
        </div>
        <Button icon={Video}>New Video</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Processing Videos */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[var(--accent)]" />
              <h3 className="font-semibold">Processing</h3>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {processingVideos.map((video) => (
              <div key={video.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium truncate flex-1 pr-4">{video.title}</p>
                  <span className="text-xs text-[var(--text-muted)]">{video.eta}</span>
                </div>
                <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                    style={{ width: `${video.progress}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-muted)]">{video.progress}% complete</p>
              </div>
            ))}
            {processingVideos.length === 0 && (
              <p className="text-center text-[var(--text-muted)] py-8">No videos processing</p>
            )}
          </CardContent>
        </Card>

        {/* Top Clips */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={18} className="text-orange-500" />
              <h3 className="font-semibold">Top Clips Today</h3>
            </div>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View All
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {topClips.map((clip, index) => (
              <div 
                key={clip.id} 
                className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] transition-colors cursor-pointer"
              >
                <div className="relative w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <Play size={20} className="text-white" />
                  <span className="absolute -top-1 -left-1 w-5 h-5 bg-[var(--primary)] text-white text-xs font-bold rounded-full flex items-center justify-center">
                    {index + 1}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{clip.title}</p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1">
                      <Eye size={12} /> {formatNumber(clip.views)}
                    </span>
                    <span>{Math.floor(clip.duration / 60)}:{(clip.duration % 60).toString().padStart(2, '0')}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-green-500/10 text-green-400 text-sm font-medium">
                  <TrendingUp size={14} />
                  {clip.viralityScore}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardContent className="py-8">
          <div className="grid md:grid-cols-3 gap-4">
            <QuickAction 
              icon={Video}
              title="Upload Video"
              description="Convert long videos into viral clips"
              href="/dashboard/upload"
              gradient="from-indigo-500 to-purple-600"
            />
            <QuickAction 
              icon={Calendar}
              title="Schedule Posts"
              description="Plan content across all platforms"
              href="/dashboard/schedule"
              gradient="from-cyan-500 to-blue-600"
            />
            <QuickAction 
              icon={TrendingUp}
              title="View Analytics"
              description="Track your content performance"
              href="/dashboard/analytics"
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function QuickAction({ 
  icon: Icon, 
  title, 
  description, 
  href, 
  gradient 
}: { 
  icon: React.ElementType; 
  title: string; 
  description: string; 
  href: string;
  gradient: string;
}) {
  return (
    <a 
      href={href}
      className="group flex items-center gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] border border-[var(--border)] hover:border-[var(--border-hover)] transition-all duration-300"
    >
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
        <Icon size={24} className="text-white" />
      </div>
      <div>
        <h4 className="font-semibold text-[var(--text-primary)]">{title}</h4>
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      </div>
    </a>
  );
}
