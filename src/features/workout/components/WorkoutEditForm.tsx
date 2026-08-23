'use client';

import { useState } from 'react';
import { Alert, Button, Toggle } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { toLocalDateInput, toWorkoutOccurrenceInput, todayLocalDateInput } from '@/shared/lib/localDate';
import { useUpdateWorkout } from '../hooks/useWorkoutMutations';
import { resolveKnownType } from '../typeConfig';
import { FormSection } from './form/FormSection';
import { NumField } from './form/NumField';
import { ChipSelect } from './form/ChipSelect';
import type {
    CyclingWorkout,
    GymWorkout,
    RunningWorkout,
    SwimmingStroke,
    SwimmingWorkout,
    UpdateWorkoutRequest,
    WorkoutDetail,
    WorkoutIntensity,
    WorkoutSplit,
    YogaFocusArea,
    YogaIntensity,
    YogaStyle,
    YogaWorkout,
} from '../types';

interface Props {
    workout: WorkoutDetail;
    onSuccess: () => void;
}

// ─── Constant options (same source values as GymWorkoutForm/CardioWorkoutForm) ──

const SPLIT_OPTIONS: WorkoutSplit[] = ['Push', 'Pull', 'Legs', 'UpperBody', 'LowerBody', 'FullBody', 'Cardio', 'Other'];
const SPLIT_LABELS: Record<WorkoutSplit, string> = {
    Push: 'Push', Pull: 'Pull', Legs: 'Legs', UpperBody: 'Upper Body', LowerBody: 'Lower Body',
    FullBody: 'Full Body', Cardio: 'Cardio', Other: 'Other',
};
const INTENSITY_OPTIONS: WorkoutIntensity[] = ['Low', 'Medium', 'High', 'Extreme'];

const STROKE_OPTIONS = ['Freestyle', 'Breaststroke', 'Backstroke', 'Butterfly', 'Sidestroke', 'Mixed', 'Other'] as const satisfies readonly SwimmingStroke[];
const YOGA_STYLES = ['Hatha', 'Vinyasa', 'Ashtanga', 'Iyengar', 'Bikram', 'Kundalini', 'Yin', 'Restorative', 'Power', 'Other'] as const satisfies readonly YogaStyle[];
const YOGA_INTENSITIES = ['Low', 'Medium', 'High'] as const satisfies readonly YogaIntensity[];
const YOGA_FOCUS = ['FullBody', 'UpperBody', 'LowerBody', 'Core', 'Flexibility', 'Balance', 'Relaxation'] as const satisfies readonly YogaFocusArea[];
const FOCUS_LABELS: Partial<Record<YogaFocusArea, string>> = {
    FullBody: 'Full Body', UpperBody: 'Upper', LowerBody: 'Lower',
};

const numToStr = (v: number | null | undefined) => v != null ? String(v) : '';
const num = (v: string) => v !== '' ? parseFloat(v) : null;
const int = (v: string) => v !== '' ? parseInt(v, 10) : null;

