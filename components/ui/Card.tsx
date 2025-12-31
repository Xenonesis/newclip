'use client';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
  onClick?: () => void;
}

export function Card({ children, hover, glow, onClick }: CardProps) {
  return (
    <div
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        cursor: onClick || hover ? 'pointer' : 'default',
        transition: 'all 0.3s ease',
        boxShadow: glow ? '0 4px 20px rgba(99, 102, 241, 0.1)' : 'none'
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div 
      style={{ 
        padding: '16px', 
        borderBottom: '1px solid var(--border)',
        display: className?.includes('flex') ? 'flex' : 'block',
        alignItems: className?.includes('items-center') ? 'center' : 'stretch',
        justifyContent: className?.includes('justify-between') ? 'space-between' : 'flex-start',
        flexDirection: className?.includes('flex-row') ? 'row' : 'column'
      }}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  const hasSpaceY = className?.includes('space-y-');
  return (
    <div 
      style={{ 
        padding: className?.includes('py-8') ? '32px 16px' : '16px',
        display: hasSpaceY ? 'flex' : 'block',
        flexDirection: hasSpaceY ? 'column' : 'row',
        gap: hasSpaceY ? '16px' : '0'
      }}
    >
      {children}
    </div>
  );
}
