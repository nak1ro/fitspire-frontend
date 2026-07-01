import type { LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

export interface ChipGroupOption<T extends string> {
    value: T;
    label: string;
    Icon?: LucideIcon;
    /** Explicit overrides — for per-category colors that bypass the default primary active state. */
    color?: string;
    bg?: string;
    border?: string;
}

interface ChipGroupProps<T extends string> {
    options: ChipGroupOption<T>[];
    value: T | null;
    onChange: (value: T | null) => void;
    /** Renders a leading "All" chip representing a null selection. */
    allowAll?: boolean;
    allLabel?: string;
    /** Clicking the already-active chip clears the selection back to null. */
    allowDeselect?: boolean;
    className?: string;
}

const CHIP_BASE = 'shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all';

const INACTIVE_STYLE = { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' };

export function ChipGroup<T extends string>({
    options,
    value,
    onChange,
    allowAll = false,
    allLabel = 'All',
    allowDeselect = false,
    className,
}: ChipGroupProps<T>) {
    return (
        <div className={cn('flex gap-2 overflow-x-auto pb-1', className)}>
            {allowAll && (
                <button
                    type="button"
                    onClick={() => onChange(null)}
                    className={CHIP_BASE}
                    style={value === null ? {
                        backgroundColor: 'var(--color-primary-50)',
                        borderColor: 'var(--color-primary-500)',
                        color: 'var(--color-primary-500)',
                    } : INACTIVE_STYLE}
                >
                    {allLabel}
                </button>
            )}

            {options.map(opt => {
                const active = opt.value === value;
                const color = opt.color ?? 'var(--color-primary-500)';
                const bg = opt.bg ?? 'var(--color-primary-50)';
                const border = opt.border ?? 'var(--color-primary-500)';

                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(active && allowDeselect ? null : opt.value)}
                        className={CHIP_BASE}
                        style={active ? { backgroundColor: bg, borderColor: border, color } : INACTIVE_STYLE}
                    >
                        {opt.Icon && <opt.Icon className="h-3.5 w-3.5 shrink-0" style={{ color: active ? color : undefined }} aria-hidden="true" />}
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
