import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'flat' | 'elevated' | 'outlined';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    /** Opt-in floating-card hover motion (lift + shadow deepen) — not automatic
     *  on every elevated card, since Card is also used for static content. */
    interactive?: boolean;
}

const shadows = {
    flat:     undefined,
    elevated: 'var(--shadow-card)',
    outlined: undefined,
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'elevated', padding = 'md', interactive = false, style, ...props }, ref) => {

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
                className={cn(
                    'rounded-2xl',
                    variants[variant],
                    paddings[padding],
                    interactive && 'hover-card cursor-pointer',
                    className
                )}
                style={shadows[variant] ? { boxShadow: shadows[variant], ...style } : style}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
