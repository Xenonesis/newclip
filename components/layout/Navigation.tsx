'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
      style={{ 
        position: 'fixed', 
        left: 0, 
        top: 0, 
        width: '256px', 
        height: '100vh',
        backgroundColor: '#0d0d12',
        borderRight: '1px solid rgba(255,255,255,0.1)',
        zIndex: 50,
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #6366f1, #a855f7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Sparkles size={20} style={{ color: 'white' }} />
          </div>
          <span style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            background: 'linear-gradient(90deg, #6366f1, #a855f7)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent' 
          }}>
            ClipFlow
          </span>
        </Link>
      </div>

      {/* Upload Button */}
      <div style={{ padding: '16px' }}>
        <Link
          href="/dashboard/upload"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            width: '100%',
            padding: '12px 16px',
            background: 'linear-gradient(90deg, #6366f1, #a855f7, #ec4899)',
            color: 'white',
            borderRadius: '10px',
            fontWeight: 600,
            fontSize: '14px',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(99, 102, 241, 0.4)'
          }}
        >
          <Upload size={18} />
          New Video
        </Link>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 16px',
                borderRadius: '10px',
                marginBottom: '4px',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '14px',
                backgroundColor: isActive ? '#6366f1' : 'transparent',
                color: isActive ? 'white' : '#94a3b8',
                boxShadow: isActive ? '0 4px 12px rgba(99, 102, 241, 0.3)' : 'none'
              }}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '8px 12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <User size={20} style={{ color: 'white' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'white' }}>User</p>
            <p style={{ fontSize: '12px', color: '#64748b' }}>Pro Plan</p>
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
      style={{
        position: 'fixed',
        top: 0,
        left: '256px',
        right: 0,
        height: '64px',
        backgroundColor: 'rgba(13, 13, 18, 0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px'
      }}
    >
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>{getPageTitle()}</h1>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          style={{ 
            position: 'relative',
            padding: '10px', 
            color: '#94a3b8',
            background: 'none',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer'
          }}
        >
          <Bell size={20} />
          <span style={{
            position: 'absolute',
            top: '6px',
            right: '6px',
            width: '8px',
            height: '8px',
            backgroundColor: '#ef4444',
            borderRadius: '50%'
          }} />
        </button>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #22d3ee, #3b82f6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}>
          <User size={16} style={{ color: 'white' }} />
        </div>
      </div>
    </header>
  );
}
