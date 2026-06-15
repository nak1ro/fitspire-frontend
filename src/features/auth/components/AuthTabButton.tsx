import { cn } from '@/shared/lib/cn';

interface AuthTabButtonProps {
    active: boolean;
    onClick: () => void;
    children: string;
}

export function AuthTabButton({ active, onClick, children }: AuthTabButtonProps) {
    return (
        <button
            type="button"
            role="tab"
            aria-selected={active}
            onClick={onClick}
            className={cn(
                'flex-1 py-2.5 px-4 text-sm font-medium rounded-md transition-colors',
                active
                    ? 'bg-primary-500 text-white shadow-chip'
                    : 'text-surface-500 hover:text-foreground hover:bg-surface-200/60'
            )}
        >
            {children}
        </button>
    );
}
