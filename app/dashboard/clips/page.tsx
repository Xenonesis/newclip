'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
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
  RefreshCw,
  Scissors,
  X
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

function getViralityVariant(score: number): 'success' | 'warning' | 'purple' {
  if (score >= 90) return 'success';
  if (score >= 80) return 'warning';
  return 'purple';
}

export default function ClipsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedClips, setSelectedClips] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('virality');
  const [clips, setClips] = useState<Clip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClips = useCallback(async () => {
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
  }, [sortBy]);

  useEffect(() => {
    fetchClips();
  }, [sortBy, fetchClips]);

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

  const clearSelection = () => setSelectedClips([]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader 
        title="Clips" 
        description={`${filteredClips.length} clip${filteredClips.length !== 1 ? 's' : ''} from your videos`}
      >
        <Button variant="secondary" icon={Download}>Export</Button>
        <Button icon={Sparkles}>Generate More</Button>
      </PageHeader>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" aria-hidden="true" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clips..."
            aria-label="Search clips"
            className="w-full pl-11 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2 sm:gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            aria-label="Sort clips"
            className="flex-1 sm:flex-initial px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer transition-all"
          >
            <option value="virality">Sort: Virality</option>
            <option value="views">Sort: Views</option>
            <option value="date">Sort: Date</option>
          </select>
          <div className="flex p-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl">
            <button
              onClick={() => setView('grid')}
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              className={cn(
                'p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                view === 'grid' ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              <Grid size={18} aria-hidden="true" />
            </button>
            <button
              onClick={() => setView('list')}
              aria-label="List view"
              aria-pressed={view === 'list'}
              className={cn(
                'p-2 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                view === 'list' ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
              )}
            >
              <List size={18} aria-hidden="true" />
            </button>
          </div>
          <button
            onClick={fetchClips}
            disabled={loading}
            className="p-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:bg-[var(--bg-card-hover)] hover:border-[var(--border-hover)] transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] disabled:opacity-50"
            aria-label="Refresh clips"
          >
            <RefreshCw size={18} className={cn("text-[var(--text-muted)]", loading && "animate-spin")} />
          </button>
        </div>
      </div>

      {/* Selection Bar */}
      {selectedClips.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-xl animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
              <Check size={16} className="text-indigo-400" />
            </div>
            <span className="text-sm font-medium text-[var(--text-primary)]">
              {selectedClips.length} clip{selectedClips.length > 1 ? 's' : ''} selected
            </span>
            <button 
              onClick={clearSelection}
              className="text-sm text-[var(--text-muted)] hover:text-[var(--text-primary)] flex items-center gap-1 transition-colors"
            >
              <X size={14} /> Clear
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm" icon={Calendar}>Schedule</Button>
            <Button variant="secondary" size="sm" icon={Download}>Download</Button>
            <Button size="sm" icon={Sparkles}>Publish All</Button>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 flex items-center justify-between">
          <p>{error}</p>
          <Button variant="ghost" size="sm" onClick={fetchClips}>
            Try Again
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className={cn(
          "gap-4",
          view === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "flex flex-col"
        )}>
          {[...Array(8)].map((_, i) => (
            <ClipCardSkeleton key={i} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredClips.length === 0 && (
        <EmptyState
          icon={Scissors}
          title="No clips found"
          description={search ? 'Try a different search term' : 'Upload a video to generate AI-powered clips'}
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
                'overflow-hidden transition-all group',
                selectedClips.includes(clip.id) && 'ring-2 ring-[var(--primary)] ring-offset-2 ring-offset-[var(--bg-primary)]'
              )}
            >
              <div className="relative aspect-[9/16] bg-gradient-to-br from-indigo-500/20 to-purple-600/20 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <button 
                    className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-black/70 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={`Play ${clip.title}`}
                  >
                    <Play size={24} className="text-white ml-1" aria-hidden="true" />
                  </button>
                </div>
                
                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 backdrop-blur-sm rounded-md text-xs text-white font-medium">
                  {formatDuration(clip.duration)}
                </span>

                {/* Select Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(clip.id); }}
                  aria-label={selectedClips.includes(clip.id) ? `Deselect ${clip.title}` : `Select ${clip.title}`}
                  aria-pressed={selectedClips.includes(clip.id)}
                  className={cn(
                    'absolute top-2 left-2 w-7 h-7 rounded-lg border-2 flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-white',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)] scale-100'
                      : 'border-white/50 bg-black/30 hover:border-white opacity-0 group-hover:opacity-100'
                  )}
                >
                  {selectedClips.includes(clip.id) && <Check size={14} className="text-white" aria-hidden="true" />}
                </button>

                {/* Virality Score */}
                <Badge
                  variant={getViralityVariant(clip.viralityScore)}
                  className="absolute top-2 right-2 flex items-center gap-1"
                >
                  <TrendingUp size={12} aria-hidden="true" />
                  {clip.viralityScore}
                </Badge>

                {/* Status Badge */}
                {clip.status !== 'GENERATED' && (
                  <Badge
                    variant={clip.status === 'PUBLISHED' ? 'success' : 'warning'}
                    size="sm"
                    className="absolute bottom-2 left-2"
                  >
                    {clip.status.toLowerCase()}
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate text-[var(--text-primary)]">{clip.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <span className="w-4 h-4 rounded bg-gradient-to-br from-indigo-500 to-purple-500" /> 9:16
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {!loading && !error && view === 'list' && filteredClips.length > 0 && (
        <Card className="overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            <div className="hidden md:flex items-center gap-4 p-4 text-sm text-[var(--text-muted)] bg-[var(--bg-secondary)]">
              <button onClick={selectAll} className="p-1" aria-label={selectedClips.length === filteredClips.length ? 'Deselect all' : 'Select all'}>
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                  selectedClips.length === filteredClips.length
                    ? 'bg-[var(--primary)] border-[var(--primary)]'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                )}>
                  {selectedClips.length === filteredClips.length && <Check size={12} className="text-white" aria-hidden="true" />}
                </div>
              </button>
              <span className="flex-1 font-medium">Clip</span>
              <span className="w-24 text-center font-medium">Virality</span>
              <span className="w-24 text-center font-medium">Duration</span>
              <span className="w-24 text-center font-medium">Status</span>
              <span className="w-28"></span>
            </div>
            {filteredClips.map((clip) => (
              <div 
                key={clip.id} 
                className={cn(
                  "flex flex-col md:flex-row md:items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors",
                  selectedClips.includes(clip.id) && "bg-indigo-500/5"
                )}
              >
                <button 
                  onClick={() => toggleSelect(clip.id)} 
                  className="hidden md:block p-1"
                  aria-label={selectedClips.includes(clip.id) ? `Deselect ${clip.title}` : `Select ${clip.title}`}
                >
                  <div className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center transition-colors',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                  )}>
                    {selectedClips.includes(clip.id) && <Check size={12} className="text-white" aria-hidden="true" />}
                  </div>
                </button>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                    <Play size={16} className="text-white ml-0.5" aria-hidden="true" />
                  </div>
                  <span className="font-medium text-sm truncate text-[var(--text-primary)]">{clip.title}</span>
                </div>
                <div className="w-full md:w-24 flex md:justify-center">
                  <Badge variant={getViralityVariant(clip.viralityScore)} className="flex items-center gap-1">
                    <TrendingUp size={12} aria-hidden="true" />
                    {clip.viralityScore}
                  </Badge>
                </div>
                <span className="w-full md:w-24 md:text-center text-sm text-[var(--text-muted)]">
                  <span className="md:hidden text-[var(--text-muted)]">Duration: </span>
                  {formatDuration(clip.duration)}
                </span>
                <span className="w-full md:w-24 flex md:justify-center">
                  <Badge
                    variant={
                      clip.status === 'PUBLISHED' ? 'success' :
                      clip.status === 'SCHEDULED' ? 'warning' :
                      'default'
                    }
                    size="sm"
                  >
                    {clip.status.toLowerCase()}
                  </Badge>
                </span>
                <div className="w-full md:w-28 flex md:justify-end gap-1">
                  <Button variant="ghost" size="sm" icon={Calendar}>
                    <span className="md:hidden">Schedule</span>
                  </Button>
                  <Button variant="ghost" size="sm" icon={Download}>
                    <span className="md:hidden">Download</span>
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
