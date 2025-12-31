'use client';

import React from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { StatCard } from '@/components/ui/StatCard';
import { Button } from '@/components/ui/Button';
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
  Calendar
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
  { title: 'Total Views', value: formatNumber(2400000), change: '+23%', changeType: 'positive' as const, icon: Eye, color: '#6366f1' },
  { title: 'Likes', value: formatNumber(156000), change: '+15%', changeType: 'positive' as const, icon: Heart, color: '#ec4899' },
  { title: 'Comments', value: formatNumber(12400), change: '+8%', changeType: 'positive' as const, icon: MessageCircle, color: '#22d3ee' },
  { title: 'Followers', value: '+5.2K', change: '+12%', changeType: 'positive' as const, icon: Users, color: '#10b981' },
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
  { name: 'TikTok', views: 980000, engagement: 8.5, color: '#000000' },
  { name: 'Instagram', views: 750000, engagement: 6.2, color: '#E1306C' },
  { name: 'YouTube', views: 450000, engagement: 5.8, color: '#FF0000' },
  { name: 'LinkedIn', views: 120000, engagement: 4.2, color: '#0A66C2' },
  { name: 'Twitter', views: 100000, engagement: 3.5, color: '#1DA1F2' },
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

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Analytics</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Track your content performance
          </p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]">
            <option>Last 30 days</option>
            <option>Last 7 days</option>
            <option>Last 90 days</option>
          </select>
          <Button variant="secondary" icon={Download}>Export</Button>
        </div>
      </div>

      {/* Stats */}
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

      {/* Views Chart */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold">Views Over Time</h3>
          <div className="flex gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              Views
            </span>
            <span className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              Engagement
            </span>
          </div>
        </CardHeader>
        <CardContent className="h-[300px] w-full min-h-[300px]">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={viewsData}>
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
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false}
                tick={{ fill: '#64748b', fontSize: 12 }}
                tickFormatter={(value) => formatNumber(value)}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1e293b', 
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc'
                }}
                formatter={(value: number) => formatNumber(value)}
              />
              <Area 
                type="monotone" 
                dataKey="views" 
                stroke="#6366f1" 
                strokeWidth={2}
                fill="url(#viewsGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="engagement" 
                stroke="#22d3ee" 
                strokeWidth={2}
                fill="url(#engagementGradient)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Platform Performance</h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {platformData.map((platform) => (
              <div key={platform.name} className="flex items-center gap-4">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: platform.color }}
                />
                <span className="w-24 font-medium text-sm">{platform.name}</span>
                <div className="flex-1">
                  <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all duration-500"
                      style={{ 
                        width: `${(platform.views / 1000000) * 100}%`,
                        backgroundColor: platform.color 
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm text-[var(--text-muted)] w-16 text-right">
                  {formatNumber(platform.views)}
                </span>
                <span className="text-sm text-green-400 w-12 text-right">
                  {platform.engagement}%
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Best Times to Post */}
        <Card>
          <CardHeader>
            <h3 className="font-semibold">Best Times to Post</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-6 gap-2">
              <div></div>
              {['6AM', '9AM', '12PM', '6PM', '9PM'].map((time) => (
                <div key={time} className="text-xs text-[var(--text-muted)] text-center">
                  {time}
                </div>
              ))}
              {bestTimes.map((day) => (
                <React.Fragment key={day.day}>
                  <div className="text-sm text-[var(--text-muted)]">
                    {day.day}
                  </div>
                  {[6, 9, 12, 18, 21].map((hour) => (
                    <div 
                      key={`${day.day}-${hour}`}
                      className={cn(
                        'h-8 rounded',
                        day.times.includes(hour)
                          ? 'bg-green-500/30 border border-green-500/50'
                          : 'bg-[var(--bg-secondary)]'
                      )}
                    />
                  ))}
                </React.Fragment>
              ))}
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-4 text-center">
              Green = High engagement times based on your audience
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <TrendingUp size={18} className="text-green-500" />
            Top Performing Posts
          </h3>
          <Button variant="ghost" size="sm">View All</Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-[var(--text-muted)] border-b border-[var(--border)]">
                  <th className="pb-3 font-medium">Post</th>
                  <th className="pb-3 font-medium">Platform</th>
                  <th className="pb-3 font-medium text-right">Views</th>
                  <th className="pb-3 font-medium text-right">Likes</th>
                  <th className="pb-3 font-medium text-right">Comments</th>
                  <th className="pb-3 font-medium text-right">Engagement</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {topPosts.map((post, index) => (
                  <tr key={post.id} className="border-b border-[var(--border)] last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-[var(--primary)] text-white text-xs flex items-center justify-center font-bold">
                          {index + 1}
                        </span>
                        <span className="font-medium">{post.title}</span>
                      </div>
                    </td>
                    <td className="py-4 text-[var(--text-muted)]">{post.platform}</td>
                    <td className="py-4 text-right">{formatNumber(post.views)}</td>
                    <td className="py-4 text-right">{formatNumber(post.likes)}</td>
                    <td className="py-4 text-right">{formatNumber(post.comments)}</td>
                    <td className="py-4 text-right text-green-400">
                      {((post.likes + post.comments) / post.views * 100).toFixed(1)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
