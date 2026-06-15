import { HTMLAttributes, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

interface EyebrowBadgeProps extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode;
    icon?: LucideIcon;
    /** false (default) = bare uppercase text; true = bordered pill. */
    pill?: boolean;
}

export function EyebrowBadge({ children, icon: Icon, pill = false, className, ...props }: EyebrowBadgeProps) {
    if (pill) {
        return (
            <div
                className={cn(
                    'inline-flex items-center gap-2 rounded-full border border-primary-200 bg-primary-50 px-3.5 py-2',
                    'text-xs font-semibold uppercase tracking-widest text-primary-600',
                    className
                )}
                {...props}
            >
                {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                <span>{children}</span>
            </div>
        );
    }

    return (
        <p
            className={cn(
                'inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-primary-500',
                className
            )}
            {...props}
        >
            {Icon && <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
            <span>{children}</span>
        </p>
    );
}
