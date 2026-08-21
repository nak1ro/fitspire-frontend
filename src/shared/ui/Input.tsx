import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../lib/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="w-full space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-surface-700"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'flex h-11 w-full rounded-xl border px-4 text-sm text-foreground',
                        'bg-surface-50 placeholder:text-surface-400',
                        'transition-colors duration-150',
                        'focus:outline-none focus:border-primary-500',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        error
                            ? 'border-error focus:border-error'
                            : 'border-surface-200',
                        className
                    )}
                    {...props}
                />
                {error && (
                    <p className="text-xs text-error">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-surface-400">{hint}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';
