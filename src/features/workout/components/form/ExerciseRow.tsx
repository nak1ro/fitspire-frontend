import { Trash2 } from 'lucide-react';

interface ExerciseRowProps {
    name: string;
    sets: number;
    reps: number;
    weightKg: number;
    onChange: (field: 'sets' | 'reps' | 'weightKg', raw: string) => void;
    onRemove: () => void;
}

function Cell({ label, value, onChange, step = 1 }: { label: string; value: number; onChange: (v: string) => void; step?: number }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{label}</span>
            <input
                type="number"
                min={0}
                step={step}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="w-full h-9 text-center text-sm font-semibold bg-surface-50 border border-surface-200 rounded-lg outline-none transition-colors focus:border-primary-500"
                style={{ colorScheme: 'light' }}
            />
        </div>
    );
}

export function ExerciseRow({ name, sets, reps, weightKg, onChange, onRemove }: ExerciseRowProps) {
    return (
        <div className="rounded-xl border border-surface-200 bg-background p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-foreground truncate">{name}</span>
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center justify-center h-7 w-7 rounded-lg text-surface-400 hover:text-error hover:bg-surface-100 transition-colors shrink-0"
                    aria-label={`Remove ${name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            </div>
            <div className="grid grid-cols-3 gap-2.5">
                <Cell label="Sets" value={sets} onChange={v => onChange('sets', v)} />
                <Cell label="Reps" value={reps} onChange={v => onChange('reps', v)} />
                <Cell label="Kg" value={weightKg} onChange={v => onChange('weightKg', v)} step={0.5} />
            </div>
        </div>
    );
}
