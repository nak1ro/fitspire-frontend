import { Utensils } from 'lucide-react';
import { ComingSoonView } from '@/features/shared-views/ComingSoonView';

export default function NutritionPage() {
    return (
        <ComingSoonView
            icon={Utensils}
            title="Nutrition tracking is coming soon"
            subtitle="Log meals and hit your daily calorie and protein targets."
        />
    );
}
