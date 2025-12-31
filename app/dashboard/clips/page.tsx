'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ClipCardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatNumber, formatDuration, getViralityColor, cn } from '@/lib/utils';
import { 
  Play, 
  Eye, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  Grid,
  List,
  Search,
  Sparkles,
  Check,
  RefreshCw
} from 'lucide-react';

interface Clip {
  id: string;
  title: string;
  viralityScore: number;
  duration: number;
  status: string;
  thumbnailUrl?: string;
  createdAt: string;
}

export default function ClipsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('virality');
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClips = async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams();
      if (sortBy === 'virality') params.set('sortBy', 'viralityScore');
      if (sortBy === 'date') params.set('sortBy', 'createdAt');
      
      const res = await fetch(`/api/clips?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch clips');
      const data = await res.json();
      setClips(data.clips || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, [sortBy]);

  const filteredClips = clips.filter(clip => 
    clip.title.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedClips(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedClips.length === filteredClips.length) {
      setSelectedClips([]);
    } else {
      setSelectedClips(filteredClips.map(c => c.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clips</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {filteredClips.length} clip{filteredClips.length !== 1 ? 's' : ''} from your videos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download}>Export</Button>
          <Button icon={Sparkles}>Generate More</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clips..."
            aria-label="Search clips"
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          aria-label="Sort clips"
          className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
        >
          <option value="virality">Sort: Virality</option>
          <option value="views">Sort: Views</option>
          <option value="date">Sort: Date</option>
        </select>
        <div className="flex gap-1 p-1 bg-[var(--bg-card)] rounded-lg">
          <button
            onClick={() => setView('grid')}
            aria-label="Grid view"
            aria-pressed={view === 'grid'}
            className={cn('p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]', view === 'grid' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]')}
          >
            <Grid size={18} aria-hidden="true" />
          </button>
          <button
            onClick={() => setView('list')}
            aria-label="List view"
            aria-pressed={view === 'list'}
            className={cn('p-2 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]', view === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]')}
          >
            <List size={18} aria-hidden="true" />
          </button>
        </div>
        <button
          onClick={fetchClips}
          className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg hover:bg-[var(--bg-card-hover)] transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
          aria-label="Refresh clips"
        >
          <RefreshCw size={18} className={cn("text-[var(--text-muted)]", loading && "animate-spin")} />
        </button>
      </div>

      {/* Selection Bar */}
      {selectedClips.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
          <span className="text-sm font-medium">
            {selectedClips.length} clip{selectedClips.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={Calendar}>Schedule</Button>
            <Button variant="secondary" size="sm" icon={Download}>Download</Button>
            <Button size="sm" icon={Sparkles}>Publish</Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchClips} className="mt-2">
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <ClipCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredClips.length === 0 && (
        <EmptyState
          icon={Sparkles}
          title="No clips found"
          description={search ? 'Try a different search term' : 'Upload a video to generate clips'}
          actionLabel="Upload Video"
          onAction={() => window.location.href = '/dashboard/upload'}
        />
      )}

      {/* Grid View */}
      {!loading && !error && view === 'grid' && filteredClips.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredClips.map((clip) => (
            <Card 
              key={clip.id} 
              hover 
              className={cn(
                'overflow-hidden transition-all',
                selectedClips.includes(clip.id) && 'ring-2 ring-[var(--primary)]'
              )}
            >
              <div className="relative aspect-[9/16] bg-gradient-to-br from-indigo-500/20 to-purple-600/20">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={`Play ${clip.title}`}
                  >
                    <Play size={24} className="text-white ml-1" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                  {formatDuration(clip.duration)}
                </span>

                {/* Select Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(clip.id); }}
                  aria-label={selectedClips.includes(clip.id) ? `Deselect ${clip.title}` : `Select ${clip.title}`}
                  aria-pressed={selectedClips.includes(clip.id)}
                  className={cn(
                    'absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-white/50 bg-black/30 hover:border-white'
                  )}
                >
                  {selectedClips.includes(clip.id) && <Check size={14} className="text-white" aria-hidden="true" />}
                </button>

                {/* Virality Score */}
                <div 
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: getViralityColor(clip.viralityScore) }}
                  title={`Virality score: ${clip.viralityScore}`}
                >
                  <TrendingUp size={12} aria-hidden="true" />
                  {clip.viralityScore}
                </div>

                {/* Status Badge */}
                {clip.status !== 'GENERATED' && (
                  <span className={cn(
                    'absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs capitalize',
                    clip.status === 'PUBLISHED' ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-black'
                  )}>
                    {clip.status.toLowerCase()}
                  </span>
                )}
              </div>
              
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate">{clip.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                  <span>9:16</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && !error && view === 'list' && filteredClips.length > 0 && (
        <Card>
          <div className="divide-y divide-[var(--border)]">
            <div className="hidden md:flex items-center gap-4 p-4 text-sm text-[var(--text-muted)]">
              <button onClick={selectAll} className="p-1" aria-label={selectedClips.length === filteredClips.length ? 'Deselect all' : 'Select all'}>
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  selectedClips.length === filteredClips.length
                    ? 'bg-[var(--primary)] border-[var(--primary)]'
                    : 'border-[var(--border)]'
                )}>
                  {selectedClips.length === filteredClips.length && <Check size={12} className="text-white" aria-hidden="true" />}
                </div>
              </button>
              <span className="flex-1">Clip</span>
              <span className="w-24 text-center">Virality</span>
              <span className="w-24 text-center">Duration</span>
              <span className="w-24 text-center">Status</span>
              <span className="w-24"></span>
            </div>
            {filteredClips.map((clip) => (
              <div key={clip.id} className="flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors">
                <button 
                  onClick={() => toggleSelect(clip.id)} 
                  className="hidden md:block p-1"
                  aria-label={selectedClips.includes(clip.id) ? `Deselect ${clip.title}` : `Select ${clip.title}`}
                >
                  <div className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-[var(--border)]'
                  )}>
                    {selectedClips.includes(clip.id) && <Check size={12} className="text-white" aria-hidden="true" />}
                  </div>
                </button>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Play size={16} className="text-white" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-sm truncate">{clip.title}</span>
                </div>
                <div className="w-full md:w-24 flex md:justify-center">
                  <span 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getViralityColor(clip.viralityScore) }}
                  >
                    <TrendingUp size={12} aria-hidden="true" />
                    {clip.viralityScore}
                  </span>
                </div>
                <span className="w-full md:w-24 md:text-center text-sm text-[var(--text-muted)]">
                  <span className="md:hidden">Duration: </span>{formatDuration(clip.duration)}
                </span>
                <span className="w-full md:w-24 flex md:justify-center">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs capitalize',
                    clip.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' :
                    clip.status === 'SCHEDULED' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  )}>
                    {clip.status.toLowerCase()}
                  </span>
                </span>
                <div className="w-full md:w-24 flex md:justify-end gap-2">
                  <Button variant="ghost" size="sm" icon={Calendar}>
                    <span className="md:hidden ml-2">Schedule</span>
                  </Button>
                  <Button variant="ghost" size="sm" icon={Download}>
                    <span className="md:hidden ml-2">Download</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
