import { cn } from '@/shared/lib/cn';

interface ChipSelectProps<T extends string> {
    label: string;
    options: readonly T[];
    value: T | '';
    onChange: (v: T | '') => void;
    labelMap?: Partial<Record<T, string>>;
    /** Equal-width chips filling the row (e.g. Intensity), vs. wrap naturally. */
    equalWidth?: boolean;
}

export function ChipSelect<T extends string>({ label, options, value, onChange, labelMap, equalWidth }: ChipSelectProps<T>) {
    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-surface-700">
                {label} <span className="text-surface-400 font-normal">(optional)</span>
            </label>
            <div className={cn('flex flex-wrap gap-2', equalWidth && 'flex-nowrap')}>
                {options.map(opt => {
                    const selected = value === opt;
                    return (
                        <button
                            key={opt}
                            type="button"
                            onClick={() => onChange(selected ? '' : opt)}
                            className={cn(
                                'px-3.5 py-2 rounded-xl text-sm font-semibold border transition-all',
                                equalWidth && 'flex-1',
                                selected
                                    ? 'bg-primary-50 border-primary-500 text-primary-600'
                                    : 'border-surface-200 text-surface-500 hover:bg-surface-100'
                            )}
                        >
                            {labelMap?.[opt] ?? opt}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
