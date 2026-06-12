'use client';

import { useState } from 'react';
import { Alert } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import {
    useCreateCyclingWorkout,
    useCreateRunningWorkout,
    useCreateSwimmingWorkout,
    useCreateYogaWorkout,
} from '../hooks/useCreateWorkout';
import type {
    KnownWorkoutType,
    SwimmingStroke,
    YogaFocusArea,
    YogaIntensity,
    YogaStyle,
} from '../types';

const today = () => new Date().toISOString().split('T')[0];

type CardioType = Exclude<KnownWorkoutType, 'Gym'>;

interface Props {
    type: CardioType;
    onSuccess: () => void;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function NumField({
    label,
    value,
    onChange,
    unit,
    required,
    step = 1,
    min = 0,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    unit?: string;
    required?: boolean;
    step?: number;
    min?: number;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                {label}
                {!required && <span className="normal-case font-normal ml-1">(optional)</span>}
            </label>
            <div className="flex items-center gap-2">
                <input
                    type="number"
                    min={min}
                    step={step}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="—"
                    className="flex-1 text-sm font-medium bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground"
                />
                {unit && <span className="text-sm text-surface-400 shrink-0">{unit}</span>}
            </div>
        </div>
    );
}

function ChipSelect<T extends string>({
    label,
    options,
    value,
    onChange,
    labelMap,
}: {
    label: string;
    options: readonly T[];
    value: T | '';
    onChange: (v: T | '') => void;
    labelMap?: Partial<Record<T, string>>;
}) {
    return (
        <div className="space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                {label} <span className="normal-case font-normal">(optional)</span>
            </label>
            <div className="flex flex-wrap gap-1.5">
                {options.map(opt => (
                    <button
                        key={opt}
                        type="button"
                        onClick={() => onChange(value === opt ? '' : opt)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all"
                        style={value === opt ? {
                            backgroundColor: 'rgba(5,150,105,0.08)',
                            borderColor: '#059669',
                            color: '#059669',
                        } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                    >
                        {labelMap?.[opt] ?? opt}
                    </button>
                ))}
            </div>
        </div>
    );
}

function Toggle({ label, subtitle, checked, onChange }: {
    label: string;
    subtitle?: string;
    checked: boolean;
    onChange: (v: boolean) => void;
}) {
    return (
        <div className="flex items-center justify-between py-0.5">
            <div>
                <p className="text-sm font-medium text-foreground">{label}</p>
                {subtitle && <p className="text-xs text-surface-400">{subtitle}</p>}
            </div>
            <button
                type="button"
                role="switch"
                aria-checked={checked}
                onClick={() => onChange(!checked)}
                className="relative w-11 h-6 rounded-full transition-colors shrink-0"
                style={{ backgroundColor: checked ? '#059669' : 'var(--color-surface-200)' }}
            >
                <div
                    className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform"
                    style={{ transform: checked ? 'translateX(21px)' : 'translateX(4px)' }}
                />
            </button>
        </div>
    );
}

// ─── Constant options ──────────────────────────────────────────────────────────

const STROKE_OPTIONS = ['Freestyle', 'Breaststroke', 'Backstroke', 'Butterfly', 'Sidestroke', 'Mixed', 'Other'] as const satisfies readonly SwimmingStroke[];
const YOGA_STYLES = ['Hatha', 'Vinyasa', 'Ashtanga', 'Iyengar', 'Bikram', 'Kundalini', 'Yin', 'Restorative', 'Power', 'Other'] as const satisfies readonly YogaStyle[];
const YOGA_INTENSITIES = ['Low', 'Medium', 'High'] as const satisfies readonly YogaIntensity[];
const YOGA_FOCUS = ['FullBody', 'UpperBody', 'LowerBody', 'Core', 'Flexibility', 'Balance', 'Relaxation'] as const satisfies readonly YogaFocusArea[];
const FOCUS_LABELS: Partial<Record<YogaFocusArea, string>> = {
    FullBody: 'Full Body', UpperBody: 'Upper', LowerBody: 'Lower',
};

// ─── Main form ─────────────────────────────────────────────────────────────────

export function CardioWorkoutForm({ type, onSuccess }: Props) {
    // Shared
    const [date, setDate] = useState(today());
    const [duration, setDuration] = useState('');
    const [calories, setCalories] = useState('');
    const [notes, setNotes] = useState('');
    const [isPrivate, setIsPrivate] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Running
    const [runDistance, setRunDistance] = useState('');
    const [runElevation, setRunElevation] = useState('');
    const [runSteps, setRunSteps] = useState('');

    // Cycling
    const [cycleDistance, setCycleDistance] = useState('');
    const [cycleElevation, setCycleElevation] = useState('');
    const [isIndoor, setIsIndoor] = useState(false);

    // Swimming
    const [swimMode, setSwimMode] = useState<'distance' | 'laps'>('distance');
    const [swimDistance, setSwimDistance] = useState('');
    const [swimLaps, setSwimLaps] = useState('');
    const [swimPoolLength, setSwimPoolLength] = useState('');
    const [swimStroke, setSwimStroke] = useState<SwimmingStroke | ''>('');

    // Yoga
    const [yogaStyle, setYogaStyle] = useState<YogaStyle | ''>('');
    const [yogaIntensity, setYogaIntensity] = useState<YogaIntensity | ''>('');
    const [yogaFocus, setYogaFocus] = useState<YogaFocusArea | ''>('');

    // Hooks — all called unconditionally
    const { mutateAsync: createRunning, isPending: runPending } = useCreateRunningWorkout();
    const { mutateAsync: createCycling, isPending: cyclePending } = useCreateCyclingWorkout();
    const { mutateAsync: createSwimming, isPending: swimPending } = useCreateSwimmingWorkout();
    const { mutateAsync: createYoga, isPending: yogaPending } = useCreateYogaWorkout();

    const isPending = runPending || cyclePending || swimPending || yogaPending;

    const num = (v: string) => v !== '' ? parseFloat(v) : null;
    const int = (v: string) => v !== '' ? parseInt(v, 10) : null;

    const handleSubmit = async () => {
        setSubmitError(null);
        const isoDate = new Date(date).toISOString();

        try {
            if (type === 'Running') {
                if (!runDistance) { setSubmitError('Distance is required.'); return; }
                await createRunning({
                    date: isoDate,
                    distanceKm: parseFloat(runDistance),
                    durationMinutes: num(duration),
                    elevationGainMeters: num(runElevation),
                    stepCount: int(runSteps),
                    caloriesBurned: int(calories),
                    notes: notes || null,
                    isPrivate,
                });
            } else if (type === 'Cycling') {
                if (!cycleDistance) { setSubmitError('Distance is required.'); return; }
                await createCycling({
                    date: isoDate,
                    distanceKm: parseFloat(cycleDistance),
                    durationMinutes: num(duration),
                    elevationGainMeters: num(cycleElevation),
                    caloriesBurned: int(calories),
                    notes: notes || null,
                    isPrivate,
                    isIndoor,
                });
            } else if (type === 'Swimming') {
                if (swimMode === 'distance' && !swimDistance) {
                    setSubmitError('Distance is required.');
                    return;
                }
                if (swimMode === 'laps' && (!swimLaps || !swimPoolLength)) {
                    setSubmitError('Laps and pool length are required.');
                    return;
                }
                await createSwimming({
                    date: isoDate,
                    distanceMeters: swimMode === 'distance' ? num(swimDistance) : null,
                    laps: swimMode === 'laps' ? int(swimLaps) : null,
                    poolLengthMeters: swimMode === 'laps' ? num(swimPoolLength) : null,
                    strokeType: swimStroke || null,
                    durationMinutes: num(duration),
                    caloriesBurned: int(calories),
                    notes: notes || null,
                    isPrivate,
                });
            } else {
                await createYoga({
                    date: isoDate,
                    durationMinutes: num(duration),
                    style: yogaStyle || null,
                    intensity: yogaIntensity || null,
                    focusArea: yogaFocus || null,
                    caloriesBurned: int(calories),
                    notes: notes || null,
                    isPrivate,
                });
            }

            onSuccess();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to log workout. Please try again.'));
        }
    };

    return (
        <div className="space-y-5">

            {/* Running-specific */}
            {type === 'Running' && <>
                <NumField label="Distance" value={runDistance} onChange={setRunDistance} unit="km" required step={0.1} />
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" />
                <NumField label="Elevation gain" value={runElevation} onChange={setRunElevation} unit="m" />
                <NumField label="Steps" value={runSteps} onChange={setRunSteps} step={100} />
            </>}

            {/* Cycling-specific */}
            {type === 'Cycling' && <>
                <NumField label="Distance" value={cycleDistance} onChange={setCycleDistance} unit="km" required step={0.1} />
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" />
                <NumField label="Elevation gain" value={cycleElevation} onChange={setCycleElevation} unit="m" />
                <Toggle label="Indoor ride" checked={isIndoor} onChange={setIsIndoor} />
            </>}

            {/* Swimming-specific */}
            {type === 'Swimming' && <>
                <div className="space-y-3">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">Distance</label>
                    <div className="grid grid-cols-2 gap-2">
                        {(['distance', 'laps'] as const).map(mode => (
                            <button
                                key={mode}
                                type="button"
                                onClick={() => setSwimMode(mode)}
                                className="py-2 rounded-xl text-xs font-bold border transition-all"
                                style={swimMode === mode ? {
                                    backgroundColor: 'rgba(5,150,105,0.08)',
                                    borderColor: '#059669',
                                    color: '#059669',
                                } : { borderColor: 'var(--color-surface-200)', color: 'var(--color-surface-500)' }}
                            >
                                {mode === 'distance' ? 'Enter metres' : 'Enter laps'}
                            </button>
                        ))}
                    </div>
                    {swimMode === 'distance'
                        ? <NumField label="Distance" value={swimDistance} onChange={setSwimDistance} unit="m" required step={10} />
                        : <div className="grid grid-cols-2 gap-3">
                            <NumField label="Laps" value={swimLaps} onChange={setSwimLaps} required />
                            <NumField label="Pool length" value={swimPoolLength} onChange={setSwimPoolLength} unit="m" required step={5} />
                        </div>
                    }
                </div>
                <ChipSelect label="Stroke" options={STROKE_OPTIONS} value={swimStroke} onChange={setSwimStroke} />
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" />
            </>}

            {/* Yoga-specific */}
            {type === 'Yoga' && <>
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" step={5} />
                <ChipSelect label="Style" options={YOGA_STYLES} value={yogaStyle} onChange={setYogaStyle} />
                <ChipSelect label="Intensity" options={YOGA_INTENSITIES} value={yogaIntensity} onChange={setYogaIntensity} />
                <ChipSelect label="Focus area" options={YOGA_FOCUS} value={yogaFocus} onChange={setYogaFocus} labelMap={FOCUS_LABELS} />
            </>}

            {/* Shared fields */}
            <NumField label="Calories burned" value={calories} onChange={setCalories} unit="kcal" step={10} />

            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">Date</label>
                <input
                    type="date"
                    value={date}
                    max={today()}
                    onChange={e => setDate(e.target.value)}
                    className="w-full text-sm font-medium bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors text-foreground"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">
                    Notes <span className="normal-case font-normal">(optional)</span>
                </label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How did it go?"
                    rows={2}
                    className="w-full text-sm bg-background border border-surface-200 rounded-xl px-3 py-2.5 outline-none transition-colors resize-none text-foreground placeholder:text-surface-400"
                />
            </div>

            <Toggle
                label="Private workout"
                subtitle="Won't appear in friends' feeds"
                checked={isPrivate}
                onChange={setIsPrivate}
            />

            {submitError && <Alert variant="error">{submitError}</Alert>}

            <button
                type="button"
                onClick={handleSubmit}
                disabled={isPending}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #059669, #34D399)' }}
            >
                {isPending ? 'Logging workout…' : 'Log Workout'}
            </button>
        </div>
    );
}
