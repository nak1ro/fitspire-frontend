import { KNOWN_TYPES, TYPE_SHORT_LABELS, TYPE_CONFIG } from '../typeConfig';
import type { KnownWorkoutType } from '../types';

interface Props {
    value: KnownWorkoutType | null;
    onChange: (type: KnownWorkoutType | null) => void;
}

export function WorkoutTypeFilter({ value, onChange }: Props) {
    return (
        <div className="flex gap-2 overflow-x-auto pb-1 mb-4">
            {/* All chip */}
            <button
                type="button"
                onClick={() => onChange(null)}
                className="shrink-0 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all"
                style={!value ? {
                    backgroundColor: 'rgba(5,150,105,0.10)',
                    borderColor: '#059669',
                    color: '#059669',
                } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
            >
                All
            </button>

            {KNOWN_TYPES.map(type => {
                const { Icon, color, bg, border } = TYPE_CONFIG[type];
                const active = value === type;
                return (
                    <button
                        key={type}
                        type="button"
                        onClick={() => onChange(active ? null : type)}
                        className="shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold border transition-all"
                        style={active ? {
                            backgroundColor: bg,
                            borderColor: border,
                            color,
                        } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                    >
                        <Icon className="h-3.5 w-3.5 shrink-0" style={{ color: active ? color : undefined }} aria-hidden="true" />
                        {TYPE_SHORT_LABELS[type]}
                    </button>
                );
            })}
        </div>
    );
}
