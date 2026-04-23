import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {

        const base = [
            'inline-flex items-center justify-center font-medium select-none',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            'disabled:opacity-50 disabled:pointer-events-none',
        ].join(' ');

        const variants = {
            primary: [
                'bg-primary-500 text-white',
                'hover:bg-primary-600 active:bg-primary-700',
                'shadow-[0_2px_8px_rgba(194,109,56,0.28)]',
            ].join(' '),
            secondary: [
                'bg-surface-100 text-foreground border border-surface-200',
                'hover:bg-surface-200 active:bg-surface-300',
            ].join(' '),
            ghost: [
                'bg-transparent text-primary-600',
                'hover:bg-primary-50 active:bg-primary-100',
            ].join(' '),
            danger: [
                'bg-error text-white',
                'hover:opacity-90 active:opacity-80',
            ].join(' '),
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm rounded-lg gap-1.5',
            md: 'h-11 px-5 text-sm rounded-xl gap-2',
            lg: 'h-12 px-6 text-base rounded-xl gap-2',
        };

        return (
            <button
                ref={ref}
                className={cn(base, variants[variant], sizes[size], fullWidth && 'w-full', className)}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
