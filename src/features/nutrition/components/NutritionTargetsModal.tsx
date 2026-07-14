'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useNutritionTarget, useUpsertNutritionTarget, useDeleteNutritionTarget } from '../hooks/useNutrition';

interface Props {
    open: boolean;
    onClose: () => void;
}

function Field({ label, unit, value, onChange }: { label: string; unit: string; value: string; onChange: (v: string) => void }) {
    return (
        <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500">{label}</label>
            <div className="relative">
                <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    placeholder="—"
                    className="w-full h-11 pl-4 pr-14 text-sm font-medium bg-background border border-surface-200 rounded-xl outline-none transition-colors text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-surface-400 pointer-events-none">{unit}</span>
            </div>
        </div>
    );
}

export function NutritionTargetsModal({ open, onClose }: Props) {
    const { data: target } = useNutritionTarget();
    const { mutateAsync: upsert, isPending: saving } = useUpsertNutritionTarget();
    const { mutateAsync: clear, isPending: clearing } = useDeleteNutritionTarget();

    const [calories, setCalories] = useState('');
    const [protein, setProtein] = useState('');
    const [carbs, setCarbs] = useState('');
    const [fat, setFat] = useState('');
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        setCalories(target?.caloriesKcal != null ? String(target.caloriesKcal) : '');
        setProtein(target?.proteinGrams != null ? String(target.proteinGrams) : '');
        setCarbs(target?.carbsGrams != null ? String(target.carbsGrams) : '');
        setFat(target?.fatGrams != null ? String(target.fatGrams) : '');
        setError(null);
    }, [open, target]);

    const toValue = (v: string) => v.trim() === '' ? null : parseFloat(v);

    const handleSave = async () => {
        setError(null);
        const data = {
            caloriesKcal: toValue(calories),
            proteinGrams: toValue(protein),
            carbsGrams: toValue(carbs),
            fatGrams: toValue(fat),
        };
        if (!data.caloriesKcal && !data.proteinGrams && !data.carbsGrams && !data.fatGrams) {
            setError('Set at least one target.');
            return;
        }
        try {
            await upsert(data);
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to save targets. Please try again.'));
        }
    };

    const handleClear = async () => {
        setError(null);
        try {
            await clear();
            onClose();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to clear targets.'));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center justify-between px-5 pt-4 pb-1">
                    <h2 className="text-base font-bold text-foreground">Daily targets</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-5 pb-5 pt-1 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <Field label="Calories" unit="kcal" value={calories} onChange={setCalories} />
                        <Field label="Protein" unit="g" value={protein} onChange={setProtein} />
                        <Field label="Carbs" unit="g" value={carbs} onChange={setCarbs} />
                        <Field label="Fat" unit="g" value={fat} onChange={setFat} />
                    </div>

                    {error && <Alert variant="error">{error}</Alert>}

                    <Button onClick={handleSave} loading={saving} fullWidth>
                        Save targets
                    </Button>

                    {target && (
                        <button
                            type="button"
                            onClick={handleClear}
                            disabled={clearing}
                            className="w-full py-2 text-sm font-semibold text-error hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            Clear targets
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
