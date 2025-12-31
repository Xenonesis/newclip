'use client';

import { cn } from '@/lib/utils';
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
  iconColor = 'var(--primary)',
  className
}: StatCardProps) {
  const changeColors = {
    positive: 'text-green-400',
    negative: 'text-red-400',
    neutral: 'text-[var(--text-muted)]'
  };

  return (
    <div className={cn(
      'bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5 hover:border-[var(--border-hover)] transition-all duration-300',
      className
    )}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--text-muted)] mb-1">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)]">{value}</p>
          {change && (
            <p className={cn('text-sm mt-1', changeColors[changeType])}>
              {change}
            </p>
          )}
        </div>
        <div 
          className="p-3 rounded-lg"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon size={22} style={{ color: iconColor }} />
        </div>
      </div>
    </div>
  );
}
