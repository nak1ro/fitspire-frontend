import { TYPE_CONFIG } from '@/features/workout/typeConfig';
import { FITNESS_LEVEL_LABELS } from '../fitnessLevelConfig';
import type { FavoriteSport, FitnessLevel } from '../types';

interface Props {
    sport?: FavoriteSport | null;
    level?: FitnessLevel | null;
}

/** Renders bare pills — no wrapper or margin — so callers can compose them
 *  into a single row alongside other pills (e.g. follower/following counts). */
export function FitnessProfileChips({ sport, level }: Props) {
    return (
        <>
            {sport && (() => {
                const { label, Icon, color, bg } = TYPE_CONFIG[sport];
                return (
                    <span
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                        style={{ color, backgroundColor: bg }}
                    >
                        <Icon className="h-3 w-3" aria-hidden="true" />
                        {label}
                    </span>
                );
            })()}
            {level && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border border-surface-200 text-surface-600">
                    {FITNESS_LEVEL_LABELS[level]}
                </span>
            )}
        </>
    );
}
