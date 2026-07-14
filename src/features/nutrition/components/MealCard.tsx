import { Card, IconChip } from '@/shared/ui';
import { MEAL_TYPE_CONFIG } from '../mealTypeConfig';
import type { Meal } from '../types';

export function MealCard({ meal, onClick }: { meal: Meal; onClick: () => void }) {
    const { label, Icon, color, bg } = MEAL_TYPE_CONFIG[meal.mealType];
    const itemNames = meal.items.map(i => i.name).join(', ');

    return (
        <Card padding="sm" interactive onClick={onClick} className="flex items-center gap-3">
            <IconChip icon={Icon} size="sm" color={color} bg={bg} />
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{meal.name || label}</p>
                    <span className="text-sm font-bold text-foreground tabular-nums shrink-0">{Math.round(meal.caloriesKcal)} kcal</span>
                </div>
                <p className="text-xs text-surface-400 leading-tight mt-1 truncate">
                    {itemNames || 'No items'}
                    {meal.consumedAtLocalTime && ` · ${meal.consumedAtLocalTime.slice(0, 5)}`}
                </p>
            </div>
        </Card>
    );
}
