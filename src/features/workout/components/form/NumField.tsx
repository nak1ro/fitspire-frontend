interface NumFieldProps {
    label: string;
    value: string;
    onChange: (v: string) => void;
    unit?: string;
    required?: boolean;
    step?: number;
    min?: number;
}

export function NumField({ label, value, onChange, unit, required, step = 1, min = 0 }: NumFieldProps) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm font-medium text-surface-700">
                {label}
                {!required && <span className="text-surface-400 font-normal ml-1">(optional)</span>}
            </label>
            <div className="relative">
                <input
                    type="number"
                    min={min}
                    step={step}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="—"
                    className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 transition-colors duration-150 outline-none focus:border-primary-500"
                    style={unit ? { paddingRight: '3.25rem' } : undefined}
                />
                {unit && (
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-surface-400 pointer-events-none">
                        {unit}
                    </span>
                )}
            </div>
        </div>
    );
}
