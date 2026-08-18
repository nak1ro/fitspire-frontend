import { Coffee, Sun, Moon, Apple, type LucideIcon } from 'lucide-react';
import type { MealType, QuantityUnit } from './types';

export interface MealTypeConfig {
    label: string;
    Icon: LucideIcon;
    color: string;
    bg: string;
}

export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
export const QUANTITY_UNITS: QuantityUnit[] = ['Grams', 'Millilitres', 'Servings', 'Pieces', 'CustomServing'];

export const MEAL_TYPE_CONFIG: Record<MealType, MealTypeConfig> = {
    Breakfast: { label: 'Breakfast', Icon: Coffee, color: '#C2703D', bg: 'rgba(194,112,61,0.10)' },
    Lunch:     { label: 'Lunch',     Icon: Sun,    color: '#3A7A8A', bg: 'rgba(58,122,138,0.10)' },
    Dinner:    { label: 'Dinner',    Icon: Moon,   color: '#7B5EA7', bg: 'rgba(123,94,167,0.10)' },
    Snack:     { label: 'Snack',     Icon: Apple,  color: '#B34E7D', bg: 'rgba(179,78,125,0.10)' },
};

export const QUANTITY_UNIT_LABELS: Record<QuantityUnit, string> = {
    Grams: 'g',
    Millilitres: 'ml',
    Servings: 'serving',
    Pieces: 'piece',
    CustomServing: 'custom',
};

export function formatQuantity(quantity: number, unit: QuantityUnit, customUnitName?: string | null): string {
    if (unit === 'CustomServing') return `${quantity} ${customUnitName ?? 'unit'}`;
    const label = QUANTITY_UNIT_LABELS[unit];
    const plural = quantity !== 1 && (unit === 'Servings' || unit === 'Pieces') ? 's' : '';
    return `${quantity}${unit === 'Grams' || unit === 'Millilitres' ? label : ` ${label}${plural}`}`;
}
