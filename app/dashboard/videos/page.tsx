'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  RefreshCw
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
    icon: CheckCircle, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10',
    label: 'Completed' 
  },
  PROCESSING: { 
    icon: Loader2, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    label: 'Processing' 
  },
  QUEUED: { 
    icon: Clock, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    label: 'Queued' 
  },
  FAILED: { 
    icon: AlertCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    label: 'Failed' 
  },
  UPLOADING: { 
    icon: Loader2, 
    color: 'text-cyan-400', 
    bg: 'bg-cyan-500/10',
    label: 'Uploading' 
  },
};

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVideos = async () => {
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
  };

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Videos</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {videos.length} video{videos.length !== 1 ? 's' : ''} uploaded
          </p>
        </div>
        <Button icon={Upload} onClick={() => window.location.href = '/dashboard/upload'}>
          Upload Video
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            aria-label="Search videos"
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="all">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PROCESSING">Processing</option>
          <option value="QUEUED">Queued</option>
        </select>
        <button
          onClick={fetchVideos}
          className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label="Refresh videos"
        >
          <RefreshCw size={18} className={cn("text-[var(--text-muted)]", loading && "animate-spin")} />
        </button>
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchVideos} className="mt-2">
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
              <Card key={video.id} hover className="overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center gap-4 p-4">
                  {/* Thumbnail */}
                  <div className="relative w-full md:w-48 h-28 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex-shrink-0 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button 
                        className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                        aria-label={`Play ${video.title}`}
                      >
                        <Play size={18} className="text-white ml-0.5" aria-hidden="true" />
                      </button>
                    </div>
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                      {Math.floor(video.duration / 3600)}:{Math.floor((video.duration % 3600) / 60).toString().padStart(2, '0')}:{(video.duration % 60).toString().padStart(2, '0')}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--text-primary)] truncate">{video.title}</h3>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      Uploaded {formatTimeAgo(video.createdAt)}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6">
                    {/* Clips Count */}
                    <div className="text-center">
                      <p className="text-2xl font-bold text-[var(--text-primary)]">{video.clipCount}</p>
                      <p className="text-xs text-[var(--text-muted)]">Clips</p>
                    </div>

                    {/* Status */}
                    <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', status.bg)}>
                      <StatusIcon size={14} className={cn(status.color, video.status === 'PROCESSING' && 'animate-spin')} aria-hidden="true" />
                      <span className={cn('text-sm font-medium', status.color)}>{status.label}</span>
                    </div>

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
                      <button 
                        className="p-2 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                        aria-label="More options"
                      >
                        <MoreVertical size={18} className="text-[var(--text-muted)]" aria-hidden="true" />
                      </button>
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
          icon={Play}
          title="No videos found"
          description={search ? 'Try a different search term' : 'Upload a video to get started'}
          actionLabel="Upload Video"
          onAction={() => window.location.href = '/dashboard/upload'}
        />
      )}
    </div>
  );
}
