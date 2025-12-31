'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { 
  Upload, 
  Link2, 
  Youtube, 
  Settings2, 
  Sparkles,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function UploadPage() {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
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

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Upload Video</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Upload a video or paste a URL to generate viral clips
        </p>
      </div>

      {/* Upload Mode Toggle */}
      <div className="flex gap-2 p-1 bg-[var(--bg-card)] rounded-lg w-fit" role="tablist" aria-label="Upload method">
        <button
          role="tab"
          aria-selected={uploadMode === 'file'}
          aria-controls="file-panel"
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
            uploadMode === 'file' 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Upload size={16} aria-hidden="true" />
          Upload File
        </button>
        <button
          role="tab"
          aria-selected={uploadMode === 'url'}
          aria-controls="url-panel"
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
            uploadMode === 'url' 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Link2 size={16} aria-hidden="true" />
          Paste URL
        </button>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <Card>
          <CardContent id="file-panel" role="tabpanel" aria-labelledby="file-tab" className="p-4 sm:p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-12 text-center cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                isDragActive 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                  : file 
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <input {...getInputProps()} aria-label="Video file input" />
              {file ? (
                <div className="space-y-3">
                  <CheckCircle size={48} className="mx-auto text-green-500" aria-hidden="true" />
                  <p className="text-lg font-medium text-[var(--text-primary)]">{file.name}</p>
                  <p className="text-sm text-[var(--text-muted)]">
                    {(file.size / (1024 * 1024)).toFixed(1)} MB
                  </p>
                  <Button variant="secondary" size="sm" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                    Remove
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <Upload size={28} className="text-[var(--primary)]" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-[var(--text-primary)]">
                      Drop your video here
                    </p>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                      or click to browse
                    </p>
                  </div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Supports: MP4, MOV, AVI, MKV, WebM • Max 4 hours
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* URL Input */}
      {uploadMode === 'url' && (
        <Card>
          <CardContent id="url-panel" role="tabpanel" aria-labelledby="url-tab" className="p-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="video-url" className="sr-only">Video URL</label>
                <div className={`flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg border ${urlError ? 'border-red-500' : 'border-transparent'}`}>
                  <Youtube size={24} className="text-red-500 flex-shrink-0" aria-hidden="true" />
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
                </div>
                {urlError && (
                  <p id="url-error" className="text-xs text-red-400 mt-2">{urlError}</p>
                )}
              </div>
              <p id="url-help" className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                <AlertCircle size={14} aria-hidden="true" />
                Supports YouTube, Vimeo, and direct video URLs
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Settings */}
      <Card>
        <button 
          onClick={() => setShowSettings(!showSettings)}
          className="w-full p-4 flex items-center justify-between text-left focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--primary)]"
          aria-expanded={showSettings}
          aria-controls="settings-panel"
        >
          <div className="flex items-center gap-3">
            <Settings2 size={20} className="text-[var(--text-muted)]" aria-hidden="true" />
            <span className="font-medium">Clip Settings</span>
          </div>
          {showSettings ? <ChevronUp size={20} className="text-[var(--text-muted)]" /> : <ChevronDown size={20} className="text-[var(--text-muted)]" />}
        </button>
        
        {showSettings && (
          <CardContent id="settings-panel" className="border-t border-[var(--border)] space-y-6">
            {/* Max Clips */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="max-clips" className="text-sm text-[var(--text-muted)] mb-2 block">Max Clips</label>
                <select 
                  id="max-clips"
                  value={settings.maxClips}
                  onChange={(e) => setSettings({...settings, maxClips: Number(e.target.value)})}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value={5}>5 clips</option>
                  <option value={10}>10 clips</option>
                  <option value={15}>15 clips</option>
                  <option value={20}>20 clips</option>
                </select>
              </div>
              <div>
                <label htmlFor="duration" className="text-sm text-[var(--text-muted)] mb-2 block">Duration</label>
                <select 
                  id="duration"
                  value={settings.duration}
                  onChange={(e) => setSettings({...settings, duration: e.target.value})}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
                >
                  <option value="15-30">15-30 seconds</option>
                  <option value="30-60">30-60 seconds</option>
                  <option value="60-90">60-90 seconds</option>
                </select>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <span className="text-sm text-[var(--text-muted)] mb-3 block">Platforms</span>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Select platforms">
                {['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      const platforms = settings.platforms.includes(platform)
                        ? settings.platforms.filter(p => p !== platform)
                        : [...settings.platforms, platform];
                      setSettings({...settings, platforms});
                    }}
                    aria-pressed={settings.platforms.includes(platform)}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] ${
                      settings.platforms.includes(platform)
                        ? 'bg-[var(--primary)] text-white'
                        : 'bg-[var(--bg-secondary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>
            </div>

            {/* Caption Style */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Auto-generate captions</p>
                <p className="text-sm text-[var(--text-muted)]">Add animated captions to clips</p>
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
      <div className="flex flex-col sm:flex-row gap-4">
        <Button 
          variant="secondary" 
          className="flex-1"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
        <Button 
          icon={Sparkles}
          className="flex-1"
          loading={isProcessing}
          disabled={(!file && !url) || !!urlError}
          onClick={handleProcess}
        >
          {isProcessing ? 'Processing...' : 'Generate Clips'}
        </Button>
      </div>
    </div>
  );
}
