'use client';

import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'left',
  loading,
  children,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          background: 'linear-gradient(to right, #6366f1, #a855f7, #ec4899)',
          color: '#ffffff',
          border: 'none',
          boxShadow: '0 4px 14px rgba(99, 102, 241, 0.35)'
        };
      case 'secondary':
        return {
          background: 'var(--bg-card)',
          color: 'var(--text-primary)',
          border: '1px solid var(--border)'
        };
      case 'ghost':
        return {
          background: 'transparent',
          color: 'var(--text-secondary)',
          border: 'none'
        };
      case 'danger':
        return {
          background: 'rgba(239, 68, 68, 0.1)',
          color: '#f87171',
          border: '1px solid rgba(239, 68, 68, 0.3)'
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { padding: '6px 12px', fontSize: '13px', gap: '6px' };
      case 'md':
        return { padding: '8px 16px', fontSize: '14px', gap: '8px' };
      case 'lg':
        return { padding: '12px 24px', fontSize: '16px', gap: '8px' };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 500,
        borderRadius: '8px',
        transition: 'all 0.2s ease',
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.5 : 1,
        ...variantStyles,
        ...sizeStyles
      }}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg 
          style={{ animation: 'spin 1s linear infinite', height: '16px', width: '16px' }} 
          viewBox="0 0 24 24"
        >
          <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? (
        <Icon size={size === 'sm' ? 14 : 16} />
      ) : null}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon size={size === 'sm' ? 14 : 16} />}
    </button>
  );
}
