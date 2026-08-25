'use client';

import { useState } from 'react';
import { Search, Plus, Utensils, Pencil, Trash2 } from 'lucide-react';
import { Button, EmptyState, Toggle } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useFavouriteFoods, useRecentFoods, useCreateFavouriteFood, useDeleteFavouriteFood } from '../../hooks/useNutrition';
import { QUANTITY_UNITS, QUANTITY_UNIT_LABELS, formatQuantity } from '../../mealTypeConfig';
import { EditFavouriteFoodModal } from './EditFavouriteFoodModal';
import type { FavouriteFood, MealItemRequest, QuantityUnit } from '../../types';

function toItemRequest(source: MealItemRequest): MealItemRequest {
    return {
        name: source.name,
        quantity: source.quantity,
        quantityUnit: source.quantityUnit,
        customUnitName: source.customUnitName ?? null,
        caloriesKcal: source.caloriesKcal ?? null,
        proteinGrams: source.proteinGrams ?? null,
        carbsGrams: source.carbsGrams ?? null,
        fatGrams: source.fatGrams ?? null,
    };
}

const EMPTY_DRAFT: MealItemRequest = {
    name: '', quantity: 100, quantityUnit: 'Grams', customUnitName: null,
    caloriesKcal: null, proteinGrams: null, carbsGrams: null, fatGrams: null,
};

type Tab = 'favourites' | 'recent' | 'custom';

function RowsSkeleton() {
    return (
        <div className="p-2 space-y-2">
            {[1, 2, 3].map(i => (
                <div key={i} className="h-11 rounded-lg bg-surface-100 animate-pulse" />
            ))}
        </div>
    );
}

interface FoodListRowProps {
    item: MealItemRequest;
    onSelect: () => void;
}

function FoodListRow({ item, onSelect }: FoodListRowProps) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="w-full flex items-center gap-3 px-3.5 py-3 hover:bg-surface-50 transition-colors text-left border-b border-surface-100 last:border-0"
        >
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-surface-400 mt-0.5">
                    {formatQuantity(item.quantity, item.quantityUnit, item.customUnitName)}
                    {item.caloriesKcal != null && ` • ${item.caloriesKcal} kcal`}
                </p>
            </div>
            <Plus className="h-4 w-4 shrink-0 text-primary-500" aria-hidden="true" />
        </button>
    );
}

