import { WorkoutsView } from '@/features/workout/components/WorkoutsView';
import { WorkoutsRail } from '@/features/workout/components/WorkoutsRail';

export default function WorkoutsPage() {
    return (
        <div className="max-w-2xl lg:max-w-5xl mx-auto px-4 py-6">
            <div className="lg:flex lg:gap-8 lg:justify-center lg:items-start">
                <div className="lg:w-full lg:max-w-2xl">
                    <WorkoutsView />
                </div>
                <aside className="hidden lg:block w-[22rem] shrink-0 sticky top-6">
                    <WorkoutsRail />
                </aside>
            </div>
        </div>
    );
}
