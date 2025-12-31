'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Play,
  Clock,
  Check,
  Trash2
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday } from 'date-fns';

// Mock scheduled posts
const mockPosts = [
  { id: 1, date: new Date(), time: '10:00', platform: 'instagram', title: 'AI Tips Video', status: 'scheduled' },
  { id: 2, date: new Date(), time: '14:00', platform: 'tiktok', title: 'Morning Routine', status: 'scheduled' },
  { id: 3, date: new Date(), time: '18:00', platform: 'youtube', title: 'Work Setup Tour', status: 'scheduled' },
  { id: 4, date: addDays(new Date(), 1), time: '09:00', platform: 'linkedin', title: 'Career Advice', status: 'scheduled' },
  { id: 5, date: addDays(new Date(), 1), time: '12:00', platform: 'tiktok', title: 'Focus Tips', status: 'scheduled' },
  { id: 6, date: addDays(new Date(), 2), time: '17:00', platform: 'instagram', title: 'Evening Motivation', status: 'scheduled' },
];

const platformColors: Record<string, string> = {
  instagram: '#E1306C',
  tiktok: '#000000',
  youtube: '#FF0000',
  linkedin: '#0A66C2',
  twitter: '#1DA1F2',
  facebook: '#1877F2',
};

const platformIcons: Record<string, string> = {
  instagram: '📸',
  tiktok: '🎵',
  youtube: '▶️',
  linkedin: '💼',
  twitter: '🐦',
  facebook: '📘',
};

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getPostsForDate = (date: Date) => {
    return mockPosts.filter(post => isSameDay(post.date, date));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Content Calendar</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            Schedule and manage your posts
          </p>
        </div>
        <Button icon={Plus}>New Post</Button>
      </div>

      {/* Calendar Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              <ChevronLeft size={20} className="text-[var(--text-muted)]" />
            </button>
            <h2 className="text-lg font-semibold min-w-[200px] text-center">
              {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
            <button 
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-[var(--bg-card)] rounded-lg transition-colors"
            >
              <ChevronRight size={20} className="text-[var(--text-muted)]" />
            </button>
          </div>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
        
        <div className="flex gap-1 p-1 bg-[var(--bg-card)] rounded-lg">
          <button
            onClick={() => setView('week')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              view === 'week' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'
            )}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            className={cn(
              'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
              view === 'month' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]'
            )}
          >
            Month
          </button>
        </div>
      </div>

      {/* Week View */}
      <div className="grid grid-cols-7 gap-4">
        {weekDays.map((day) => {
          const posts = getPostsForDate(day);
          const today = isToday(day);
          
          return (
            <div key={day.toISOString()} className="min-h-[400px]">
              {/* Day Header */}
              <div className={cn(
                'text-center py-3 rounded-t-xl border border-b-0',
                today 
                  ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' 
                  : 'bg-[var(--bg-card)] border-[var(--border)]'
              )}>
                <p className="text-xs text-[var(--text-muted)] uppercase">
                  {format(day, 'EEE')}
                </p>
                <p className={cn(
                  'text-xl font-bold mt-1',
                  today ? 'text-[var(--primary)]' : 'text-[var(--text-primary)]'
                )}>
                  {format(day, 'd')}
                </p>
              </div>
              
              {/* Posts */}
              <div className={cn(
                'border border-t-0 rounded-b-xl p-2 min-h-[340px]',
                today ? 'border-[var(--primary)]/30' : 'border-[var(--border)]'
              )}>
                <div className="space-y-2">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="p-2 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] cursor-pointer transition-all group"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-[var(--text-muted)]">{post.time}</span>
                        <span className="text-sm">{platformIcons[post.platform]}</span>
                      </div>
                      <p className="text-xs font-medium truncate">{post.title}</p>
                      <div 
                        className="h-1 rounded-full mt-2"
                        style={{ backgroundColor: platformColors[post.platform] }}
                      />
                    </div>
                  ))}
                  
                  {/* Add Post Button */}
                  <button className="w-full p-2 rounded-lg border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] transition-all flex items-center justify-center gap-1">
                    <Plus size={14} />
                    <span className="text-xs">Add</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upcoming Posts */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h3 className="font-semibold flex items-center gap-2">
            <Clock size={18} className="text-[var(--accent)]" />
            Upcoming Posts
          </h3>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockPosts.slice(0, 5).map((post) => (
              <div 
                key={post.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-elevated)] transition-colors"
              >
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${platformColors[post.platform]}20` }}
                >
                  {platformIcons[post.platform]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{post.title}</p>
                  <p className="text-xs text-[var(--text-muted)]">
                    {format(post.date, 'EEE, MMM d')} at {post.time}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" icon={Play} />
                  <Button variant="ghost" size="sm" icon={Trash2} className="text-red-400" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform Legend */}
      <div className="flex items-center gap-6 justify-center text-sm">
        {Object.entries(platformColors).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="text-[var(--text-muted)] capitalize">{platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