export function WorkoutEditForm({ workout, onSuccess }: Props) {
    const knownType = resolveKnownType(workout.workoutType);

    // Common
    const initialDate = toLocalDateInput(workout.date);
    const [date, setDate] = useState(initialDate);
    const [duration, setDuration] = useState(numToStr(workout.durationMinutes));
    const [notes, setNotes] = useState(workout.notes ?? '');
    const [isPrivate, setIsPrivate] = useState(workout.isPrivate);
    const [submitError, setSubmitError] = useState<string | null>(null);

    // Gym
    const gym = knownType === 'Gym' ? (workout as GymWorkout) : null;
    const [splitType, setSplitType] = useState<WorkoutSplit | ''>(gym?.splitType ?? '');
    const [intensityLevel, setIntensityLevel] = useState<WorkoutIntensity | ''>(gym?.intensityLevel ?? '');

    // Running
    const running = knownType === 'Running' ? (workout as RunningWorkout) : null;
    const [runDistance, setRunDistance] = useState(numToStr(running?.distanceKm));
    const [runElevation, setRunElevation] = useState(numToStr(running?.elevationGainMeters));
    const [runSteps, setRunSteps] = useState(numToStr(running?.stepCount));
    const [runCalories, setRunCalories] = useState(numToStr(running?.caloriesBurned));

    // Cycling
    const cycling = knownType === 'Cycling' ? (workout as CyclingWorkout) : null;
    const [cycleDistance, setCycleDistance] = useState(numToStr(cycling?.distanceKm));
    const [cycleElevation, setCycleElevation] = useState(numToStr(cycling?.elevationGainMeters));
    const [isIndoor, setIsIndoor] = useState(cycling?.isIndoor ?? false);
    const [cycleCalories, setCycleCalories] = useState(numToStr(cycling?.caloriesBurned));

    // Swimming
    const swimming = knownType === 'Swimming' ? (workout as SwimmingWorkout) : null;
    const [swimMode, setSwimMode] = useState<'distance' | 'laps'>(swimming?.distanceMeters != null ? 'distance' : 'laps');
    const [swimDistance, setSwimDistance] = useState(numToStr(swimming?.distanceMeters));
    const [swimLaps, setSwimLaps] = useState(numToStr(swimming?.laps));
    const [swimPoolLength, setSwimPoolLength] = useState(numToStr(swimming?.poolLengthMeters));
    const [swimStroke, setSwimStroke] = useState<SwimmingStroke | ''>(swimming?.strokeType ?? '');
    const [swimCalories, setSwimCalories] = useState(numToStr(swimming?.caloriesBurned));

    // Yoga
    const yoga = knownType === 'Yoga' ? (workout as YogaWorkout) : null;
    const [yogaStyle, setYogaStyle] = useState<YogaStyle | ''>(yoga?.style ?? '');
    const [yogaIntensity, setYogaIntensity] = useState<YogaIntensity | ''>(yoga?.intensity ?? '');
    const [yogaFocus, setYogaFocus] = useState<YogaFocusArea | ''>(yoga?.focusArea ?? '');
    const [yogaCalories, setYogaCalories] = useState(numToStr(yoga?.caloriesBurned));

    const { mutateAsync: updateWorkout, isPending } = useUpdateWorkout();

    const handleSubmit = async () => {
        setSubmitError(null);

        if (knownType === 'Running' && !runDistance) { setSubmitError('Distance is required.'); return; }
        if (knownType === 'Cycling' && !cycleDistance) { setSubmitError('Distance is required.'); return; }
        if (knownType === 'Swimming') {
            if (swimMode === 'distance' && !swimDistance) { setSubmitError('Distance is required.'); return; }
            if (swimMode === 'laps' && (!swimLaps || !swimPoolLength)) { setSubmitError('Laps and pool length are required.'); return; }
        }

        const data: UpdateWorkoutRequest = {
            date: date === initialDate ? workout.date : toWorkoutOccurrenceInput(date),
            durationMinutes: num(duration),
            notes: notes || null,
            isPrivate,
        };

        if (knownType === 'Gym') {
            data.splitType = splitType || null;
            data.intensityLevel = intensityLevel || null;
            // Deliberately no `exercises` key — omitting it (not sending `null`) leaves
            // this workout's existing exercises/sets untouched. Per-set editing is out
            // of scope for this pass.
        } else if (knownType === 'Running') {
            data.distanceKm = parseFloat(runDistance);
            data.elevationGainMeters = num(runElevation);
            data.stepCount = int(runSteps);
            data.caloriesBurned = int(runCalories);
        } else if (knownType === 'Cycling') {
            data.distanceKm = parseFloat(cycleDistance);
            data.elevationGainMeters = num(cycleElevation);
            data.isIndoor = isIndoor;
            data.caloriesBurned = int(cycleCalories);
        } else if (knownType === 'Swimming') {
            data.distanceMeters = swimMode === 'distance' ? num(swimDistance) : null;
            data.laps = swimMode === 'laps' ? int(swimLaps) : null;
            data.poolLengthMeters = swimMode === 'laps' ? num(swimPoolLength) : null;
            data.strokeType = swimStroke || null;
            data.caloriesBurned = int(swimCalories);
        } else if (knownType === 'Yoga') {
            data.style = yogaStyle || null;
            data.intensity = yogaIntensity || null;
            data.focusArea = yogaFocus || null;
            data.caloriesBurned = int(yogaCalories);
        }

        try {
            await updateWorkout({ workoutId: workout.id, data });
            onSuccess();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to update workout. Please try again.'));
        }
    };

    return (
        <div className="space-y-5">

            {knownType === 'Gym' && (
                <FormSection title="Details">
                    <ChipSelect label="Split" options={SPLIT_OPTIONS} value={splitType} onChange={setSplitType} labelMap={SPLIT_LABELS} />
                    <ChipSelect label="Intensity" options={INTENSITY_OPTIONS} value={intensityLevel} onChange={setIntensityLevel} equalWidth />
                </FormSection>
            )}

            {knownType === 'Running' && (
                <FormSection title="Details">
                    <NumField label="Distance" value={runDistance} onChange={setRunDistance} unit="km" required step={0.1} />
                    <NumField label="Elevation gain" value={runElevation} onChange={setRunElevation} unit="m" />
                    <NumField label="Steps" value={runSteps} onChange={setRunSteps} step={100} />
                    <NumField label="Calories burned" value={runCalories} onChange={setRunCalories} unit="kcal" step={10} />
                </FormSection>
            )}

            {knownType === 'Cycling' && (
                <FormSection title="Details">
                    <NumField label="Distance" value={cycleDistance} onChange={setCycleDistance} unit="km" required step={0.1} />
                    <NumField label="Elevation gain" value={cycleElevation} onChange={setCycleElevation} unit="m" />
                    <Toggle label="Indoor ride" checked={isIndoor} onChange={setIsIndoor} />
                    <NumField label="Calories burned" value={cycleCalories} onChange={setCycleCalories} unit="kcal" step={10} />
                </FormSection>
            )}

            {knownType === 'Swimming' && (
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
                    <NumField label="Calories burned" value={swimCalories} onChange={setSwimCalories} unit="kcal" step={10} />
                </FormSection>
            )}

            {knownType === 'Yoga' && (
                <FormSection title="Details">
                    <ChipSelect label="Style" options={YOGA_STYLES} value={yogaStyle} onChange={setYogaStyle} />
                    <ChipSelect label="Intensity" options={YOGA_INTENSITIES} value={yogaIntensity} onChange={setYogaIntensity} equalWidth />
                    <ChipSelect label="Focus area" options={YOGA_FOCUS} value={yogaFocus} onChange={setYogaFocus} labelMap={FOCUS_LABELS} />
                    <NumField label="Calories burned" value={yogaCalories} onChange={setYogaCalories} unit="kcal" step={10} />
                </FormSection>
            )}

            <FormSection title="Stats">
                <NumField label="Duration" value={duration} onChange={setDuration} unit="min" step={knownType === 'Yoga' ? 5 : 1} />
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Date</label>
                    <input
                        type="date"
                        value={date}
                        max={todayLocalDateInput()}
                        onChange={e => setDate(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 transition-colors duration-150 outline-none focus:border-primary-500"
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
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none transition-colors resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
                />
            </div>

            <Toggle
                label="Private workout"
                subtitle="Won't appear in friends' feeds"
                checked={isPrivate}
                onChange={setIsPrivate}
            />

            {submitError && <Alert variant="error">{submitError}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Save changes
            </Button>
        </div>
    );
}
