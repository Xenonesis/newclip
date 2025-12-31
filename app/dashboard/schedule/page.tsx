'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from '@/lib/utils';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Play,
  Clock,
  Check,
  Trash2,
  RefreshCw,
  Calendar,
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { format, addDays, startOfWeek, isSameDay, isToday, isPast } from 'date-fns';

interface ScheduledPost {
  id: string;
  clipId: string;
  platform: string;
  scheduledFor: string;
  status: string;
  clip?: {
    title: string;
    thumbnailUrl?: string;
  };
}

const platformColors: Record<string, string> = {
  INSTAGRAM: '#E1306C',
  TIKTOK: '#000000',
  YOUTUBE: '#FF0000',
  LINKEDIN: '#0A66C2',
  TWITTER: '#1DA1F2',
  FACEBOOK: '#1877F2',
  THREADS: '#000000',
  PINTEREST: '#E60023',
  SNAPCHAT: '#FFFC00',
  REDDIT: '#FF4500',
};

const platformIcons: Record<string, string> = {
  INSTAGRAM: '📸',
  TIKTOK: '🎵',
  YOUTUBE: '▶️',
  LINKEDIN: '💼',
  TWITTER: '🐦',
  FACEBOOK: '📘',
  THREADS: '🧵',
  PINTEREST: '📌',
  SNAPCHAT: '👻',
  REDDIT: '🔴',
};

