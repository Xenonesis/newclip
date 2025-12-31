'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  Sparkles,
  Menu,
  X,
  LogOut,
  ChevronDown
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
  const { data: session } = useSession();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image;

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg"
        aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={isMobileOpen}
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside 
        className={cn(
          'fixed left-0 top-0 h-screen bg-[var(--bg-secondary)] border-r border-[var(--border)] z-50 flex flex-col transition-transform duration-300',
          'w-64 lg:translate-x-0',
          isMobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="p-6 border-b border-[var(--border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" aria-hidden="true" />
            </div>
            <span className="text-xl font-bold gradient-text">ClipFlow</span>
          </Link>
        </div>

        {/* Upload Button */}
        <div className="p-4">
          <Link
            href="/dashboard/upload"
            onClick={() => setIsMobileOpen(false)}
            className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-secondary)]"
          >
            <Upload size={18} aria-hidden="true" />
            New Video
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2 overflow-y-auto" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200',
                  'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]',
                  isActive 
                    ? 'bg-[var(--primary)] text-white shadow-lg shadow-indigo-500/20' 
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
                )}
                aria-current={isActive ? 'page' : undefined}
              >
                <item.icon size={20} aria-hidden="true" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4 border-t border-[var(--border)]">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden">
              {userImage ? (
                <img src={userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={18} className="text-white" aria-hidden="true" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{userName}</p>
              <p className="text-xs text-[var(--text-muted)]">Pro Plan</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="flex items-center gap-2 w-full mt-2 px-3 py-2 text-sm text-[var(--text-muted)] hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
          >
            <LogOut size={16} aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export function TopBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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

  const userName = session?.user?.name || 'User';
  const userImage = session?.user?.image;
  
  return (
    <header 
      className="fixed top-0 right-0 h-16 bg-[var(--bg-secondary)]/90 backdrop-blur-xl border-b border-[var(--border)] z-40 flex items-center justify-between px-4 sm:px-6 left-0 lg:left-64"
      role="banner"
    >
      <div className="ml-12 lg:ml-0">
        <h1 className="text-lg font-semibold text-[var(--text-primary)]">{getPageTitle()}</h1>
      </div>
      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          className="relative p-2.5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors rounded-lg hover:bg-[var(--bg-card)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] group"
          aria-label="Notifications"
        >
          <Bell size={20} className="group-hover:scale-110 transition-transform" aria-hidden="true" />
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-[var(--bg-secondary)]" aria-hidden="true" />
          <span className="sr-only">3 unread notifications</span>
        </button>
        
        {/* User Menu */}
        <div className="relative">
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-[var(--bg-card)] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            aria-expanded={showUserMenu}
            aria-haspopup="true"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center overflow-hidden ring-2 ring-transparent hover:ring-[var(--border)]">
              {userImage ? (
                <img src={userImage} alt="" className="w-full h-full object-cover" />
              ) : (
                <User size={16} className="text-white" aria-hidden="true" />
              )}
            </div>
            <ChevronDown size={14} className={cn("text-[var(--text-muted)] transition-transform", showUserMenu && "rotate-180")} aria-hidden="true" />
          </button>

          {showUserMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowUserMenu(false)}
                aria-hidden="true"
              />
              <div className="absolute right-0 top-full mt-2 w-56 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-[var(--border)]">
                  <p className="text-sm font-medium truncate text-[var(--text-primary)]">{userName}</p>
                  <p className="text-xs text-[var(--text-muted)] truncate">{session?.user?.email}</p>
                </div>
                <div className="py-1">
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)] transition-colors"
                  >
                    <Settings size={16} aria-hidden="true" />
                    Settings
                  </Link>
                </div>
                <div className="border-t border-[var(--border)] pt-1">
                  <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut size={16} aria-hidden="true" />
                    Sign Out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
