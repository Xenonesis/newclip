'use client';

import { Button } from './Button';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
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
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div 
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)' }}
      >
        <Icon size={40} style={{ color: 'var(--primary)' }} />
      </div>
      <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h3>
      <p 
        className="max-w-sm mb-6"
        style={{ color: 'var(--text-muted)' }}
      >
        {description}
      </p>
      {ActionButton}
    </div>
  );
}
