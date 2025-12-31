'use client';

import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  iconColor = 'indigo',
  className,
}: StatCardProps) {
  const iconColorClasses: Record<string, { bg: string; text: string }> = {
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400' },
  };

  const changeConfig = {
    positive: { color: 'text-green-400', icon: TrendingUp },
    negative: { color: 'text-red-400', icon: TrendingDown },
    neutral: { color: 'text-slate-500', icon: Minus },
  };

  const colors = iconColorClasses[iconColor] || iconColorClasses.indigo;
  const changeInfo = changeConfig[changeType];
  const ChangeIcon = changeInfo.icon;

  return (
    <div 
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-5',
        'transition-all duration-300 hover:border-[var(--border-hover)] hover:bg-[var(--bg-card-hover)]',
        'group',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-[var(--text-muted)] mb-1 truncate">{title}</p>
          <p className="text-2xl font-bold text-[var(--text-primary)] tracking-tight">{value}</p>
          {change && (
            <div className={cn('flex items-center gap-1 mt-2 text-sm', changeInfo.color)}>
              <ChangeIcon size={14} aria-hidden="true" />
              <span>{change}</span>
            </div>
          )}
        </div>
        <div 
          className={cn(
            'p-3 rounded-lg transition-transform duration-300 group-hover:scale-110',
            colors.bg
          )}
        >
          <Icon size={22} className={colors.text} aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
