import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gradient';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {

        const variants = {
            primary: 'bg-primary-600 text-white hover:bg-primary-700 active:bg-primary-800 shadow-sm shadow-primary-500/30',
            gradient: 'bg-gradient-to-r from-primary-600 to-accent-600 text-white hover:opacity-90 shadow-sm shadow-accent-500/30',
            secondary: 'bg-white text-surface-900 border border-surface-200 hover:bg-surface-50 active:bg-surface-100 dark:bg-surface-800 dark:text-white dark:border-surface-700',
            ghost: 'bg-transparent text-surface-600 hover:bg-surface-100 dark:text-surface-300 dark:hover:bg-surface-800',
            danger: 'bg-error text-white hover:bg-red-600',
        };

        const sizes = {
            sm: 'h-8 px-3 text-sm',
            md: 'h-10 px-4 py-2',
            lg: 'h-12 px-6 text-lg',
        };

        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none data-[state=open]:bg-secondary/50',
                    variants[variant],
                    sizes[size],
                    fullWidth && 'w-full',
                    className
                )}
                disabled={loading || disabled}
                {...props}
            >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {children}
            </button>
        );
    }
);

Button.displayName = 'Button';
