import type { LucideIcon } from 'lucide-react';

interface Props {
    Icon: LucideIcon;
    SecondaryIcon: LucideIcon;
    color: string;
    bg: string;
}

const CHIP_BASE = 'absolute flex h-12 w-12 items-center justify-center rounded-xl border shadow-chip transition-transform duration-300 ease-out';

// Small "stacked chip" illustration — a neutral chip peeking out behind an
// accent-tinted one, fanning further apart on hover (driven by the parent
// button's `group` class). Mirrors ScribeRocket's ActionCardStack: each chip
// shows a distinct, complementary icon rather than repeating the same glyph.
export function WorkoutTypeChipStack({ Icon, SecondaryIcon, color, bg }: Props) {
    return (
        <div className="relative h-[72px] w-[72px]" aria-hidden="true">
            <div className={`${CHIP_BASE} left-0 top-0 -rotate-6 border-surface-200 bg-background text-surface-300 group-hover:-translate-x-1 group-hover:-translate-y-0.5 group-hover:-rotate-12`}>
                <SecondaryIcon className="h-5 w-5" />
            </div>
            <div
                className={`${CHIP_BASE} left-6 top-6 rotate-6 group-hover:translate-x-1 group-hover:translate-y-0.5 group-hover:rotate-12`}
                style={{ background: bg, borderColor: 'transparent' }}
            >
                <Icon className="h-6 w-6" style={{ color }} />
            </div>
        </div>
    );
}
