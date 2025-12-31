'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
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

  const ChangeIcon = changeType === 'positive' ? TrendingUp : changeType === 'negative' ? TrendingDown : Minus;

  return (
    <div 
      style={{
        backgroundColor: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: '12px',
        padding: '20px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '4px' }}>{title}</p>
          <p style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)' }}>{value}</p>
          {change && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              marginTop: '8px', 
              fontSize: '13px', 
              color: changeColors[changeType] 
            }}>
              <ChangeIcon size={14} />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div 
          style={{ 
            padding: '12px', 
            borderRadius: '10px',
            backgroundColor: `${iconColor}20`
          }}
        >
          <Icon size={22} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
