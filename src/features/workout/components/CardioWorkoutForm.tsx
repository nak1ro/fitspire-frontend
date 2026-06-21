'use client';

import { useState } from 'react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import {
    useCreateCyclingWorkout,
    useCreateRunningWorkout,
    useCreateSwimmingWorkout,
    useCreateYogaWorkout,
} from '../hooks/useCreateWorkout';
import { FormSection } from './form/FormSection';
import { NumField } from './form/NumField';
import { ChipSelect } from './form/ChipSelect';
import { Toggle } from './form/Toggle';
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
            {type === 'Running' && (
                <FormSection title="Details">
                    <NumField label="Distance" value={runDistance} onChange={setRunDistance} unit="km" required step={0.1} />
                    <NumField label="Elevation gain" value={runElevation} onChange={setRunElevation} unit="m" />
                    <NumField label="Steps" value={runSteps} onChange={setRunSteps} step={100} />
                </FormSection>
            )}

            {/* Cycling-specific */}
            {type === 'Cycling' && (
                <FormSection title="Details">
                    <NumField label="Distance" value={cycleDistance} onChange={setCycleDistance} unit="km" required step={0.1} />
                    <NumField label="Elevation gain" value={cycleElevation} onChange={setCycleElevation} unit="m" />
                    <Toggle label="Indoor ride" checked={isIndoor} onChange={setIsIndoor} />
                </FormSection>
            )}

            {/* Swimming-specific */}
            {type === 'Swimming' && (
                <FormSection title="Details">
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-surface-700">Distance</label>
                        <div className="grid grid-cols-2 gap-2">
                            {(['distance', 'laps'] as const).map(mode => (
                                <button
                                    key={mode}
                                    type="button"
                                    onClick={() => setSwimMode(mode)}
                                    className={
                                        'py-2 rounded-xl text-sm font-bold border transition-all ' +
                                        (swimMode === mode
                                            ? 'bg-primary-50 border-primary-500 text-primary-600'
                                            : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                                    }
                                >
                                    {mode === 'distance' ? 'Enter metres' : 'Enter laps'}
                                </button>
                            ))}
                        </div>
                    </div>
                    {swimMode === 'distance'
                        ? <NumField label="Distance" value={swimDistance} onChange={setSwimDistance} unit="m" required step={10} />
                        : <div className="grid grid-cols-2 gap-3">
                            <NumField label="Laps" value={swimLaps} onChange={setSwimLaps} required />
                            <NumField label="Pool length" value={swimPoolLength} onChange={setSwimPoolLength} unit="m" required step={5} />
                        </div>
                    }
                    <ChipSelect label="Stroke" options={STROKE_OPTIONS} value={swimStroke} onChange={setSwimStroke} />
                </FormSection>
            )}

            {/* Yoga-specific */}
            {type === 'Yoga' && (
                <FormSection title="Details">
                    <ChipSelect label="Style" options={YOGA_STYLES} value={yogaStyle} onChange={setYogaStyle} />
                    <ChipSelect label="Intensity" options={YOGA_INTENSITIES} value={yogaIntensity} onChange={setYogaIntensity} equalWidth />
                    <ChipSelect label="Focus area" options={YOGA_FOCUS} value={yogaFocus} onChange={setYogaFocus} labelMap={FOCUS_LABELS} />
                </FormSection>
            )}

            <FormSection title="Stats">
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" step={type === 'Yoga' ? 5 : 1} />
                <NumField label="Calories burned" value={calories} onChange={setCalories} unit="kcal" step={10} />
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        max={today()}
                        onChange={e => setDate(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 transition-colors duration-150 outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                </div>
            </FormSection>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">
                    {isPrivate ? 'Notes' : 'Caption'} <span className="text-surface-400 font-normal">(optional)</span>
                </label>
                <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="How did it go?"
                    rows={2}
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none transition-colors resize-none text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500"
                />
                <p className="text-[11px] text-surface-400">
                    {isPrivate ? 'Visible only to you.' : "Shown on your post — leave blank to use a default caption."}
                </p>
            </div>

            <Toggle
                label="Private workout"
                subtitle="Won't appear in friends' feeds"
                checked={isPrivate}
                onChange={setIsPrivate}
            />

            {submitError && <Alert variant="error">{submitError}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Log Workout
            </Button>
        </div>
    );
}