export default function SchedulePage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'week' | 'month'>('week');
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const fetchSchedule = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        startDate: weekStart.toISOString(),
        endDate: addDays(weekStart, 7).toISOString(),
      });
      
      const res = await fetch(`/api/schedule?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch schedule');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [weekStart]);

  useEffect(() => {
    fetchSchedule();
  }, [currentDate, fetchSchedule]);

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => isSameDay(new Date(post.scheduledFor), date));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const deletePost = async (postId: string) => {
    try {
      const res = await fetch(`/api/schedule?id=${postId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete post');
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error('Failed to delete post:', err);
    }
  };

  const totalScheduled = posts.filter(p => p.status === 'SCHEDULED').length;
  const totalPublished = posts.filter(p => p.status === 'PUBLISHED').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Content Calendar" 
        description="Schedule and manage your posts across all platforms"
      >
        <button
          onClick={fetchSchedule}
          disabled={loading}
          className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
          aria-label="Refresh schedule"
        >
          <RefreshCw size={18} className={cn("text-[var(--text-muted)]", loading && "animate-spin")} />
        </button>
        <Button icon={Plus}>New Post</Button>
      </PageHeader>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--text-muted)]">This Week</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{posts.length}</p>
        </div>
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--text-muted)]">Scheduled</p>
          <p className="text-2xl font-bold text-yellow-400">{totalScheduled}</p>
        </div>
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--text-muted)]">Published</p>
          <p className="text-2xl font-bold text-green-400">{totalPublished}</p>
        </div>
        <div className="p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
          <p className="text-sm text-[var(--text-muted)]">Platforms</p>
          <p className="text-2xl font-bold text-[var(--primary)]">{new Set(posts.map(p => p.platform)).size}</p>
        </div>
      </div>

      {/* Calendar Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-1">
            <button 
              onClick={() => navigateWeek('prev')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Previous week"
            >
              <ChevronLeft size={20} className="text-[var(--text-muted)]" />
            </button>
            <h2 className="text-base sm:text-lg font-semibold min-w-[160px] sm:min-w-[220px] text-center text-[var(--text-primary)]">
              {format(weekStart, 'MMM d')} – {format(addDays(weekStart, 6), 'MMM d, yyyy')}
            </h2>
            <button 
              onClick={() => navigateWeek('next')}
              className="p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              aria-label="Next week"
            >
              <ChevronRight size={20} className="text-[var(--text-muted)]" />
            </button>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setCurrentDate(new Date())}
          >
            Today
          </Button>
        </div>
        
        <div className="flex p-1 bg-[var(--bg-secondary)] rounded-xl border border-[var(--border)]">
          <button
            onClick={() => setView('week')}
            aria-pressed={view === 'week'}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
              view === 'week' ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            Week
          </button>
          <button
            onClick={() => setView('month')}
            aria-pressed={view === 'month'}
            className={cn(
              'px-4 py-1.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
              view === 'month' ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            )}
          >
            Month
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} />
            <p>{error}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchSchedule}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="min-h-[200px] sm:min-h-[400px] animate-pulse">
              <div className="bg-[var(--bg-card)] rounded-t-xl p-3 border border-b-0 border-[var(--border)]">
                <div className="h-3 w-8 bg-[var(--bg-secondary)] rounded mx-auto mb-2" />
                <div className="h-6 w-6 bg-[var(--bg-secondary)] rounded mx-auto" />
              </div>
              <div className="bg-[var(--bg-card)] rounded-b-xl p-2 border border-t-0 border-[var(--border)] min-h-[150px] sm:min-h-[340px]">
                <div className="space-y-2">
                  <div className="h-16 bg-[var(--bg-secondary)] rounded-lg" />
                  <div className="h-16 bg-[var(--bg-secondary)] rounded-lg" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Week View */}
      {!loading && !error && (
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 sm:gap-3">
          {weekDays.map((day) => {
            const dayPosts = getPostsForDate(day);
            const today = isToday(day);
            const past = isPast(day) && !today;
            
            return (
              <div key={day.toISOString()} className="min-h-[200px] sm:min-h-[400px]">
                {/* Day Header */}
                <div className={cn(
                  'text-center py-3 rounded-t-xl border border-b-0 transition-colors',
                  today 
                    ? 'bg-[var(--primary)]/10 border-[var(--primary)]/30' 
                    : past
                      ? 'bg-[var(--bg-secondary)]/50 border-[var(--border)]'
                      : 'bg-[var(--bg-card)] border-[var(--border)]'
                )}>
                  <p className={cn(
                    "text-xs uppercase tracking-wider",
                    past ? "text-[var(--text-muted)]/50" : "text-[var(--text-muted)]"
                  )}>
                    {format(day, 'EEE')}
                  </p>
                  <p className={cn(
                    'text-lg sm:text-xl font-bold mt-1',
                    today ? 'text-[var(--primary)]' : past ? 'text-[var(--text-muted)]' : 'text-[var(--text-primary)]'
                  )}>
                    {format(day, 'd')}
                  </p>
                  {today && (
                    <Badge variant="purple" size="sm" className="mt-1">Today</Badge>
                  )}
                </div>
                
                {/* Posts */}
                <div className={cn(
                  'border border-t-0 rounded-b-xl p-2 min-h-[150px] sm:min-h-[340px]',
                  today ? 'border-[var(--primary)]/30 bg-[var(--primary)]/5' : 'border-[var(--border)]'
                )}>
                  <div className="space-y-2">
                    {dayPosts.map((post) => (
                      <div
                        key={post.id}
                        className="p-2.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)] hover:border-[var(--border-hover)] cursor-pointer transition-all group"
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-xs text-[var(--text-muted)] font-medium">
                            {format(new Date(post.scheduledFor), 'HH:mm')}
                          </span>
                          <span className="text-sm" title={post.platform}>
                            {platformIcons[post.platform] || '📱'}
                          </span>
                        </div>
                        <p className="text-xs font-medium truncate text-[var(--text-primary)]">{post.clip?.title || 'Untitled'}</p>
                        <div 
                          className="h-1.5 rounded-full mt-2"
                          style={{ backgroundColor: platformColors[post.platform] || '#666' }}
                        />
                      </div>
                    ))}
                    
                    {/* Add Post Button */}
                    {!past && (
                      <button 
                        className="w-full p-2.5 rounded-xl border border-dashed border-[var(--border)] text-[var(--text-muted)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        aria-label={`Add post for ${format(day, 'EEEE, MMMM d')}`}
                      >
                        <Plus size={14} aria-hidden="true" />
                        <span className="text-xs font-medium">Add</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Upcoming Posts */}
      {!loading && !error && (
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-[var(--bg-secondary)]/50">
            <h3 className="font-semibold flex items-center gap-2 text-[var(--text-primary)]">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 flex items-center justify-center">
                <Clock size={16} className="text-cyan-400" aria-hidden="true" />
              </div>
              Upcoming Posts
            </h3>
            <Button variant="ghost" size="sm" icon={ArrowRight} iconPosition="right">
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            {posts.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No scheduled posts"
                description="Schedule some clips to see them here"
                actionLabel="Browse Clips"
                onAction={() => window.location.href = '/dashboard/clips'}
                className="py-12"
              />
            ) : (
              <div className="divide-y divide-[var(--border)]">
                {posts.slice(0, 5).map((post) => (
                  <div 
                    key={post.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                      style={{ backgroundColor: `${platformColors[post.platform] || '#666'}20` }}
                    >
                      {platformIcons[post.platform] || '📱'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate text-[var(--text-primary)]">{post.clip?.title || 'Untitled'}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">
                        {format(new Date(post.scheduledFor), 'EEE, MMM d')} at {format(new Date(post.scheduledFor), 'HH:mm')}
                      </p>
                    </div>
                    <Badge 
                      variant={post.status === 'PUBLISHED' ? 'success' : 'warning'}
                      size="sm"
                    >
                      {post.status.toLowerCase()}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" icon={Play}>
                        <span className="sr-only">Preview</span>
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm" 
                        icon={Trash2}
                        onClick={() => deletePost(post.id)}
                      >
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Platform Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 justify-center p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
        <span className="text-xs text-[var(--text-muted)] font-medium">Platforms:</span>
        {Object.entries(platformColors).slice(0, 6).map(([platform, color]) => (
          <div key={platform} className="flex items-center gap-1.5">
            <div 
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
              aria-hidden="true"
            />
            <span className="text-xs text-[var(--text-muted)] capitalize">{platform.toLowerCase()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
