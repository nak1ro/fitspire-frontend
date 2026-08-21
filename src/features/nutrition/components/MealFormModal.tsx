'use client';

import { useEffect, useState } from 'react';
import { X, Plus, ChevronUp, Trash2 } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { todayLocalDateInput } from '@/shared/lib/localDate';
import {
    useCreateMeal, useUpdateMeal, useDeleteMeal,
    useAddMealItem, useUpdateMealItem, useDeleteMealItem, useReorderMealItems,
} from '../hooks/useNutrition';
import { MEAL_TYPES, MEAL_TYPE_CONFIG } from '../mealTypeConfig';
import { FoodItemRow } from './form/FoodItemRow';
import { FoodQuickAddPanel } from './form/FoodQuickAddPanel';
import type { Meal, MealItemRequest, MealType } from '../types';

interface ItemDraft {
    localId: string;
    existingId?: string;
    data: MealItemRequest;
}

interface Props {
    open: boolean;
    onClose: () => void;
    meal?: Meal | null;
    defaultDate: string;
}

function toDraft(item: MealItemRequest, existingId?: string): ItemDraft {
    return { localId: existingId ?? `${Date.now()}-${Math.random()}`, existingId, data: item };
}

function normalizeTime(value: string): string | null {
    if (!value) return null;
    return value.length === 5 ? `${value}:00` : value;
}

