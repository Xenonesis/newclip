'use client';

import { Button } from './Button';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
  className,
}: EmptyStateProps) {
  const ActionButton = actionLabel ? (
    actionHref ? (
      <a href={actionHref}>
        <Button>{actionLabel}</Button>
      </a>
    ) : (
      <Button onClick={onAction}>{actionLabel}</Button>
    )
  ) : null;

  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-8 text-center', className)}>
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6 bg-indigo-500/10 border border-indigo-500/20">
        <Icon size={40} className="text-indigo-400" aria-hidden="true" />
      </div>
      <h3 className="text-xl font-semibold mb-2 text-[var(--text-primary)]">
        {title}
      </h3>
      <p className="max-w-sm mb-6 text-sm text-[var(--text-muted)]">
        {description}
      </p>
      {ActionButton}
    </div>
  );
}
