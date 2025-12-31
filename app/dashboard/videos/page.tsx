'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { VideoCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatNumber, formatDuration, cn } from '@/lib/utils';
import { 
  Play, 
  MoreVertical,
  Clock,
  Scissors,
  Upload,
  Search,
  Filter,
  CheckCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Video,
  Trash2,
  Edit,
  Download
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  duration: number;
  clipCount: number;
  status: string;
  createdAt: string;
  thumbnailUrl?: string;
}

const statusConfig = {
  COMPLETED: { 
    variant: 'success' as const,
    icon: CheckCircle, 
    label: 'Completed' 
  },
  PROCESSING: { 
    variant: 'warning' as const,
    icon: Loader2, 
    label: 'Processing' 
  },
  QUEUED: { 
    variant: 'info' as const,
    icon: Clock, 
    label: 'Queued' 
  },
  FAILED: { 
    variant: 'error' as const,
    icon: AlertCircle, 
    label: 'Failed' 
  },
  UPLOADING: { 
    variant: 'info' as const,
    icon: Loader2, 
    label: 'Uploading' 
  },
};

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.set('status', statusFilter);
      if (search) params.set('search', search);
      
      const res = await fetch(`/api/videos?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch videos');
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    fetchVideos();
  }, [statusFilter]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading) fetchVideos();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(search.toLowerCase())
  );

  const formatTimeAgo = (date: string) => {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)} days ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Videos" 
        description={`${videos.length} video${videos.length !== 1 ? 's' : ''} uploaded`}
      >
        <Button icon={Upload} onClick={() => window.location.href = '/dashboard/upload'}>
          Upload Video
        </Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            aria-label="Search videos"
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter by status"
            className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-all cursor-pointer"
          >
            <option value="all">All Status</option>
            <option value="COMPLETED">Completed</option>
            <option value="PROCESSING">Processing</option>
            <option value="QUEUED">Queued</option>
          </select>
          <button
            onClick={fetchVideos}
            disabled={loading}
            className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
            aria-label="Refresh videos"
          >
            <RefreshCw size={18} className={cn("text-[var(--text-muted)]", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle size={18} aria-hidden="true" />
            <p>{error}</p>
          </div>
          <Button variant="ghost" size="sm" onClick={fetchVideos}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <VideoCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Videos List */}
      {!loading && !error && (
        <div className="space-y-4">
          {filteredVideos.map((video) => {
            const status = statusConfig[video.status as keyof typeof statusConfig] || statusConfig.QUEUED;
            const StatusIcon = status.icon;
            
            return (
              <Card key={video.id} hover className="overflow-hidden group">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-48 h-28 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        className="w-11 h-11 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={`Play ${video.title}`}
                      >
                        <Play size={18} className="text-white ml-0.5" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                      {Math.floor(video.duration / 3600)}:{Math.floor((video.duration % 3600) / 60).toString().padStart(2, '0')}:{(video.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate group-hover:text-indigo-400 transition-colors">
                      {video.title}
                    </h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Uploaded {formatTimeAgo(video.createdAt)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {/* Clips Count */}
                    <div className="text-center px-3">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{video.clipCount}</p>
                      <p className="text-xs text-[var(--text-muted)]">Clips</p>
                    </div>

                    {/* Status */}
                    <Badge variant={status.variant} className="flex items-center gap-1.5">
                      <StatusIcon size={12} className={cn(video.status === 'PROCESSING' && 'animate-spin')} aria-hidden="true" />
                      {status.label}
                    </Badge>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {video.status === 'COMPLETED' && (
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          icon={Scissors}
                          onClick={() => window.location.href = '/dashboard/clips'}
                        >
                          View Clips
                        </Button>
                      )}
                      <div className="relative">
                        <button 
                          onClick={() => setActiveMenu(activeMenu === video.id ? null : video.id)}
                          className="p-2 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                          aria-label="More options"
                          aria-expanded={activeMenu === video.id}
                        >
                          <MoreVertical size={18} className="text-[var(--text-muted)]" aria-hidden="true" />
                        </button>
                        
                        {activeMenu === video.id && (
                          <>
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => setActiveMenu(null)}
                              aria-hidden="true"
                            />
                            <div className="absolute right-0 top-full mt-1 w-44 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-20 py-1.5 animate-in fade-in slide-in-from-top-2">
                              <button className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                                <Edit size={14} aria-hidden="true" />
                                Edit Details
                              </button>
                              <button className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors">
                                <Download size={14} aria-hidden="true" />
                                Download
                              </button>
                              <div className="border-t border-[var(--border)] my-1" />
                              <button className="flex items-center gap-2.5 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors">
                                <Trash2 size={14} aria-hidden="true" />
                                Delete
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredVideos.length === 0 && (
        <EmptyState
          icon={Video}
          title="No videos found"
          description={search ? 'Try a different search term' : 'Upload a video to get started creating viral clips'}
          actionLabel="Upload Video"
          onAction={() => window.location.href = '/dashboard/upload'}
        />
      )}
    </div>
  );
}
