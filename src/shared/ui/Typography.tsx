import { HTMLAttributes, Ref, forwardRef } from 'react';
import { cn } from '../lib/cn';

type TypographyVariant =
    | 'display'
    | 'h1' | 'h2' | 'h3' | 'h4'
    | 'body-lg' | 'body' | 'body-sm' | 'caption'
    | 'eyebrow';

type TypographyColor = 'default' | 'muted' | 'subtle' | 'primary' | 'inverse' | 'error' | 'success';
type TypographyWeight = 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold';
type TypographyElement = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div' | 'label';

interface TypographyProps extends HTMLAttributes<HTMLElement> {
    variant?: TypographyVariant;
    color?: TypographyColor;
    weight?: TypographyWeight;
    as?: TypographyElement;
}

const defaultElements: Record<TypographyVariant, TypographyElement> = {
    display:   'h1',
    h1:        'h1',
    h2:        'h2',
    h3:        'h3',
    h4:        'h4',
    'body-lg': 'p',
    body:      'p',
    'body-sm': 'p',
    caption:   'p',
    eyebrow:   'p',
};

const variantClasses: Record<TypographyVariant, string> = {
    display:   'text-5xl font-bold tracking-tight leading-none',
    h1:        'text-4xl font-bold tracking-tight leading-tight',
    h2:        'text-3xl font-semibold leading-snug',
    h3:        'text-2xl font-semibold leading-snug',
    h4:        'text-xl font-medium leading-snug',
    'body-lg': 'text-lg leading-relaxed',
    body:      'text-base leading-relaxed',
    'body-sm': 'text-sm leading-relaxed',
    caption:   'text-xs leading-normal',
    eyebrow:   'text-xs font-semibold tracking-widest uppercase',
};

const colorClasses: Record<TypographyColor, string> = {
    default: 'text-foreground',
    muted:   'text-surface-600',
    subtle:  'text-surface-400',
    primary: 'text-primary-500',
    inverse: 'text-white',
    error:   'text-error',
    success: 'text-success',
};

const weightClasses: Record<TypographyWeight, string> = {
    light:     'font-light',
    normal:    'font-normal',
    medium:    'font-medium',
    semibold:  'font-semibold',
    bold:      'font-bold',
    extrabold: 'font-extrabold',
};

export const Typography = forwardRef<HTMLElement, TypographyProps>(
    ({ className, variant = 'body', color = 'default', weight, as, children, ...props }, ref) => {

        const Component = as ?? defaultElements[variant];
        const resolvedColor = variant === 'eyebrow' && color === 'default' ? 'primary' : color;

        const classes = cn(
            variantClasses[variant],
            colorClasses[resolvedColor],
            weight && weightClasses[weight],
            className
        );

        const elementProps = { className: classes, ...props };

        switch (Component) {
            case 'h1':    return <h1    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h1>;
            case 'h2':    return <h2    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h2>;
            case 'h3':    return <h3    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h3>;
            case 'h4':    return <h4    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h4>;
            case 'h5':    return <h5    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h5>;
            case 'h6':    return <h6    ref={ref as Ref<HTMLHeadingElement>}   {...elementProps}>{children}</h6>;
            case 'span':  return <span  ref={ref as Ref<HTMLSpanElement>}      {...elementProps}>{children}</span>;
            case 'div':   return <div   ref={ref as Ref<HTMLDivElement>}       {...elementProps}>{children}</div>;
            case 'label': return <label ref={ref as Ref<HTMLLabelElement>}     {...elementProps}>{children}</label>;
            default:      return <p     ref={ref as Ref<HTMLParagraphElement>} {...elementProps}>{children}</p>;
        }
    }
);

Typography.displayName = 'Typography';
