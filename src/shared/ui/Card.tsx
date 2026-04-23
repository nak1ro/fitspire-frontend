import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'flat' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

const shadows = {
    flat:     undefined,
    elevated: '0 4px 12px rgba(28,21,16,0.08)',
    outlined: undefined,
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'elevated', padding = 'md', style, ...props }, ref) => {

        const variants = {
            flat:     'bg-surface',
            elevated: 'bg-surface',
            outlined: 'bg-background border border-surface-200',
        };

        const paddings = {
            none: '',
            sm:   'p-4',
            md:   'p-5',
            lg:   'p-6',
        };

        return (
            <div
                ref={ref}
                className={cn('rounded-2xl', variants[variant], paddings[padding], className)}
                style={shadows[variant] ? { boxShadow: shadows[variant], ...style } : style}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
