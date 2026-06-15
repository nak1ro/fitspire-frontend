import { HTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

interface IconChipProps extends HTMLAttributes<HTMLDivElement> {
    icon: LucideIcon;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'neutral';
    /** Explicit overrides — for per-category colors (feature/workout-type maps)
     *  that bypass the semantic variant entirely. */
    color?: string;
    bg?: string;
}

const sizes = {
    sm: { box: 'w-8 h-8 rounded-lg', icon: 'h-4 w-4' },
    md: { box: 'w-10 h-10 rounded-xl', icon: 'h-5 w-5' },
    lg: { box: 'w-14 h-14 rounded-xl', icon: 'h-6 w-6' },
};

const variants = {
    primary: 'bg-primary-50 text-primary-500',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error:   'bg-error/10 text-error',
    neutral: 'bg-surface-100 text-surface-500',
};

export function IconChip({ icon: Icon, size = 'md', variant = 'primary', color, bg, className, style, ...props }: IconChipProps) {
    const { box, icon } = sizes[size];
    const useOverride = Boolean(color || bg);

    return (
        <div
            className={cn(
                'inline-flex items-center justify-center shrink-0 shadow-chip',
                box,
                !useOverride && variants[variant],
                className
            )}
            style={useOverride ? { backgroundColor: bg, ...style } : style}
            {...props}
        >
            <Icon className={icon} style={useOverride ? { color } : undefined} aria-hidden="true" />
        </div>
    );
}
