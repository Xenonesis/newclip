'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
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
  X
} from 'lucide-react';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'accounts', label: 'Connected Accounts', icon: Link2 },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'api', label: 'API Keys', icon: Key },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'security', label: 'Security', icon: Shield },
];

const connectedAccounts = [
  { platform: 'Instagram', username: null, connected: false, icon: '📸' },
  { platform: 'TikTok', username: null, connected: false, icon: '🎵' },
  { platform: 'YouTube', username: null, connected: false, icon: '▶️' },
  { platform: 'LinkedIn', username: null, connected: false, icon: '💼' },
  { platform: 'Twitter', username: null, connected: false, icon: '🐦' },
];

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [saving, setSaving] = useState(false);
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
    // In a real app, persist to localStorage and apply to document
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', newTheme);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">Settings</h1>
        <p className="text-[var(--text-secondary)] mt-1">
          Manage your account and preferences
        </p>
      </div>

      {/* Mobile Tab Selector */}
      <div className="lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-full flex items-center justify-between p-4 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg"
          aria-expanded={mobileMenuOpen}
          aria-controls="settings-menu"
        >
          <span className="flex items-center gap-3">
            {(() => {
              const CurrentIcon = tabs.find(t => t.id === activeTab)?.icon || User;
              return <CurrentIcon size={18} />;
            })()}
            <span className="font-medium">{tabs.find(t => t.id === activeTab)?.label}</span>
          </span>
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        
        {mobileMenuOpen && (
          <div id="settings-menu" className="mt-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setMobileMenuOpen(false);
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-3 text-left transition-all',
                  activeTab === tab.id
                    ? 'bg-[var(--primary)] text-white'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)]'
                )}
              >
                <tab.icon size={18} aria-hidden="true" />
                <span className="font-medium text-sm">{tab.label}</span>
              </button>
            ))}
            <div className="border-t border-[var(--border)]">
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-all"
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
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-2">
              <nav aria-label="Settings navigation">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    aria-current={activeTab === tab.id ? 'page' : undefined}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                      activeTab === tab.id
                        ? 'bg-[var(--primary)] text-white'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]'
                    )}
                  >
                    <tab.icon size={18} aria-hidden="true" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </nav>
              
              <div className="border-t border-[var(--border)] mt-2 pt-2">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-400 hover:bg-red-500/10 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <LogOut size={18} aria-hidden="true" />
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
            <Card>
              <CardHeader>
                <h2 className="font-semibold">Profile Settings</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center flex-shrink-0">
                    {session?.user?.image ? (
                      <img src={session.user.image} alt="" className="w-full h-full rounded-full object-cover" />
                    ) : (
                      <User size={32} className="text-white" aria-hidden="true" />
                    )}
                  </div>
                  <div>
                    <Button variant="secondary" size="sm">Change Avatar</Button>
                    <p className="text-xs text-[var(--text-muted)] mt-2">JPG, PNG. Max 2MB</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="firstName" className="text-sm text-[var(--text-muted)] mb-2 block">First Name</label>
                    <input
                      id="firstName"
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="text-sm text-[var(--text-muted)] mb-2 block">Last Name</label>
                    <input
                      id="lastName"
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="text-sm text-[var(--text-muted)] mb-2 block">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg text-[var(--text-muted)] cursor-not-allowed"
                  />
                  <p className="text-xs text-[var(--text-muted)] mt-1">Email cannot be changed</p>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSaveProfile} disabled={saving}>
                    {saving && <Loader2 size={16} className="animate-spin mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Connected Accounts Tab */}
          {activeTab === 'accounts' && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Connected Accounts</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {connectedAccounts.map((account) => (
                  <div
                    key={account.platform}
                    className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)]"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl">{account.icon}</span>
                      <div>
                        <p className="font-medium">{account.platform}</p>
                        {account.username && (
                          <p className="text-sm text-[var(--text-muted)]">{account.username}</p>
                        )}
                      </div>
                    </div>
                    {account.connected ? (
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-sm text-green-400">
                          <Check size={14} />
                          Connected
                        </span>
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
            <Card>
              <CardHeader>
                <h2 className="font-semibold">Notification Preferences</h2>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { key: 'email', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'push', label: 'Push Notifications', desc: 'Receive push notifications in browser' },
                  { key: 'clipReady', label: 'Clip Ready', desc: 'Get notified when clips are generated' },
                  { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive weekly analytics summary' },
                  { key: 'marketing', label: 'Marketing Emails', desc: 'Receive product updates and offers' },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-[var(--bg-secondary)]"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-[var(--text-muted)]">{item.desc}</p>
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
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h3 className="font-semibold">API Keys</h3>
                <Button size="sm" icon={Plus}>Create Key</Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-[var(--bg-secondary)]">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">Production Key</p>
                    <span className="text-xs text-[var(--text-muted)]">Created Dec 15, 2024</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="flex-1 px-3 py-2 bg-[var(--bg-card)] rounded text-sm font-mono">
                      sk_live_••••••••••••••••••••••••
                    </code>
                    <Button variant="secondary" size="sm">Copy</Button>
                    <Button variant="danger" size="sm" icon={Trash2} />
                  </div>
                </div>

                <a 
                  href="#" 
                  className="flex items-center gap-2 text-sm text-[var(--primary)] hover:underline"
                >
                  View API Documentation
                  <ExternalLink size={14} />
                </a>
              </CardContent>
            </Card>
          )}

          {/* Billing Tab */}
          {activeTab === 'billing' && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Billing & Subscription</h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 rounded-lg bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-[var(--primary)]/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-[var(--text-muted)]">Current Plan</p>
                      <p className="text-2xl font-bold gradient-text">Pro Plan</p>
                      <p className="text-sm text-[var(--text-muted)] mt-1">$29/month • Renews Jan 15, 2025</p>
                    </div>
                    <Button variant="secondary">Manage Plan</Button>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Usage This Month</h4>
                  <div className="space-y-3">
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[var(--text-muted)]">Video Uploads</span>
                        <span>24 / 50</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--primary)] rounded-full" style={{ width: '48%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[var(--text-muted)]">Clips Generated</span>
                        <span>156 / 500</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div className="h-full bg-[var(--accent)] rounded-full" style={{ width: '31.2%' }} />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[var(--text-muted)]">Storage Used</span>
                        <span>12.5 GB / 100 GB</span>
                      </div>
                      <div className="h-2 bg-[var(--bg-secondary)] rounded-full overflow-hidden">
                        <div className="h-full bg-green-500 rounded-full" style={{ width: '12.5%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <Card>
              <CardHeader>
                <h3 className="font-semibold">Security Settings</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-[var(--text-muted)]">Last changed 30 days ago</p>
                  </div>
                  <Button variant="secondary" size="sm">Change Password</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-[var(--text-muted)]">Add an extra layer of security</p>
                  </div>
                  <Button variant="secondary" size="sm" icon={Shield}>Enable 2FA</Button>
                </div>
                
                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)]">
                  <div>
                    <p className="font-medium">Active Sessions</p>
                    <p className="text-sm text-[var(--text-muted)]">2 devices currently logged in</p>
                  </div>
                  <Button variant="secondary" size="sm">Manage Sessions</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <Card>
              <CardHeader>
                <h2 className="font-semibold">Appearance</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="text-sm text-[var(--text-muted)] mb-3 block">Theme</label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" role="radiogroup" aria-label="Theme selection">
                    {['dark', 'light', 'system'].map((themeOption) => (
                      <button
                        key={themeOption}
                        onClick={() => handleThemeChange(themeOption)}
                        role="radio"
                        aria-checked={theme === themeOption}
                        className={cn(
                          'p-4 rounded-lg border-2 transition-all capitalize focus:outline-none focus:ring-2 focus:ring-[var(--primary)]',
                          theme === themeOption
                            ? 'border-[var(--primary)] bg-[var(--primary)]/10'
                            : 'border-[var(--border)] hover:border-[var(--border-hover)]'
                        )}
                      >
                        <div className={cn(
                          'w-full h-16 rounded mb-2',
                          themeOption === 'dark' ? 'bg-[#0a0a0f]' :
                          themeOption === 'light' ? 'bg-white border border-gray-200' :
                          'bg-gradient-to-r from-[#0a0a0f] to-white'
                        )} />
                        <span className="text-sm font-medium flex items-center justify-center gap-2">
                          {theme === themeOption && <Check size={14} aria-hidden="true" />}
                          {themeOption}
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