export function MealFormModal({ open, onClose, meal, defaultDate }: Props) {
    const isEdit = Boolean(meal);

    const [mealType, setMealType] = useState<MealType>('Breakfast');
    const [mealDate, setMealDate] = useState(defaultDate);
    const [time, setTime] = useState('');
    const [notes, setNotes] = useState('');
    const [items, setItems] = useState<ItemDraft[]>([]);
    const [showQuickAdd, setShowQuickAdd] = useState(false);
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (!open) return;
        if (meal) {
            setMealType(meal.mealType);
            setMealDate(meal.mealDate);
            setTime(meal.consumedAtLocalTime?.slice(0, 5) ?? '');
            setNotes(meal.notes ?? '');
            setItems(meal.items.map(i => toDraft(i, i.id)));
        } else {
            setMealType('Breakfast');
            setMealDate(defaultDate);
            setTime('');
            setNotes('');
            setItems([]);
        }
        setShowQuickAdd(false);
        setConfirmingDelete(false);
        setSubmitError(null);
    }, [open, meal, defaultDate]);

    const { mutateAsync: createMeal, isPending: creating } = useCreateMeal();
    const { mutateAsync: updateMealMeta, isPending: updatingMeta } = useUpdateMeal();
    const { mutateAsync: deleteMeal, isPending: deletingMeal } = useDeleteMeal();
    const { mutateAsync: addItem, isPending: addingItem } = useAddMealItem();
    const { mutateAsync: updateItem, isPending: updatingItem } = useUpdateMealItem();
    const { mutateAsync: deleteItem, isPending: deletingItem } = useDeleteMealItem();
    const { mutateAsync: reorderItems, isPending: reordering } = useReorderMealItems();

    const isPending = creating || updatingMeta || deletingMeal || addingItem || updatingItem || deletingItem || reordering;

    const addDraftItem = (item: MealItemRequest) => setItems(prev => [...prev, toDraft(item)]);
    const removeDraftItem = (localId: string) => setItems(prev => prev.filter(i => i.localId !== localId));
    const patchDraftItem = (localId: string, patch: Partial<MealItemRequest>) =>
        setItems(prev => prev.map(i => i.localId === localId ? { ...i, data: { ...i.data, ...patch } } : i));
    const moveDraftItem = (index: number, direction: -1 | 1) =>
        setItems(prev => {
            const target = index + direction;
            if (target < 0 || target >= prev.length) return prev;
            const next = [...prev];
            [next[index], next[target]] = [next[target], next[index]];
            return next;
        });

    const handleDelete = async () => {
        if (!meal) return;
        if (!confirmingDelete) { setConfirmingDelete(true); return; }
        try {
            await deleteMeal(meal.id);
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to delete meal.'));
            setConfirmingDelete(false);
        }
    };

    const handleSubmit = async () => {
        setSubmitError(null);

        if (items.length === 0) {
            setSubmitError('Add at least one food item.');
            return;
        }

        const invalidItem = items.find(i =>
            (i.data.quantityUnit === 'CustomServing' && !i.data.customUnitName?.trim()) ||
            (!i.data.caloriesKcal && !i.data.proteinGrams && !i.data.carbsGrams && !i.data.fatGrams)
        );
        if (invalidItem) {
            setSubmitError(
                invalidItem.data.quantityUnit === 'CustomServing' && !invalidItem.data.customUnitName?.trim()
                    ? `"${invalidItem.data.name}" is missing a unit name.`
                    : `"${invalidItem.data.name}" needs at least one nutrition value.`
            );
            return;
        }

        const metadata = {
            mealDate,
            consumedAtLocalTime: normalizeTime(time),
            mealType,
            name: meal?.name ?? null,
            notes: notes.trim() || null,
        };

        try {
            if (!meal) {
                await createMeal({ ...metadata, items: items.map(i => i.data) });
            } else {
                await updateMealMeta({ id: meal.id, data: metadata });

                const currentExistingIds = new Set(items.filter(i => i.existingId).map(i => i.existingId));
                const toDelete = meal.items.filter(i => !currentExistingIds.has(i.id));

                // Sequential, not Promise.all: concurrent writes to sibling items of the same
                // meal race under the backend's serializable transaction and can throw a
                // spurious "transient failure" 40001 (same class of conflict documented in
                // ef-navigation-fixup-bug-sweep.md, just triggered by real concurrency here
                // rather than an EF change-tracking bug).
                for (const i of toDelete) {
                    await deleteItem({ mealId: meal.id, itemId: i.id });
                }

                // Resolve every draft item to its persisted ID (existing items are updated in
                // place; new ones are created here), preserving the local array's order so it
                // can be committed via the reorder endpoint below.
                const orderedItemIds: string[] = [];
                for (const i of items) {
                    if (i.existingId) {
                        await updateItem({ mealId: meal.id, itemId: i.existingId, data: i.data });
                        orderedItemIds.push(i.existingId);
                    } else {
                        orderedItemIds.push(await addItem({ mealId: meal.id, data: { item: i.data } }) as string);
                    }
                }

                if (orderedItemIds.length > 1) {
                    await reorderItems({ mealId: meal.id, data: { itemIds: orderedItemIds } });
                }
            }
            onClose();
        } catch (err) {
            setSubmitError(getErrorMessage(err, 'Failed to save meal. Please try again.'));
        }
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-xl max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 className="flex-1 text-base font-bold text-foreground">{isEdit ? 'Edit meal' : 'Log meal'}</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1 space-y-5">

                    {/* Meal type */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-surface-700">Type</label>
                        <div className="flex gap-2">
                            {MEAL_TYPES.map(type => {
                                const { label, Icon } = MEAL_TYPE_CONFIG[type];
                                const selected = mealType === type;
                                return (
                                    <button
                                        key={type}
                                        type="button"
                                        onClick={() => setMealType(type)}
                                        className={
                                            'flex-1 flex flex-col items-center gap-1 py-2.5 rounded-xl text-xs font-semibold border transition-all ' +
                                            (selected ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                                        }
                                    >
                                        <Icon className="h-4 w-4" aria-hidden="true" />
                                        {label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Date / time */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-surface-700">Date</label>
                            <input
                                type="date"
                                value={mealDate}
                                max={todayLocalDateInput()}
                                onChange={e => setMealDate(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="block text-sm font-medium text-surface-700">Time <span className="text-surface-400 font-normal">(optional)</span></label>
                            <input
                                type="time"
                                value={time}
                                onChange={e => setTime(e.target.value)}
                                className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Food items */}
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-surface-700">Food</label>

                        {items.length > 0 && (
                            <div className="space-y-2.5">
                                {items.map((item, index) => (
                                    <FoodItemRow
                                        key={item.localId}
                                        item={item.data}
                                        onChange={patch => patchDraftItem(item.localId, patch)}
                                        onRemove={() => removeDraftItem(item.localId)}
                                        onMoveUp={index > 0 ? () => moveDraftItem(index, -1) : undefined}
                                        onMoveDown={index < items.length - 1 ? () => moveDraftItem(index, 1) : undefined}
                                    />
                                ))}
                            </div>
                        )}

                        {showQuickAdd ? (
                            <div className="space-y-2">
                                <FoodQuickAddPanel onAdd={addDraftItem} />
                                <button
                                    type="button"
                                    onClick={() => setShowQuickAdd(false)}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-surface-500 hover:text-foreground transition-colors"
                                >
                                    <ChevronUp className="h-4 w-4" aria-hidden="true" />
                                    Close
                                </button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => setShowQuickAdd(true)}
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed border-surface-200 text-sm font-semibold text-surface-400 hover:text-surface-600 hover:border-surface-300 transition-all"
                            >
                                <Plus className="h-4 w-4" aria-hidden="true" />
                                Add food
                            </button>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="block text-sm font-medium text-surface-700">Notes <span className="text-surface-400 font-normal">(optional)</span></label>
                        <textarea
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Anything worth remembering…"
                            rows={2}
                            maxLength={1000}
                            className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
                        />
                    </div>

                    {submitError && <Alert variant="error">{submitError}</Alert>}

                    <Button onClick={handleSubmit} loading={isPending && !confirmingDelete} fullWidth>
                        {isEdit ? 'Save changes' : 'Log meal'}
                    </Button>

                    {isEdit && (
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="w-full flex items-center justify-center gap-1.5 py-2 text-sm font-semibold text-error hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                            {confirmingDelete ? 'Tap again to confirm delete' : 'Delete meal'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
