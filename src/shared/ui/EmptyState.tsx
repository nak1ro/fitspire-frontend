import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';
import { IconChip } from './IconChip';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description?: string;
    action?: ReactNode;
    className?: string;
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center text-center py-16 px-6 space-y-4', className)}>
            <IconChip icon={icon} size="lg" />
            <div className="space-y-1.5 max-w-xs">
                <p className="text-base font-semibold text-foreground">{title}</p>
                {description && (
                    <p className="text-sm text-surface-500 leading-relaxed">{description}</p>
                )}
            </div>
            {action}
        </div>
    );
}
