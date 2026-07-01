import { cn } from '../lib/cn';

interface ToggleProps {
    label?: string;
    subtitle?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}

export function Toggle({ label, subtitle, checked, onChange }: ToggleProps) {
    const control = (
        <button
            type="button"
            role="switch"
            aria-checked={checked}
            aria-label={label}
            onClick={() => onChange(!checked)}
            className={cn(
                'relative w-11 h-6 rounded-full transition-colors shrink-0',
                checked ? 'bg-primary-500' : 'bg-surface-200'
            )}
        >
            <div
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                style={{ transform: checked ? 'translateX(21px)' : 'translateX(4px)' }}
            />
        </button>
    );

    if (!label) return control;

    return (
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                {subtitle && <p className="text-xs text-surface-400 mt-0.5">{subtitle}</p>}
            </div>
            {control}
        </div>
    );
}
