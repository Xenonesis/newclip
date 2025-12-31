'use client';

import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = '#6366f1',
}: StatCardProps) {
  const changeColors = {
    positive: '#4ade80',
    negative: '#f87171',
    neutral: '#64748b'
  };

  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px',
        transition: 'all 0.3s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>{title}</p>
          <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--text-primary)' }}>{value}</p>
          {change && (
            <p style={{ fontSize: '14px', marginTop: '4px', color: changeColors[changeType] }}>
              {change}
            </p>
          )}
        </div>
        <div 
          style={{ 
            padding: '12px', 
            borderRadius: '8px',
            backgroundColor: `${iconColor}20`
          }}
        >
          <Icon size={22} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
