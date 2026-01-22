import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="mb-1.5 block text-sm font-medium text-surface-700 dark:text-surface-300">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'flex h-12 w-full rounded-xl border border-surface-200 bg-surface-50 px-4 py-2 text-sm text-foreground placeholder:text-surface-400 transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        'dark:border-surface-700 dark:bg-surface-900 dark:text-white',
                        error && 'border-error focus:ring-error/20 focus:border-error',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-red-500">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
