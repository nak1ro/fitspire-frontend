'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUpdateFavouriteFood } from '../../hooks/useNutrition';
import { QUANTITY_UNIT_LABELS } from '../../mealTypeConfig';
import type { FavouriteFood, MealItemRequest, QuantityUnit } from '../../types';

const UNITS: QuantityUnit[] = ['Grams', 'Millilitres', 'Serving', 'Piece', 'CustomServing'];

interface Props {
    favourite: FavouriteFood | null;
    onClose: () => void;
}

export function EditFavouriteFoodModal({ favourite, onClose }: Props) {
    const [draft, setDraft] = useState<MealItemRequest | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { mutate: updateFavourite, isPending } = useUpdateFavouriteFood();

    useEffect(() => {
        if (favourite) {
            setDraft({
                name: favourite.name, quantity: favourite.quantity, quantityUnit: favourite.quantityUnit,
                customUnitName: favourite.customUnitName ?? null, caloriesKcal: favourite.caloriesKcal ?? null,
                proteinGrams: favourite.proteinGrams ?? null, carbsGrams: favourite.carbsGrams ?? null, fatGrams: favourite.fatGrams ?? null,
            });
            setError(null);
        }
    }, [favourite]);

    if (!favourite || !draft) return null;

    const patch = (fields: Partial<MealItemRequest>) => setDraft(prev => (prev ? { ...prev, ...fields } : prev));

    const handleSave = () => {
        setError(null);
        if (!draft.name.trim()) { setError('Enter a food name.'); return; }
        if (!draft.quantity || draft.quantity <= 0) { setError('Enter a quantity.'); return; }

        updateFavourite(
            { id: favourite.id, data: draft },
            {
                onSuccess: () => onClose(),
                onError: (err) => setError(getErrorMessage(err, 'Failed to update favourite.')),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-md bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1">
                    <h2 className="flex-1 text-base font-bold text-foreground">Edit favourite</h2>
                    <button onClick={onClose} className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-5 pb-5 pt-2 space-y-3">
                    <input
                        type="text"
                        value={draft.name}
                        onChange={e => patch({ name: e.target.value })}
                        placeholder="Food name"
                        maxLength={200}
                        className="w-full h-10 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                    />

                    <div className="grid grid-cols-2 gap-2.5">
                        <input
                            type="number"
                            min={0}
                            value={draft.quantity || ''}
                            onChange={e => patch({ quantity: parseFloat(e.target.value) || 0 })}
                            placeholder="Quantity"
                            className="w-full h-9 px-3 text-sm text-center bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                        />
                        <select
                            value={draft.quantityUnit}
                            onChange={e => patch({
                                quantityUnit: e.target.value as QuantityUnit,
                                customUnitName: e.target.value === 'CustomServing' ? draft.customUnitName : null,
                            })}
                            className="w-full h-9 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none px-2 text-center"
                        >
                            {UNITS.map(u => <option key={u} value={u}>{QUANTITY_UNIT_LABELS[u]}</option>)}
                        </select>
                    </div>

                    {draft.quantityUnit === 'CustomServing' && (
                        <input
                            type="text"
                            value={draft.customUnitName ?? ''}
                            onChange={e => patch({ customUnitName: e.target.value })}
                            placeholder="Unit name (e.g. bowl)"
                            maxLength={50}
                            className="w-full h-9 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                        />
                    )}

                    <div className="grid grid-cols-4 gap-2">
                        {(['caloriesKcal', 'proteinGrams', 'carbsGrams', 'fatGrams'] as const).map(field => {
                            const fieldLabel = field === 'caloriesKcal' ? 'Kcal' : field === 'proteinGrams' ? 'Protein' : field === 'carbsGrams' ? 'Carbs' : 'Fat';
                            return (
                                <div key={field} className="flex flex-col items-center gap-1">
                                    <label className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{fieldLabel}</label>
                                    <input
                                        type="number"
                                        min={0}
                                        value={draft[field] ?? ''}
                                        onChange={e => patch({ [field]: e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value)) })}
                                        placeholder="—"
                                        className="w-full h-9 text-center text-sm font-semibold bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                                    />
                                </div>
                            );
                        })}
                    </div>

                    {error && <Alert variant="error">{error}</Alert>}

                    <Button onClick={handleSave} loading={isPending} fullWidth>
                        Save
                    </Button>
                </div>
            </div>
        </div>
    );
}
