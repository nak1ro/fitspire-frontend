import { HTMLAttributes, Ref, forwardRef } from 'react';
import { cn } from '../lib/cn';

type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span' | 'div';
type TypographyVariant = 'h1' | 'h2' | 'h3' | 'h4' | 'body-lg' | 'body' | 'body-sm' | 'caption';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant;
    weight?: 'normal' | 'medium' | 'semibold' | 'bold';
    color?: 'primary' | 'secondary' | 'muted' | 'inverse' | 'error' | 'success';
    as?: TypographyElement;
}

function isHeadingVariant(variant: TypographyVariant): variant is Extract<TypographyVariant, 'h1' | 'h2' | 'h3' | 'h4'> {
    return variant === 'h1' || variant === 'h2' || variant === 'h3' || variant === 'h4';
}

export const Typography = forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = 'body', weight = 'normal', color = 'primary', as, children, ...props }, ref) => {

        const Component = as ?? (isHeadingVariant(variant) ? variant : 'p');

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

        const componentProps = {
            className: cn(
                variants[variant],
                weights[weight],
                colors[color],
                className
            ),
            ...props,
        };

        switch (Component) {
            case 'h1':
                return <h1 ref={ref as Ref<HTMLHeadingElement>} {...componentProps}>{children}</h1>;
            case 'h2':
                return <h2 ref={ref as Ref<HTMLHeadingElement>} {...componentProps}>{children}</h2>;
            case 'h3':
                return <h3 ref={ref as Ref<HTMLHeadingElement>} {...componentProps}>{children}</h3>;
            case 'h4':
                return <h4 ref={ref as Ref<HTMLHeadingElement>} {...componentProps}>{children}</h4>;
            case 'span':
                return <span ref={ref as Ref<HTMLSpanElement>} {...componentProps}>{children}</span>;
            case 'div':
                return <div ref={ref as Ref<HTMLDivElement>} {...componentProps}>{children}</div>;
            case 'p':
            default:
                return <p ref={ref as Ref<HTMLParagraphElement>} {...componentProps}>{children}</p>;
        }
    }
);

Typography.displayName = 'Typography';
