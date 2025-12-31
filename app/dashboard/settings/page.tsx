'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PageHeader } from '@/components/ui/PageHeader';
import { ToggleSwitch } from '@/components/ui/ToggleSwitch';
import { cn } from '@/lib/utils';
import { 
  User,
  Bell,
  Palette,
  Link2,
  Key,
  CreditCard,
  Shield,
  LogOut,
  ChevronRight,
  Check,
  Plus,
  Trash2,
  ExternalLink,
  Loader2,
  Menu,
  X,
  Save,
  AlertCircle,
  Crown,
  Settings
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User, description: 'Manage your personal info' },
  { id: 'accounts', label: 'Connected Accounts', icon: Link2, description: 'Link your social platforms' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Email & push preferences' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme & display settings' },
  { id: 'api', label: 'API Keys', icon: Key, description: 'Manage API access' },
  { id: 'billing', label: 'Billing', icon: CreditCard, description: 'Plan & usage' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password & 2FA' },
];

const connectedAccounts = [
  { platform: 'Instagram', username: null, connected: false, icon: '📸', color: '#E1306C' },
  { platform: 'TikTok', username: null, connected: false, icon: '🎵', color: '#000000' },
  { platform: 'YouTube', username: null, connected: false, icon: '▶️', color: '#FF0000' },
  { platform: 'LinkedIn', username: null, connected: false, icon: '💼', color: '#0A66C2' },
  { platform: 'Twitter', username: null, connected: false, icon: '🐦', color: '#1DA1F2' },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    clipReady: true,
    weeklyReport: false,
    marketing: false,
  });
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
  });

  useEffect(() => {
    if (session?.user) {
      const [firstName = '', lastName = ''] = (session.user.name || '').split(' ');
      setProfile({
        firstName,
        lastName,
        email: session.user.email || '',
      });
    }
  }, [session]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${profile.firstName} ${profile.lastName}`.trim(),
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save profile:', err);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    signOut({ callbackUrl: '/login' });
  };

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  const currentTab = tabs.find(t => t.id === activeTab);
  const CurrentIcon = currentTab?.icon || Settings;

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Settings" 
        description="Manage your account and preferences"
      />

      {/* Mobile Tab Selector */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl transition-all hover:bg-[var(--bg-card-hover)]"
          aria-expanded={mobileMenuOpen}
          aria-controls="settings-menu"
        >
          <span className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[var(--primary)]/10 flex items-center justify-center">
              <CurrentIcon size={18} className="text-[var(--primary)]" />
            </div>
            <div className="text-left">
              <span className="font-medium block text-[var(--text-primary)]">{currentTab?.label}</span>
              <span className="text-xs text-[var(--text-muted)]">{currentTab?.description}</span>
            </div>
          </span>
          <div className={cn("transition-transform", mobileMenuOpen && "rotate-180")}>
            {mobileMenuOpen ? <X size={20} /> : <ChevronRight size={20} className="rotate-90" />}
          </div>
        </button>
        
        {mobileMenuOpen && (
          <div id="settings-menu" className="mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl overflow-hidden shadow-xl">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3.5 text-left transition-all',
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                )}
              >
                <tab.icon size={18} aria-hidden="true" />
                <span className="font-medium text-sm">{tab.label}</span>
                {activeTab === tab.id && <Check size={16} className="ml-auto" />}
              </button>
            ))}
            <div className="border-t border-[var(--border)]">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 text-left text-red-400 hover:bg-red-500/10 transition-all"
              >
                <LogOut size={18} aria-hidden="true" />
                <span className="font-medium text-sm">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block w-72 flex-shrink-0">
          <Card className="sticky top-6">
            <CardContent className="p-2">
              <nav aria-label="Settings navigation" className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] group',
                      activeTab === tab.id
                        ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/30'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                    )}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-lg flex items-center justify-center transition-colors",
                      activeTab === tab.id 
                        ? "bg-white/20" 
                        : "bg-[var(--bg-secondary)] group-hover:bg-[var(--bg-card)]"
                    )}>
                      <tab.icon size={18} aria-hidden="true" />
                    </div>
                    <span className="font-medium text-sm">{tab.label}</span>
                    {activeTab === tab.id && <Check size={16} className="ml-auto" />}
                  </button>
                ))}
              </nav>
              
              <div className="border-t border-[var(--border)] mt-3 pt-3">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-500 group"
                >
                  <div className="w-9 h-9 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-colors">
                    <LogOut size={18} aria-hidden="true" />
                  </div>
                  <span className="font-medium text-sm">Log Out</span>
                </button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <User size={18} className="text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Profile Settings</h2>
                  <p className="text-xs text-[var(--text-muted)]">Update your personal information</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 bg-[var(--bg-secondary)] rounded-xl">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-cyan-500/20">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full rounded-2xl object-cover" />
                    ) : (
                      <User size={32} className="text-white" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-[var(--text-primary)]">{profile.firstName} {profile.lastName}</h3>
                    <p className="text-sm text-[var(--text-muted)]">{profile.email}</p>
                    <Button variant="secondary" size="sm" className="mt-3">Change Avatar</Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm font-medium text-[var(--text-muted)] mb-2 block">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm font-medium text-[var(--text-muted)] mb-2 block">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-sm font-medium text-[var(--text-muted)] mb-2 block">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-3 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text-muted)] cursor-not-allowed opacity-60"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-2 flex items-center gap-1.5">
                    <AlertCircle size={12} />
                    Email cannot be changed
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[var(--border)]">
                  {saved && (
                    <span className="text-sm text-green-400 flex items-center gap-2">
                      <Check size={16} />
                      Changes saved successfully
                    </span>
                  )}
                  <div className="ml-auto">
                    <Button onClick={handleSaveProfile} disabled={saving} icon={saving ? Loader2 : Save}>
                      {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connected Accounts Tab */}
          {activeTab === 'accounts' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/15 flex items-center justify-center">
                  <Link2 size={18} className="text-cyan-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Connected Accounts</h2>
                  <p className="text-xs text-[var(--text-muted)]">Link your social media platforms</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.platform}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-card-hover)] transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                        style={{ backgroundColor: `${account.color}15` }}
                      >
                        {account.icon}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{account.platform}</p>
                        {account.username ? (
                          <p className="text-sm text-[var(--text-muted)]">@{account.username}</p>
                        ) : (
                          <p className="text-sm text-[var(--text-muted)]">Not connected</p>
                        )}
                      </div>
                    </div>
                    {account.connected ? (
                      <div className="flex items-center gap-3">
                        <Badge variant="success" size="sm">
                          <Check size={12} className="mr-1" />
                          Connected
                        </Badge>
                        <Button variant="danger" size="sm" icon={Trash2}>
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button variant="secondary" size="sm" icon={Plus}>
                        Connect
                      </Button>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                  <Bell size={18} className="text-yellow-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Notification Preferences</h2>
                  <p className="text-xs text-[var(--text-muted)]">Control how you receive updates</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email', icon: '✉️' },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser', icon: '🔔' },
                  { key: 'clipReady', label: 'Clip Ready', desc: 'Get notified when clips are generated', icon: '✂️' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly analytics summary', icon: '📊' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'Receive product updates and offers', icon: '📢' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{item.label}</p>
                        <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                      </div>
                    </div>
                    <ToggleSwitch
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(checked) => setNotifications({
                        ...notifications,
                        [item.key]: checked
                      })}
                      label={item.label}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* API Keys Tab */}
          {activeTab === 'api' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/15 flex items-center justify-center">
                    <Key size={18} className="text-purple-400" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-[var(--text-primary)]">API Keys</h2>
                    <p className="text-xs text-[var(--text-muted)]">Manage your API access</p>
                  </div>
                </div>
                <Button size="sm" icon={Plus}>Create Key</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-[var(--bg-secondary)] border border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">Active</Badge>
                      <p className="font-medium text-[var(--text-primary)]">Production Key</p>
                    </div>
                    <span className="text-xs text-[var(--text-muted)]">Created Dec 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-4 py-2.5 bg-[var(--bg-card)] rounded-lg text-sm font-mono text-[var(--text-muted)] border border-[var(--border)]">
                      sk_live_••••••••••••••••••••••••
                    </code>
                    <Button variant="secondary" size="sm">Copy</Button>
                    <Button variant="danger" size="sm" icon={Trash2} />
                  </div>
                </div>

                <a 
                  href="#" 
                  className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline font-medium"
                >
                  View API Documentation
                  <ExternalLink size={14} />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/15 flex items-center justify-center">
                  <CreditCard size={18} className="text-green-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Billing & Subscription</h2>
                  <p className="text-xs text-[var(--text-muted)]">Manage your plan and usage</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-5 rounded-xl bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-[var(--primary)]/30">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown size={18} className="text-yellow-400" />
                        <p className="text-sm text-[var(--text-muted)]">Current Plan</p>
                      </div>
                      <p className="text-2xl font-bold gradient-text">Pro Plan</p>
                      <p className="text-sm text-[var(--text-muted)] mt-1">$29/month • Renews Jan 15, 2025</p>
                    </div>
                    <Button variant="secondary">Manage Plan</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-4 text-[var(--text-primary)]">Usage This Month</h4>
                  <div className="space-y-4">
                    {[
                      { label: 'Video Uploads', current: 24, max: 50, color: 'bg-indigo-500' },
                      { label: 'Clips Generated', current: 156, max: 500, color: 'bg-cyan-500' },
                      { label: 'Storage Used', current: 12.5, max: 100, unit: 'GB', color: 'bg-green-500' },
                    ].map((item) => (
                      <div key={item.label}>
                        <div className="flex items-center justify-between text-sm mb-2">
                          <span className="text-[var(--text-muted)]">{item.label}</span>
                          <span className="font-medium text-[var(--text-primary)]">
                            {item.current}{item.unit || ''} / {item.max}{item.unit || ''}
                          </span>
                        </div>
                        <div className="h-2.5 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full rounded-full transition-all", item.color)} 
                            style={{ width: `${(item.current / item.max) * 100}%` }} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                  <Shield size={18} className="text-red-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Security Settings</h2>
                  <p className="text-xs text-[var(--text-muted)]">Protect your account</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: 'Password', desc: 'Last changed 30 days ago', action: 'Change Password', icon: Key },
                  { title: 'Two-Factor Authentication', desc: 'Add an extra layer of security', action: 'Enable 2FA', actionIcon: Shield, icon: Shield },
                  { title: 'Active Sessions', desc: '2 devices currently logged in', action: 'Manage Sessions', icon: User },
                ].map((item) => (
                  <div 
                    key={item.title}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-[var(--bg-secondary)]"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--bg-card)] flex items-center justify-center">
                        <item.icon size={18} className="text-[var(--text-muted)]" />
                      </div>
                      <div>
                        <p className="font-medium text-[var(--text-primary)]">{item.title}</p>
                        <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
                      </div>
                    </div>
                    <Button variant="secondary" size="sm" icon={item.actionIcon}>{item.action}</Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card className="overflow-hidden">
              <CardHeader className="bg-[var(--bg-secondary)]/50 flex flex-row items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-pink-500/15 flex items-center justify-center">
                  <Palette size={18} className="text-pink-400" />
                </div>
                <div>
                  <h2 className="font-semibold text-[var(--text-primary)]">Appearance</h2>
                  <p className="text-xs text-[var(--text-muted)]">Customize your experience</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm font-medium text-[var(--text-muted)] mb-4 block">Theme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Theme selection">
                    {[
                      { id: 'dark', label: 'Dark', icon: '🌙' },
                      { id: 'light', label: 'Light', icon: '☀️' },
                      { id: 'system', label: 'System', icon: '💻' },
                    ].map((themeOption) => (
                      <button
                        key={themeOption.id}
                        onClick={() => handleThemeChange(themeOption.id)}
                        role="radio"
                        aria-checked={theme === themeOption.id}
                        className={cn(
                          'p-4 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)] group',
                          theme === themeOption.id
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10 shadow-lg shadow-indigo-500/20'
                            : 'border-[var(--border)] hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]'
                        )}
                      >
                        <div className={cn(
                          'w-full h-20 rounded-lg mb-3 overflow-hidden relative',
                          themeOption.id === 'dark' ? 'bg-[#0a0a0f]' :
                          themeOption.id === 'light' ? 'bg-white border border-gray-200' :
                          'bg-gradient-to-r from-[#0a0a0f] to-white'
                        )}>
                          <div className="absolute inset-0 flex items-center justify-center text-3xl opacity-50">
                            {themeOption.icon}
                          </div>
                        </div>
                        <span className="text-sm font-medium flex items-center justify-center gap-2 capitalize text-[var(--text-primary)]">
                          {theme === themeOption.id && <Check size={16} className="text-[var(--primary)]" aria-hidden="true" />}
                          {themeOption.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