function FavouriteFoodRow({ item, onSelect, onEdit }: { item: FavouriteFood; onSelect: () => void; onEdit: () => void }) {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const { mutate: deleteFavourite, isPending: deleting } = useDeleteFavouriteFood();

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!confirmingDelete) { setConfirmingDelete(true); return; }
        deleteFavourite(item.id);
    };

    return (
        <div className="flex items-center gap-2 px-3.5 py-3 border-b border-surface-100 last:border-0">
            <button type="button" onClick={onSelect} className="flex-1 min-w-0 text-left">
                <p className="text-sm font-medium text-foreground truncate">{item.name}</p>
                <p className="text-xs text-surface-400 mt-0.5">
                    {formatQuantity(item.quantity, item.quantityUnit, item.customUnitName)}
                    {item.caloriesKcal != null && ` • ${item.caloriesKcal} kcal`}
                </p>
            </button>
            <div className="flex items-center gap-1 shrink-0">
                <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); onEdit(); }}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-100 transition-all"
                    aria-label={`Edit ${item.name}`}
                >
                    <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    className={cn(
                        'p-1.5 rounded-lg transition-all disabled:opacity-50',
                        confirmingDelete ? 'text-error bg-error/10' : 'text-surface-400 hover:text-error hover:bg-error/10'
                    )}
                    aria-label={confirmingDelete ? `Confirm delete ${item.name}` : `Delete ${item.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
}

function CustomFoodForm({ onAdd }: { onAdd: (item: MealItemRequest) => void }) {
    const [draft, setDraft] = useState<MealItemRequest>(EMPTY_DRAFT);
    const [saveAsFavourite, setSaveAsFavourite] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutateAsync: createFavourite, isPending: savingFavourite } = useCreateFavouriteFood();

    const hasNutrition = draft.caloriesKcal != null || draft.proteinGrams != null || draft.carbsGrams != null || draft.fatGrams != null;

    const patch = (fields: Partial<MealItemRequest>) => setDraft(prev => ({ ...prev, ...fields }));

    const handleAdd = async () => {
        setError(null);
        if (!draft.name.trim()) { setError('Enter a food name.'); return; }
        if (!draft.quantity || draft.quantity <= 0) { setError('Enter a quantity.'); return; }
        if (draft.quantityUnit === 'CustomServing' && !draft.customUnitName?.trim()) { setError('Enter a unit name.'); return; }
        if (!hasNutrition) { setError('Enter at least one nutrition value.'); return; }

        const item = toItemRequest(draft);

        if (saveAsFavourite) {
            try {
                await createFavourite(item);
            } catch (err) {
                setError(getErrorMessage(err, 'Could not save as favourite, but adding it to the meal.'));
            }
        }

        onAdd(item);
        setDraft(EMPTY_DRAFT);
        setSaveAsFavourite(false);
    };

    return (
        <div className="p-3.5 space-y-3">
            <input
                type="text"
                value={draft.name}
                onChange={e => patch({ name: e.target.value })}
                placeholder="Food name"
                maxLength={200}
                autoFocus
                className="w-full h-10 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:border-primary-500"
            />

            <div className="grid grid-cols-2 gap-2.5">
                <input
                    type="number"
                    min={0}
                    value={draft.quantity || ''}
                    onChange={e => patch({ quantity: parseFloat(e.target.value) || 0 })}
                    placeholder="Quantity"
                    className="w-full h-9 px-3 text-sm text-center bg-surface-50 border border-surface-200 rounded-lg outline-none focus:border-primary-500"
                />
                <select
                    value={draft.quantityUnit}
                    onChange={e => patch({
                        quantityUnit: e.target.value as QuantityUnit,
                        customUnitName: e.target.value === 'CustomServing' ? draft.customUnitName : null,
                    })}
                    className="w-full h-9 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none px-2 text-center"
                >
                    {QUANTITY_UNITS.map(u => <option key={u} value={u}>{QUANTITY_UNIT_LABELS[u]}</option>)}
                </select>
            </div>

            {draft.quantityUnit === 'CustomServing' && (
                <input
                    type="text"
                    value={draft.customUnitName ?? ''}
                    onChange={e => patch({ customUnitName: e.target.value })}
                    placeholder="Unit name (e.g. bowl)"
                    maxLength={50}
                    className="w-full h-9 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:border-primary-500"
                />
            )}

            <div className="grid grid-cols-4 gap-2">
                {(['caloriesKcal', 'proteinGrams', 'carbsGrams', 'fatGrams'] as const).map(field => {
                    const fieldLabel = field === 'caloriesKcal' ? 'Kcal' : field === 'proteinGrams' ? 'Protein' : field === 'carbsGrams' ? 'Carbs' : 'Fat';
                    const inputId = `quick-add-${field}`;
                    return (
                        <div key={field} className="flex flex-col items-center gap-1">
                            <label htmlFor={inputId} className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">
                                {fieldLabel}
                            </label>
                            <input
                                id={inputId}
                                type="number"
                                min={0}
                                value={draft[field] ?? ''}
                                onChange={e => patch({ [field]: e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value)) })}
                                placeholder="—"
                                className="w-full h-9 text-center text-sm font-semibold bg-surface-50 border border-surface-200 rounded-lg outline-none focus:border-primary-500"
                            />
                        </div>
                    );
                })}
            </div>

            <Toggle label="Save as favourite" checked={saveAsFavourite} onChange={setSaveAsFavourite} />

            {error && <p className="text-xs text-error">{error}</p>}

            <Button onClick={handleAdd} loading={savingFavourite} fullWidth className="gap-1.5">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add food
            </Button>
        </div>
    );
}

export function FoodQuickAddPanel({ onAdd }: { onAdd: (item: MealItemRequest) => void }) {
    const [tab, setTab] = useState<Tab>('recent');
    const [query, setQuery] = useState('');
    const [editingFavourite, setEditingFavourite] = useState<FavouriteFood | null>(null);

    const { data: favourites, isLoading: loadingFavourites } = useFavouriteFoods({ query: query || undefined, pageSize: 30 });
    const { data: recent, isLoading: loadingRecent } = useRecentFoods(20);

    return (
        <div className="rounded-2xl border border-surface-200 bg-background overflow-hidden shadow-chip">
            <div className="flex gap-1.5 px-3.5 py-2.5 border-b border-surface-100 bg-surface-50">
                {(['recent', 'favourites', 'custom'] as Tab[]).map(t => (
                    <button
                        key={t}
                        type="button"
                        onClick={() => setTab(t)}
                        className={cn(
                            'px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize',
                            tab === t ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100'
                        )}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {tab === 'favourites' && (
                <>
                    <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-surface-100">
                        <Search className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />
                        <input
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search favourites…"
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none"
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                        {loadingFavourites ? (
                            <RowsSkeleton />
                        ) : !favourites || favourites.items.length === 0 ? (
                            <EmptyState icon={Utensils} title="No favourites yet" className="py-6" />
                        ) : (
                            favourites.items.map(fav => (
                                <FavouriteFoodRow
                                    key={fav.id}
                                    item={fav}
                                    onSelect={() => onAdd(toItemRequest(fav))}
                                    onEdit={() => setEditingFavourite(fav)}
                                />
                            ))
                        )}
                    </div>
                </>
            )}

            {tab === 'recent' && (
                <div className="max-h-48 overflow-y-auto">
                    {loadingRecent ? (
                        <RowsSkeleton />
                    ) : !recent || recent.length === 0 ? (
                        <EmptyState icon={Utensils} title="Nothing logged recently" className="py-6" />
                    ) : (
                        recent.map((item, i) => (
                            <FoodListRow key={`${item.name}-${i}`} item={item} onSelect={() => onAdd(toItemRequest(item))} />
                        ))
                    )}
                </div>
            )}

            {tab === 'custom' && <CustomFoodForm onAdd={onAdd} />}

            <EditFavouriteFoodModal favourite={editingFavourite} onClose={() => setEditingFavourite(null)} />
        </div>
    );
}
