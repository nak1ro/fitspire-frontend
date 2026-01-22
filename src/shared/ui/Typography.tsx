import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface TypographyProps extends HTMLAttributes<HTMLParagraphElement> {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption';
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'error' | 'success';
    as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
}

export const Typography = forwardRef<HTMLParagraphElement, TypographyProps>(
    ({ className, variant = 'body', weight = 'normal', color = 'primary', as, children, ...props }, ref) => {

        const Component = as || (variant.startsWith('h') ? variant : 'p') as any;

        const variants = {
            h1: 'font-heading text-4xl leading-tight',
            h2: 'font-heading text-3xl leading-snug',
            h3: 'font-heading text-2xl leading-snug',
            h4: 'font-heading text-xl leading-snug',
            'body-lg': 'font-sans text-lg leading-relaxed',
            body: 'font-sans text-base leading-relaxed',
            'body-sm': 'font-sans text-sm leading-relaxed',
            caption: 'font-sans text-xs leading-normal',
        };

        const weights = {
            normal: 'font-normal',
            medium: 'font-medium',
            semibold: 'font-semibold',
            bold: 'font-bold',
        };

        const colors = {
            primary: 'text-foreground',
            secondary: 'text-surface-600 dark:text-surface-400',
            muted: 'text-surface-400 dark:text-surface-500',
            inverse: 'text-white',
            error: 'text-error',
            success: 'text-success',
        };

        return (
            <Component
                ref={ref}
                className={cn(
                    variants[variant],
                    weights[weight],
                    colors[color],
                    className
                )}
                {...props}
            >
                {children}
            </Component>
        );
    }
);

Typography.displayName = 'Typography';
