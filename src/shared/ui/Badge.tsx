import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'outline';
    size?: 'sm' | 'md';
}

const variants = {
    default: 'bg-surface-100 text-surface-700',
    primary: 'bg-primary-100 text-primary-700',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error:   'bg-error/10 text-error',
    outline: 'bg-transparent border border-surface-200 text-surface-600',
};

const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
};

export function Badge({ className, variant = 'default', size = 'md', ...props }: BadgeProps) {
    return (
        <span
            className={cn(
                'inline-flex items-center rounded-full font-medium',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
}
