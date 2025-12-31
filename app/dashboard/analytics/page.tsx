'use client';

import React, { useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { formatNumber, cn } from '@/lib/utils';
import { 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2,
  Users,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  Download,
  Calendar,
  BarChart3,
  ChevronDown,
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';

// Mock analytics data
const stats = [
  { title: 'Total Views', value: formatNumber(2400000), change: '+23%', changeType: 'positive' as const, icon: Eye, color: 'indigo' as const },
  { title: 'Likes', value: formatNumber(156000), change: '+15%', changeType: 'positive' as const, icon: Heart, color: 'pink' as const },
  { title: 'Comments', value: formatNumber(12400), change: '+8%', changeType: 'positive' as const, icon: MessageCircle, color: 'cyan' as const },
  { title: 'Followers', value: '+5.2K', change: '+12%', changeType: 'positive' as const, icon: Users, color: 'green' as const },
];

const viewsData = [
  { date: 'Dec 1', views: 45000, engagement: 3200 },
  { date: 'Dec 5', views: 52000, engagement: 3800 },
  { date: 'Dec 10', views: 48000, engagement: 3500 },
  { date: 'Dec 15', views: 78000, engagement: 5200 },
  { date: 'Dec 20', views: 95000, engagement: 6800 },
  { date: 'Dec 25', views: 82000, engagement: 5900 },
  { date: 'Dec 31', views: 110000, engagement: 7500 },
];

const platformData = [
  { name: 'TikTok', views: 980000, engagement: 8.5, color: '#000000', icon: '🎵' },
  { name: 'Instagram', views: 750000, engagement: 6.2, color: '#E1306C', icon: '📸' },
  { name: 'YouTube', views: 450000, engagement: 5.8, color: '#FF0000', icon: '▶️' },
  { name: 'LinkedIn', views: 120000, engagement: 4.2, color: '#0A66C2', icon: '💼' },
  { name: 'Twitter', views: 100000, engagement: 3.5, color: '#1DA1F2', icon: '🐦' },
];

const topPosts = [
  { id: 1, title: 'AI Tips #3', platform: 'TikTok', views: 234000, likes: 18500, comments: 1200 },
  { id: 2, title: 'Morning Routine', platform: 'Instagram', views: 189000, likes: 15200, comments: 890 },
  { id: 3, title: 'Work Hacks', platform: 'YouTube', views: 156000, likes: 12400, comments: 2100 },
  { id: 4, title: 'Focus Tips', platform: 'TikTok', views: 134000, likes: 11200, comments: 780 },
  { id: 5, title: 'Growth Mindset', platform: 'LinkedIn', views: 98000, likes: 5600, comments: 320 },
];

const bestTimes = [
  { day: 'Mon', times: [6, 12, 18] },
  { day: 'Tue', times: [9, 12, 21] },
  { day: 'Wed', times: [6, 12, 18] },
  { day: 'Thu', times: [9, 18, 21] },
  { day: 'Fri', times: [6, 12, 18] },
];

const timeRangeOptions = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '90d', label: 'Last 90 days' },
  { value: '1y', label: 'Last year' },
];

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Analytics" 
        description="Track your content performance across all platforms"
      >
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
          aria-label="Refresh analytics"
        >
          <RefreshCw size={18} className={cn("text-[var(--text-muted)]", refreshing && "animate-spin")} />
        </button>
        <div className="relative">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="appearance-none px-4 py-2.5 pr-10 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] text-sm font-medium hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer"
          >
            {timeRangeOptions.map(option => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
          <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
        </div>
        <Button variant="secondary" icon={Download}>Export</Button>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Views Chart */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-[var(--bg-secondary)]/50">
          <h3 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 flex items-center justify-center">
              <BarChart3 size={16} className="text-indigo-400" aria-hidden="true" />
            </div>
            Views Over Time
          </h3>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="w-3 h-3 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/30" aria-hidden="true" />
              Views
            </span>
            <span className="flex items-center gap-2 text-[var(--text-muted)]">
              <span className="w-3 h-3 rounded-full bg-cyan-500 shadow-lg shadow-cyan-500/30" aria-hidden="true" />
              Engagement
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] sm:h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={viewsData} margin={{ top: 20, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="engagementGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 11 }}
                tickFormatter={(value) => formatNumber(value)}
                width={60}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--bg-card)', 
                  border: '1px solid var(--border)',
                  borderRadius: '12px',
                  color: 'var(--text-primary)',
                  boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)'
                }}
                formatter={(value) => formatNumber(value as number)}
                labelStyle={{ color: 'var(--text-muted)', marginBottom: '4px' }}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#6366f1" 
                strokeWidth={2.5}
                fill="url(#viewsGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#22d3ee" 
                strokeWidth={2.5}
                fill="url(#engagementGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[var(--bg-secondary)]/50">
            <h3 className="font-semibold text-[var(--text-primary)]">Platform Performance</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformData.map((platform, index) => (
              <div key={platform.name} className="group">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg" aria-hidden="true">{platform.icon}</span>
                  <span className="font-medium text-sm text-[var(--text-primary)] flex-1">{platform.name}</span>
                  <span className="text-sm text-[var(--text-muted)]">
                    {formatNumber(platform.views)}
                  </span>
                  <Badge variant="success" size="sm">
                    {platform.engagement}%
                  </Badge>
                </div>
                <div className="h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-700 ease-out group-hover:opacity-80"
                    style={{ 
                      width: `${(platform.views / 1000000) * 100}%`,
                      backgroundColor: platform.color,
                      boxShadow: `0 0 12px ${platform.color}40`
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Best Times to Post */}
        <Card className="overflow-hidden">
          <CardHeader className="bg-[var(--bg-secondary)]/50">
            <h3 className="font-semibold text-[var(--text-primary)]">Best Times to Post</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              <div></div>
              {['6AM', '9AM', '12PM', '6PM', '9PM'].map((time) => (
                <div key={time} className="text-xs text-[var(--text-muted)] text-center font-medium">
                  {time}
                </div>
              ))}
              {bestTimes.map((day) => (
                <React.Fragment key={day.day}>
                  <div className="text-sm text-[var(--text-muted)] font-medium flex items-center">
                    {day.day}
                  </div>
                  {[6, 9, 12, 18, 21].map((hour) => (
                    <div 
                      key={`${day.day}-${hour}`}
                      className={cn(
                        'h-10 rounded-lg transition-all cursor-pointer',
                        day.times.includes(hour)
                          ? 'bg-green-500/20 border border-green-500/40 hover:bg-green-500/30 shadow-inner'
                          : 'bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] border border-transparent'
                      )}
                      title={day.times.includes(hour) ? 'High engagement time' : 'Standard time'}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center justify-center gap-4 mt-6 p-3 bg-[var(--bg-secondary)] rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500/40" aria-hidden="true" />
                <span className="text-xs text-[var(--text-muted)]">High engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-[var(--bg-card)]" aria-hidden="true" />
                <span className="text-xs text-[var(--text-muted)]">Standard</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card className="overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between bg-[var(--bg-secondary)]/50">
          <h3 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
            <div className="w-8 h-8 rounded-lg bg-green-500/15 flex items-center justify-center">
              <TrendingUp size={16} className="text-green-400" aria-hidden="true" />
            </div>
            Top Performing Posts
          </h3>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-muted)] border-b border-[var(--border)] bg-[var(--bg-secondary)]/30">
                  <th className="px-6 py-4 font-medium">Post</th>
                  <th className="px-6 py-4 font-medium">Platform</th>
                  <th className="px-6 py-4 font-medium text-right">Views</th>
                  <th className="px-6 py-4 font-medium text-right hidden sm:table-cell">Likes</th>
                  <th className="px-6 py-4 font-medium text-right hidden md:table-cell">Comments</th>
                  <th className="px-6 py-4 font-medium text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topPosts.map((post, index) => {
                  const engagement = ((post.likes + post.comments) / post.views * 100).toFixed(1);
                  return (
                    <tr 
                      key={post.id} 
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <span className={cn(
                            'w-7 h-7 rounded-lg text-white text-xs flex items-center justify-center font-bold shadow-lg',
                            index === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500' :
                            index === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400' :
                            index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-700' :
                            'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                          )}>
                            {index + 1}
                          </span>
                          <span className="font-medium text-[var(--text-primary)]">{post.title}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <Badge variant="outline" size="sm">{post.platform}</Badge>
                      </td>
                      <td className="px-6 py-4 text-right text-[var(--text-primary)] font-medium">{formatNumber(post.views)}</td>
                      <td className="px-6 py-4 text-right text-[var(--text-muted)] hidden sm:table-cell">{formatNumber(post.likes)}</td>
                      <td className="px-6 py-4 text-right text-[var(--text-muted)] hidden md:table-cell">{formatNumber(post.comments)}</td>
                      <td className="px-6 py-4 text-right">
                        <Badge variant={parseFloat(engagement) > 8 ? 'success' : parseFloat(engagement) > 5 ? 'info' : 'default'} size="sm">
                          {engagement}%
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
