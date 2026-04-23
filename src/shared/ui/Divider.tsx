import { cn } from '../lib/cn';

interface DividerProps {
    label?: string;
    className?: string;
}

export function Divider({ label, className }: DividerProps) {
    if (!label) {
        return <hr className={cn('border-surface-200', className)} />;
    }

    return (
        <div className={cn('flex items-center gap-3', className)}>
            <div className="flex-1 h-px bg-surface-200" />
            <span className="text-xs text-surface-400 font-medium shrink-0 select-none">
                {label}
            </span>
            <div className="flex-1 h-px bg-surface-200" />
        </div>
    );
}
