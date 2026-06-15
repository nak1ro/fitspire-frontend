import type { KnownWorkoutType } from '../types';
import { KNOWN_TYPES, TYPE_CONFIG, TYPE_SHORT_LABELS, TYPE_SUBTITLES } from '../typeConfig';
import { WorkoutTypeChipStack } from './WorkoutTypeChipStack';

interface Props {
    onSelect: (type: KnownWorkoutType) => void;
}

export function WorkoutTypeStep({ onSelect }: Props) {
    return (
        <div>
            <p className="text-sm text-surface-500 mb-4">What kind of workout did you do?</p>
            <div className="grid grid-cols-2 gap-3">
                {KNOWN_TYPES.map((type) => {
                    const { Icon, color, bg } = TYPE_CONFIG[type];
                    return (
                        <button
                            key={type}
                            onClick={() => onSelect(type)}
                            className="group flex flex-col gap-3 rounded-2xl border border-surface-200 bg-background p-4 text-left hover-card"
                        >
                            <WorkoutTypeChipStack Icon={Icon} color={color} bg={bg} />
                            <div className="min-w-0">
                                <p className="text-sm font-bold text-foreground">{TYPE_SHORT_LABELS[type]}</p>
                                <p className="text-xs text-surface-400">{TYPE_SUBTITLES[type]}</p>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
