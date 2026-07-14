'use client';

import { useState } from 'react';
import { Trash2, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
import { QUANTITY_UNIT_LABELS, formatQuantity } from '../../mealTypeConfig';
import type { MealItemRequest, QuantityUnit } from '../../types';

const UNITS: QuantityUnit[] = ['Grams', 'Millilitres', 'Serving', 'Piece', 'CustomServing'];

interface Props {
    item: MealItemRequest;
    onChange: (patch: Partial<MealItemRequest>) => void;
    onRemove: () => void;
}

function MiniNumField({ label, value, onChange }: { label: string; value: number | null | undefined; onChange: (v: number | null) => void }) {
    return (
        <div className="flex flex-col items-center gap-1">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">{label}</span>
            <input
                type="number"
                min={0}
                value={value ?? ''}
                onChange={e => onChange(e.target.value === '' ? null : Math.max(0, parseFloat(e.target.value)))}
                placeholder="—"
                className="w-full h-9 text-center text-sm font-semibold bg-surface-50 border border-surface-200 rounded-lg outline-none transition-colors focus:bg-primary-50 focus:border-primary-500"
                style={{ colorScheme: 'light' }}
            />
        </div>
    );
}

export function FoodItemRow({ item, onChange, onRemove }: Props) {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className="rounded-xl border border-surface-200 bg-background p-3 space-y-2.5">
            <div className="flex items-center justify-between gap-2">
                <button type="button" onClick={() => setExpanded(v => !v)} className="flex-1 min-w-0 flex items-center gap-2 text-left">
                    <span className="text-sm font-semibold text-foreground truncate">{item.name}</span>
                    <ChevronDown className={cn('h-3.5 w-3.5 text-surface-400 shrink-0 transition-transform', expanded && 'rotate-180')} aria-hidden="true" />
                </button>
                <button
                    type="button"
                    onClick={onRemove}
                    className="flex items-center justify-center h-7 w-7 rounded-lg text-surface-400 hover:text-error hover:bg-surface-100 transition-colors shrink-0"
                    aria-label={`Remove ${item.name}`}
                >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
            </div>

            <p className="text-xs text-surface-500">
                {formatQuantity(item.quantity, item.quantityUnit, item.customUnitName)}
                {item.caloriesKcal != null && ` • ${item.caloriesKcal} kcal`}
            </p>

            {expanded && (
                <div className="space-y-2.5 pt-1">
                    <input
                        type="text"
                        value={item.name}
                        onChange={e => onChange({ name: e.target.value })}
                        className="w-full h-9 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                    <div className="grid grid-cols-2 gap-2.5">
                        <MiniNumField label="Quantity" value={item.quantity} onChange={v => onChange({ quantity: v ?? 0 })} />
                        <div className="flex flex-col items-center gap-1">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-surface-400">Unit</span>
                            <select
                                value={item.quantityUnit}
                                onChange={e => onChange({
                                    quantityUnit: e.target.value as QuantityUnit,
                                    customUnitName: e.target.value === 'CustomServing' ? item.customUnitName : null,
                                })}
                                className="w-full h-9 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none px-1 text-center"
                            >
                                {UNITS.map(u => <option key={u} value={u}>{QUANTITY_UNIT_LABELS[u]}</option>)}
                            </select>
                        </div>
                    </div>
                    {item.quantityUnit === 'CustomServing' && (
                        <input
                            type="text"
                            value={item.customUnitName ?? ''}
                            onChange={e => onChange({ customUnitName: e.target.value })}
                            placeholder="Unit name (e.g. bowl)"
                            maxLength={50}
                            className="w-full h-9 px-3 text-sm bg-surface-50 border border-surface-200 rounded-lg outline-none focus:bg-primary-50 focus:border-primary-500"
                        />
                    )}
                    <div className="grid grid-cols-4 gap-2">
                        <MiniNumField label="Kcal" value={item.caloriesKcal} onChange={v => onChange({ caloriesKcal: v })} />
                        <MiniNumField label="Protein" value={item.proteinGrams} onChange={v => onChange({ proteinGrams: v })} />
                        <MiniNumField label="Carbs" value={item.carbsGrams} onChange={v => onChange({ carbsGrams: v })} />
                        <MiniNumField label="Fat" value={item.fatGrams} onChange={v => onChange({ fatGrams: v })} />
                    </div>
                </div>
            )}
        </div>
    );
}
