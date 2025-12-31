'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Video, 
  Scissors, 
  Calendar, 
  BarChart3, 
  Settings,
  Upload,
  Bell,
  User,
  Sparkles
} from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/videos', label: 'Videos', icon: Video },
  { href: '/dashboard/clips', label: 'Clips', icon: Scissors },
  { href: '/dashboard/schedule', label: 'Schedule', icon: Calendar },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside 
      className="dashboard-sidebar flex flex-col"
      style={{ 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        width: '256px', 
        height: '100vh',
        backgroundColor: 'var(--bg-secondary)',
        borderRight: '1px solid var(--border)',
        zIndex: 50 
      }}
    >
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={20} className="text-white" />
          </div>
          <span className="text-xl font-bold gradient-text">ClipFlow</span>
        </Link>
      </div>

      {/* Upload Button */}
      <div className="p-4">
        <Link
          href="/dashboard/upload"
          className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
        >
          <Upload size={18} />
          New Video
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200',
                isActive 
                  ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
              )}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[var(--border)]">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
            <User size={18} className="text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-[var(--text-primary)] truncate">Aditya</p>
            <p className="text-xs text-[var(--text-muted)]">Pro Plan</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export function TopBar() {
  const pathname = usePathname();
  
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname === '/dashboard/videos') return 'Videos';
    if (pathname === '/dashboard/clips') return 'Clips';
    if (pathname === '/dashboard/upload') return 'Upload Video';
    if (pathname === '/dashboard/schedule') return 'Content Calendar';
    if (pathname === '/dashboard/analytics') return 'Analytics';
    if (pathname === '/dashboard/settings') return 'Settings';
    return 'Dashboard';
  };
  
  return (
    <header 
      className="dashboard-topbar flex items-center justify-between px-6"
      style={{
        position: 'fixed',
        top: 0,
        left: '256px',
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(17, 17, 24, 0.9)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)]">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center cursor-pointer">
          <User size={16} className="text-white" />
        </div>
      </div>
    </header>
  );
}
