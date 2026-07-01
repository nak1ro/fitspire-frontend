import { Dumbbell, Scale, Utensils, Repeat, Users, Target, type LucideIcon } from 'lucide-react';

export interface GoalCategoryConfig {
    label: string;
    Icon: LucideIcon;
    color: string;
    bg: string;
}

export const CATEGORY_CONFIG: Record<string, GoalCategoryConfig> = {
    Fitness:   { label: 'Fitness',   Icon: Dumbbell, color: '#059669', bg: 'rgba(5,150,105,0.08)' },
    Body:      { label: 'Body',      Icon: Scale,    color: '#7B5EA7', bg: 'rgba(123,94,167,0.08)' },
    Nutrition: { label: 'Nutrition', Icon: Utensils, color: '#C2703D', bg: 'rgba(194,112,61,0.08)' },
    Habit:     { label: 'Habit',     Icon: Repeat,   color: '#3A7A8A', bg: 'rgba(58,122,138,0.08)' },
    Social:    { label: 'Social',    Icon: Users,    color: '#B34E7D', bg: 'rgba(179,78,125,0.08)' },
};

const FALLBACK_CATEGORY_CONFIG: GoalCategoryConfig = {
    label: 'Goal', Icon: Target, color: '#059669', bg: 'rgba(5,150,105,0.08)',
};

export function getCategoryConfig(category?: string | null): GoalCategoryConfig {
    return (category ? CATEGORY_CONFIG[category] : undefined) ?? FALLBACK_CATEGORY_CONFIG;
}
