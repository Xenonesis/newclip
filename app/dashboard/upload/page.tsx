'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { cn } from '@/lib/utils';
import { 
  Upload, 
  Link2, 
  Youtube, 
  Settings2, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  FileVideo,
  Trash2,
  Info,
  Wand2,
  Clock,
  Layers
} from 'lucide-react';

const platformIcons: Record<string, string> = {
  tiktok: '🎵',
  instagram: '📸',
  youtube: '▶️',
  linkedin: '💼',
  twitter: '🐦',
};

export default function UploadPage() {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(true);
  const [settings, setSettings] = useState({
    maxClips: 10,
    duration: '30-60',
    platforms: ['tiktok', 'instagram', 'youtube'],
    autoCaptions: true,
    captionStyle: 'hormozi'
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      setFile(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
    },
    maxFiles: 1
  });

  const validateUrl = (value: string) => {
    setUrl(value);
    if (value && !value.match(/^https?:\/\/.+/)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
    } else {
      setUrlError('');
    }
  };

  const handleProcess = async () => {
    if (uploadMode === 'url' && urlError) return;
    
    setIsProcessing(true);
    try {
      const formData = new FormData();
      if (file) {
        formData.append('file', file);
      } else if (url) {
        formData.append('url', url);
      }
      formData.append('settings', JSON.stringify(settings));

      const res = await fetch('/api/videos', {
        method: 'POST',
        body: formData,
      });
      
      if (!res.ok) throw new Error('Failed to upload video');
      
      window.location.href = '/dashboard/videos';
    } catch (error) {
      console.error('Upload failed:', error);
      setIsProcessing(false);
    }
  };

  const isReady = file || (url && !urlError);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <PageHeader 
        title="Upload Video" 
        description="Upload a video or paste a URL to generate viral clips"
      />

      {/* Upload Mode Toggle */}
      <div className="flex gap-1 p-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl w-fit" role="tablist" aria-label="Upload method">
        <button
          role="tab"
          aria-selected={uploadMode === 'file'}
          aria-controls="file-panel"
          onClick={() => setUploadMode('file')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
            uploadMode === 'file' 
              ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          )}
        >
          <Upload size={16} aria-hidden="true" />
          Upload File
        </button>
        <button
          role="tab"
          aria-selected={uploadMode === 'url'}
          aria-controls="url-panel"
          onClick={() => setUploadMode('url')}
          className={cn(
            'flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
            uploadMode === 'url' 
              ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
          )}
        >
          <Link2 size={16} aria-hidden="true" />
          Paste URL
        </button>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <Card className="overflow-hidden">
          <CardContent id="file-panel" role="tabpanel" aria-labelledby="file-tab" className="p-4 sm:p-8">
            <div
              {...getRootProps()}
              className={cn(
                'border-2 border-dashed rounded-2xl p-6 sm:p-12 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                isDragActive 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/10 scale-[1.02]' 
                  : file 
                    ? 'border-green-500/50 bg-green-500/5'
                    : 'border-[var(--border)] hover:border-[var(--primary)]/50 hover:bg-[var(--bg-secondary)]'
              )}
            >
              <input {...getInputProps()} aria-label="Video file input" />
              {file ? (
                <div className="space-y-4">
                  <div className="w-20 h-20 mx-auto rounded-2xl bg-green-500/15 flex items-center justify-center">
                    <CheckCircle size={40} className="text-green-500" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">{file.name}</p>
                    <div className="flex items-center justify-center gap-3 mt-2">
                      <Badge variant="outline" size="sm">
                        <FileVideo size={12} className="mr-1" />
                        Video
                      </Badge>
                      <Badge variant="outline" size="sm">
                        {(file.size / (1024 * 1024)).toFixed(1)} MB
                      </Badge>
                    </div>
                  </div>
                  <Button 
                    variant="danger" 
                    size="sm" 
                    icon={Trash2}
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className={cn(
                    "w-20 h-20 mx-auto rounded-2xl flex items-center justify-center transition-all",
                    isDragActive ? "bg-[var(--primary)]/20 scale-110" : "bg-[var(--primary)]/10"
                  )}>
                    <Upload size={32} className={cn(
                      "transition-all",
                      isDragActive ? "text-[var(--primary)] animate-bounce" : "text-[var(--primary)]"
                    )} aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-[var(--text-primary)]">
                      {isDragActive ? 'Drop your video here' : 'Drag & drop your video'}
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      or click to browse files
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                    {['MP4', 'MOV', 'AVI', 'MKV', 'WebM'].map((format) => (
                      <Badge key={format} variant="outline" size="sm">{format}</Badge>
                    ))}
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Max duration: 4 hours • Max size: 5 GB
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* URL Input */}
      {uploadMode === 'url' && (
        <Card className="overflow-hidden">
          <CardContent id="url-panel" role="tabpanel" aria-labelledby="url-tab" className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="video-url" className="text-sm font-medium text-[var(--text-muted)] mb-2 block">Video URL</label>
                <div className={cn(
                  'flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-xl border transition-all',
                  urlError ? 'border-red-500/50 bg-red-500/5' : url ? 'border-green-500/50' : 'border-transparent hover:border-[var(--border)]'
                )}>
                  <div className="w-10 h-10 rounded-lg bg-red-500/15 flex items-center justify-center flex-shrink-0">
                    <Youtube size={20} className="text-red-500" aria-hidden="true" />
                  </div>
                  <input
                    id="video-url"
                    type="url"
                    value={url}
                    onChange={(e) => validateUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    aria-invalid={!!urlError}
                    aria-describedby={urlError ? 'url-error' : 'url-help'}
                    className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:ring-0"
                  />
                  {url && !urlError && (
                    <CheckCircle size={20} className="text-green-500 flex-shrink-0" />
                  )}
                </div>
                {urlError && (
                  <p id="url-error" className="text-xs text-red-400 mt-2 flex items-center gap-1.5">
                    <AlertCircle size={12} />
                    {urlError}
                  </p>
                )}
              </div>
              <div id="url-help" className="p-3 bg-[var(--bg-secondary)] rounded-xl flex items-start gap-3">
                <Info size={16} className="text-[var(--text-muted)] flex-shrink-0 mt-0.5" aria-hidden="true" />
                <p className="text-xs text-[var(--text-muted)]">
                  Supports YouTube, Vimeo, TikTok, and direct video URLs. We'll automatically download and process the video for you.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card className="overflow-hidden">
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-full p-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary)] hover:bg-[var(--bg-card-hover)] transition-colors"
          aria-expanded={showSettings}
          aria-controls="settings-panel"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
              <Settings2 size={18} className="text-purple-400" aria-hidden="true" />
            </div>
            <div>
              <span className="font-medium text-[var(--text-primary)] block">Clip Settings</span>
              <span className="text-xs text-[var(--text-muted)]">Configure how clips are generated</span>
            </div>
          </div>
          <div className={cn("transition-transform", showSettings && "rotate-180")}>
            <ChevronDown size={20} className="text-[var(--text-muted)]" />
          </div>
        </button>
        
        {showSettings && (
          <CardContent id="settings-panel" className="border-t border-[var(--border)] space-y-6">
            {/* Max Clips & Duration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="max-clips" className="text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <Layers size={14} />
                  Max Clips
                </label>
                <select 
                  id="max-clips"
                  value={settings.maxClips}
                  onChange={(e) => setSettings({...settings, maxClips: Number(e.target.value)})}
                  className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer appearance-none"
                >
                  <option value={5}>5 clips</option>
                  <option value={10}>10 clips</option>
                  <option value={15}>15 clips</option>
                  <option value={20}>20 clips</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-2">
                  <Clock size={14} />
                  Duration
                </label>
                <select 
                  id="duration"
                  value={settings.duration}
                  onChange={(e) => setSettings({...settings, duration: e.target.value})}
                  className="w-full p-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] cursor-pointer appearance-none"
                >
                  <option value="15-30">15-30 seconds</option>
                  <option value="30-60">30-60 seconds</option>
                  <option value="60-90">60-90 seconds</option>
                </select>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <span className="text-sm font-medium text-[var(--text-muted)] mb-3 block">Target Platforms</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Select platforms">
                {Object.entries(platformIcons).map(([platform, icon]) => (
                  <button
                    key={platform}
                    onClick={() => {
                      const platforms = settings.platforms.includes(platform)
                        ? settings.platforms.filter(p => p !== platform)
                        : [...settings.platforms, platform];
                      setSettings({...settings, platforms});
                    }}
                    aria-pressed={settings.platforms.includes(platform)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium capitalize transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                      settings.platforms.includes(platform)
                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)] border border-[var(--border)]'
                    )}
                  >
                    <span>{icon}</span>
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-[var(--bg-secondary)] rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Wand2 size={18} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-[var(--text-primary)]">Auto-generate captions</p>
                  <p className="text-sm text-[var(--text-muted)]">Add animated captions to clips</p>
                </div>
              </div>
              <ToggleSwitch
                checked={settings.autoCaptions}
                onChange={(checked) => setSettings({...settings, autoCaptions: checked})}
                label="Auto-generate captions"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Process Button */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <Button 
          variant="secondary" 
          className="sm:flex-1"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          icon={Sparkles}
          className={cn(
            "sm:flex-[2] transition-all",
            isReady && "shadow-lg shadow-indigo-500/30"
          )}
          loading={isProcessing}
          disabled={!isReady}
          onClick={handleProcess}
        >
          {isProcessing ? 'Processing...' : 'Generate Clips'}
        </Button>
      </div>

      {/* Processing Info */}
      {isReady && (
        <div className="p-4 bg-[var(--primary)]/10 border border-[var(--primary)]/20 rounded-xl flex items-start gap-3">
          <Sparkles size={18} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-[var(--text-primary)]">Ready to generate clips</p>
            <p className="text-[var(--text-muted)] mt-0.5">
              AI will analyze your video and extract up to {settings.maxClips} viral-worthy moments
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
