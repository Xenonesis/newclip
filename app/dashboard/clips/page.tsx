'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  Check
} from 'lucide-react';

// Mock clips data
const mockClips = [
  { id: 1, title: 'AI Will Change Everything', viralityScore: 92, views: 15200, duration: 42, status: 'generated', topics: ['AI', 'Future'] },
  { id: 2, title: 'Morning Routine for Success', viralityScore: 88, views: 8700, duration: 38, status: 'published', topics: ['Productivity', 'Lifestyle'] },
  { id: 3, title: 'Work From Home Setup', viralityScore: 85, views: 6500, duration: 55, status: 'scheduled', topics: ['Remote Work'] },
  { id: 4, title: 'Focus Tips That Work', viralityScore: 82, views: 5200, duration: 32, status: 'generated', topics: ['Focus', 'Tips'] },
  { id: 5, title: 'Growth Mindset Explained', viralityScore: 78, views: 4100, duration: 48, status: 'generated', topics: ['Mindset'] },
  { id: 6, title: 'Daily Habits of Winners', viralityScore: 75, views: 3800, duration: 41, status: 'generated', topics: ['Habits', 'Success'] },
  { id: 7, title: 'How to Stay Motivated', viralityScore: 72, views: 3200, duration: 36, status: 'published', topics: ['Motivation'] },
  { id: 8, title: 'Time Management Secrets', viralityScore: 68, views: 2900, duration: 52, status: 'generated', topics: ['Time', 'Productivity'] },
];

export default function ClipsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedClips, setSelectedClips] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('virality');

  const filteredClips = mockClips
    .filter(clip => clip.title.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'virality') return b.viralityScore - a.viralityScore;
      if (sortBy === 'views') return b.views - a.views;
      return b.viralityScore - a.viralityScore;
    });

  const toggleSelect = (id: number) => {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Clips</h1>
          <p className="text-[var(--text-secondary)] mt-1">
            {filteredClips.length} clips from your videos
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download}>Export</Button>
          <Button icon={Sparkles}>Generate More</Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search clips..."
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--primary)]"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
        >
          <option value="virality">Sort: Virality</option>
          <option value="views">Sort: Views</option>
          <option value="date">Sort: Date</option>
        </select>
        <div className="flex gap-1 p-1 bg-[var(--bg-card)] rounded-lg">
          <button
            onClick={() => setView('grid')}
            className={cn('p-2 rounded-md transition-colors', view === 'grid' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]')}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView('list')}
            className={cn('p-2 rounded-md transition-colors', view === 'list' ? 'bg-[var(--primary)] text-white' : 'text-[var(--text-muted)]')}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {/* Selection Bar */}
      {selectedClips.length > 0 && (
        <div className="flex items-center justify-between p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/30 rounded-lg">
          <span className="text-sm font-medium">
            {selectedClips.length} clip{selectedClips.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" icon={Calendar}>Schedule</Button>
            <Button variant="secondary" size="sm" icon={Download}>Download</Button>
            <Button size="sm" icon={Sparkles}>Publish</Button>
          </div>
        </div>
      )}

      {/* Grid View */}
      {view === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                  <div className="w-12 h-12 rounded-full bg-black/50 backdrop-blur flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors">
                    <Play size={24} className="text-white ml-1" />
                  </div>
                </div>
                
                {/* Duration */}
                <span className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/70 rounded text-xs text-white">
                  {formatDuration(clip.duration)}
                </span>

                {/* Select Checkbox */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(clip.id); }}
                  className={cn(
                    'absolute top-2 left-2 w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-white/50 bg-black/30 hover:border-white'
                  )}
                >
                  {selectedClips.includes(clip.id) && <Check size={14} className="text-white" />}
                </button>

                {/* Virality Score */}
                <div 
                  className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: getViralityColor(clip.viralityScore) }}
                >
                  <TrendingUp size={12} />
                  {clip.viralityScore}
                </div>

                {/* Status Badge */}
                {clip.status !== 'generated' && (
                  <span className={cn(
                    'absolute bottom-2 left-2 px-2 py-0.5 rounded text-xs capitalize',
                    clip.status === 'published' ? 'bg-green-500/80 text-white' : 'bg-yellow-500/80 text-black'
                  )}>
                    {clip.status}
                  </span>
                )}
              </div>
              
              <CardContent className="p-3">
                <h3 className="font-medium text-sm truncate">{clip.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-xs text-[var(--text-muted)]">
                  <span className="flex items-center gap-1">
                    <Eye size={12} /> {formatNumber(clip.views)}
                  </span>
                  <span>9:16</span>
                </div>
                <div className="flex gap-1 mt-2">
                  {clip.topics.map(topic => (
                    <span key={topic} className="px-2 py-0.5 bg-[var(--bg-secondary)] rounded text-xs text-[var(--text-muted)]">
                      {topic}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* List View */}
      {view === 'list' && (
        <Card>
          <div className="divide-y divide-[var(--border)]">
            <div className="flex items-center gap-4 p-4 text-sm text-[var(--text-muted)]">
              <button onClick={selectAll} className="p-1">
                <div className={cn(
                  'w-5 h-5 rounded border-2 flex items-center justify-center',
                  selectedClips.length === filteredClips.length
                    ? 'bg-[var(--primary)] border-[var(--primary)]'
                    : 'border-[var(--border)]'
                )}>
                  {selectedClips.length === filteredClips.length && <Check size={12} className="text-white" />}
                </div>
              </button>
              <span className="flex-1">Clip</span>
              <span className="w-24 text-center">Virality</span>
              <span className="w-24 text-center">Views</span>
              <span className="w-24 text-center">Duration</span>
              <span className="w-24 text-center">Status</span>
              <span className="w-24"></span>
            </div>
            {filteredClips.map((clip) => (
              <div key={clip.id} className="flex items-center gap-4 p-4 hover:bg-[var(--bg-card-hover)] transition-colors">
                <button onClick={() => toggleSelect(clip.id)} className="p-1">
                  <div className={cn(
                    'w-5 h-5 rounded border-2 flex items-center justify-center',
                    selectedClips.includes(clip.id)
                      ? 'bg-[var(--primary)] border-[var(--primary)]'
                      : 'border-[var(--border)]'
                  )}>
                    {selectedClips.includes(clip.id) && <Check size={12} className="text-white" />}
                  </div>
                </button>
                <div className="flex-1 flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <Play size={16} className="text-white" />
                  </div>
                  <span className="font-medium text-sm">{clip.title}</span>
                </div>
                <div className="w-24 flex justify-center">
                  <span 
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold text-white"
                    style={{ backgroundColor: getViralityColor(clip.viralityScore) }}
                  >
                    <TrendingUp size={12} />
                    {clip.viralityScore}
                  </span>
                </div>
                <span className="w-24 text-center text-sm text-[var(--text-muted)]">
                  {formatNumber(clip.views)}
                </span>
                <span className="w-24 text-center text-sm text-[var(--text-muted)]">
                  {formatDuration(clip.duration)}
                </span>
                <span className="w-24 flex justify-center">
                  <span className={cn(
                    'px-2 py-1 rounded text-xs capitalize',
                    clip.status === 'published' ? 'bg-green-500/10 text-green-400' :
                    clip.status === 'scheduled' ? 'bg-yellow-500/10 text-yellow-400' :
                    'bg-[var(--bg-secondary)] text-[var(--text-muted)]'
                  )}>
                    {clip.status}
                  </span>
                </span>
                <div className="w-24 flex justify-end gap-2">
                  <Button variant="ghost" size="sm" icon={Calendar} />
                  <Button variant="ghost" size="sm" icon={Download} />
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
