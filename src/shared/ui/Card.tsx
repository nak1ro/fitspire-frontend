import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    variant?: 'solid' | 'glass';
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
    ({ className, variant = 'solid', padding = 'md', ...props }, ref) => {

        const variants = {
            solid: 'bg-white shadow-sm border border-surface-200 dark:bg-surface-800 dark:border-surface-700',
            glass: 'bg-white/10 backdrop-blur-md shadow-lg border border-white/20 dark:bg-black/40 dark:border-white/10',
        };

        const paddings = {
            none: '',
            sm: 'p-3',
            md: 'p-6',
            lg: 'p-8',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'rounded-xl',
                    variants[variant],
                    paddings[padding],
                    className
                )}
                {...props}
            />
        );
    }
);

Card.displayName = 'Card';
