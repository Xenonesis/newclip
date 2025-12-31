'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Upload, 
  Link2, 
  Youtube, 
  Settings2, 
  Sparkles,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function UploadPage() {
  const [uploadMode, setUploadMode] = useState<'file' | 'url'>('file');
  const [url, setUrl] = useState('');
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

  const handleProcess = () => {
    setIsProcessing(true);
    // Simulate processing - in real app, this would call the API
    setTimeout(() => {
      window.location.href = '/dashboard/clips';
    }, 2000);
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
      <div className="flex gap-2 p-1 bg-[var(--bg-card)] rounded-lg w-fit">
        <button
          onClick={() => setUploadMode('file')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMode === 'file' 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Upload size={16} />
          Upload File
        </button>
        <button
          onClick={() => setUploadMode('url')}
          className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
            uploadMode === 'url' 
              ? 'bg-[var(--primary)] text-white' 
              : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
          }`}
        >
          <Link2 size={16} />
          Paste URL
        </button>
      </div>

      {/* File Upload */}
      {uploadMode === 'file' && (
        <Card>
          <CardContent className="p-8">
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                isDragActive 
                  ? 'border-[var(--primary)] bg-[var(--primary)]/5' 
                  : file 
                    ? 'border-green-500 bg-green-500/5'
                    : 'border-[var(--border)] hover:border-[var(--border-hover)]'
              }`}
            >
              <input {...getInputProps()} />
              {file ? (
                <div className="space-y-3">
                  <CheckCircle size={48} className="mx-auto text-green-500" />
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
                    <Upload size={28} className="text-[var(--primary)]" />
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
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-[var(--bg-secondary)] rounded-lg">
                <Youtube size={24} className="text-red-500 flex-shrink-0" />
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://youtube.com/watch?v=..."
                  className="flex-1 bg-transparent border-none outline-none text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
                />
              </div>
              <p className="text-xs text-[var(--text-muted)] flex items-center gap-2">
                <AlertCircle size={14} />
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
          className="w-full p-4 flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <Settings2 size={20} className="text-[var(--text-muted)]" />
            <span className="font-medium">Clip Settings</span>
          </div>
          <span className="text-[var(--text-muted)]">{showSettings ? '−' : '+'}</span>
        </button>
        
        {showSettings && (
          <CardContent className="border-t border-[var(--border)] space-y-6">
            {/* Max Clips */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="text-sm text-[var(--text-muted)] mb-2 block">Max Clips</label>
                <select 
                  value={settings.maxClips}
                  onChange={(e) => setSettings({...settings, maxClips: Number(e.target.value)})}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
                >
                  <option value={5}>5 clips</option>
                  <option value={10}>10 clips</option>
                  <option value={15}>15 clips</option>
                  <option value={20}>20 clips</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-[var(--text-muted)] mb-2 block">Duration</label>
                <select 
                  value={settings.duration}
                  onChange={(e) => setSettings({...settings, duration: e.target.value})}
                  className="w-full p-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)]"
                >
                  <option value="15-30">15-30 seconds</option>
                  <option value="30-60">30-60 seconds</option>
                  <option value="60-90">60-90 seconds</option>
                </select>
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="text-sm text-[var(--text-muted)] mb-3 block">Platforms</label>
              <div className="flex flex-wrap gap-2">
                {['tiktok', 'instagram', 'youtube', 'linkedin', 'twitter'].map((platform) => (
                  <button
                    key={platform}
                    onClick={() => {
                      const platforms = settings.platforms.includes(platform)
                        ? settings.platforms.filter(p => p !== platform)
                        : [...settings.platforms, platform];
                      setSettings({...settings, platforms});
                    }}
                    className={`px-3 py-1.5 rounded-full text-sm capitalize transition-all ${
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
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--text-primary)]">Auto-generate captions</p>
                <p className="text-sm text-[var(--text-muted)]">Add animated captions to clips</p>
              </div>
              <button
                onClick={() => setSettings({...settings, autoCaptions: !settings.autoCaptions})}
                className={`w-12 h-6 rounded-full transition-all ${settings.autoCaptions ? 'bg-[var(--primary)]' : 'bg-[var(--bg-secondary)]'}`}
              >
                <div className={`w-5 h-5 rounded-full bg-white transition-all ${settings.autoCaptions ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Process Button */}
      <div className="flex gap-4">
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
          disabled={!file && !url}
          onClick={handleProcess}
        >
          {isProcessing ? 'Processing...' : 'Generate Clips'}
        </Button>
      </div>
    </div>
  );
}
