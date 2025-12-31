'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  Loader2
} from 'lucide-react';

// Mock videos data
const mockVideos = [
  { 
    id: 1, 
    title: 'Podcast Episode 45: AI in Business', 
    duration: 3600, 
    clips: 12, 
    status: 'completed',
    uploadedAt: '2 hours ago',
    thumbnail: null
  },
  { 
    id: 2, 
    title: 'Interview with Alex Thompson - Tech Trends', 
    duration: 2400, 
    clips: 8, 
    status: 'processing',
    progress: 65,
    uploadedAt: '3 hours ago',
    thumbnail: null
  },
  { 
    id: 3, 
    title: 'Morning Routine for Productivity', 
    duration: 1800, 
    clips: 15, 
    status: 'completed',
    uploadedAt: '1 day ago',
    thumbnail: null
  },
  { 
    id: 4, 
    title: 'Q&A Session - December 2024', 
    duration: 5400, 
    clips: 22, 
    status: 'completed',
    uploadedAt: '3 days ago',
    thumbnail: null
  },
  { 
    id: 5, 
    title: 'Work From Home Setup Tour', 
    duration: 1200, 
    clips: 6, 
    status: 'completed',
    uploadedAt: '1 week ago',
    thumbnail: null
  },
  { 
    id: 6, 
    title: 'Tech Review: New Gadgets', 
    duration: 2100, 
    clips: 0, 
    status: 'queued',
    uploadedAt: 'Just now',
    thumbnail: null
  },
];

const statusConfig = {
  completed: { 
    icon: CheckCircle, 
    color: 'text-green-400', 
    bg: 'bg-green-500/10',
    label: 'Completed' 
  },
  processing: { 
    icon: Loader2, 
    color: 'text-yellow-400', 
    bg: 'bg-yellow-500/10',
    label: 'Processing' 
  },
  queued: { 
    icon: Clock, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10',
    label: 'Queued' 
  },
  failed: { 
    icon: AlertCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10',
    label: 'Failed' 
  },
};

export default function VideosPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredVideos = mockVideos.filter(video => {
    const matchesSearch = video.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || video.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Videos</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {mockVideos.length} videos uploaded
          </p>
        </div>
        <Button icon={Upload} onClick={() => window.location.href = '/dashboard/upload'}>
          Upload Video
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search videos..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
        >
          <option value="all">All Status</option>
          <option value="completed">Completed</option>
          <option value="processing">Processing</option>
          <option value="queued">Queued</option>
        </select>
      </div>

      {/* Videos List */}
      <div className="space-y-4">
        {filteredVideos.map((video) => {
          const status = statusConfig[video.status as keyof typeof statusConfig];
          const StatusIcon = status.icon;
          
          return (
            <Card key={video.id} hover className="overflow-hidden">
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail */}
                <div className="relative w-48 h-28 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20 flex-shrink-0 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                      <Play size={18} className="text-white ml-0.5" />
                    </div>
                  </div>
                  <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                    {Math.floor(video.duration / 3600)}:{Math.floor((video.duration % 3600) / 60).toString().padStart(2, '0')}:{(video.duration % 60).toString().padStart(2, '0')}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--text-primary)] truncate">{video.title}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Uploaded {video.uploadedAt}
                  </p>
                  
                  {/* Progress Bar (if processing) */}
                  {video.status === 'processing' && video.progress && (
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] mb-1">
                        <span>Processing clips...</span>
                        <span>{video.progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
                          style={{ width: `${video.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="flex items-center gap-6">
                  {/* Clips Count */}
                  <div className="text-center">
                    <p className="text-2xl font-bold text-[var(--text-primary)]">{video.clips}</p>
                    <p className="text-xs text-[var(--text-muted)]">Clips</p>
                  </div>

                  {/* Status */}
                  <div className={cn('flex items-center gap-2 px-3 py-1.5 rounded-full', status.bg)}>
                    <StatusIcon size={14} className={cn(status.color, video.status === 'processing' && 'animate-spin')} />
                    <span className={cn('text-sm font-medium', status.color)}>{status.label}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {video.status === 'completed' && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        icon={Scissors}
                        onClick={() => window.location.href = '/dashboard/clips'}
                      >
                        View Clips
                      </Button>
                    )}
                    <button className="p-2 hover:bg-[var(--bg-card-hover)] rounded-lg transition-colors">
                      <MoreVertical size={18} className="text-[var(--text-muted)]" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredVideos.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--bg-card)] flex items-center justify-center">
            <Play size={28} className="text-[var(--text-muted)]" />
          </div>
          <h3 className="font-semibold text-[var(--text-primary)]">No videos found</h3>
          <p className="text-[var(--text-muted)] mt-1">
            {search ? 'Try a different search term' : 'Upload a video to get started'}
          </p>
          <Button className="mt-4" icon={Upload} onClick={() => window.location.href = '/dashboard/upload'}>
            Upload Video
          </Button>
        </div>
      )}
    </div>
  );
}
