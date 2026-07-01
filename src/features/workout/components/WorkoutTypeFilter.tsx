import { ChipGroup, type ChipGroupOption } from '@/shared/ui';
import { KNOWN_TYPES, TYPE_SHORT_LABELS, TYPE_CONFIG } from '../typeConfig';
import type { KnownWorkoutType } from '../types';

interface Props {
    value: KnownWorkoutType | null;
    onChange: (type: KnownWorkoutType | null) => void;
}

export function WorkoutTypeFilter({ value, onChange }: Props) {
    const options: ChipGroupOption<KnownWorkoutType>[] = KNOWN_TYPES.map(type => {
        const { Icon, color, bg, border } = TYPE_CONFIG[type];
        return { value: type, label: TYPE_SHORT_LABELS[type], Icon, color, bg, border };
    });

    return (
        <ChipGroup
            options={options}
            value={value}
            onChange={onChange}
            allowAll
            allowDeselect
            className="mb-6"
        />
    );
}
