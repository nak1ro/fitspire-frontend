'use client';

import { StreakCard } from '@/features/app-shell/components/StreakCard';
import { WorkoutActivityGraphCard } from './WorkoutActivityGraphCard';
import { TodaysDurationCard } from './TodaysDurationCard';

/** Fills the empty right-hand gutter on the Workouts page, mirroring FeedRail's
 *  card-stack pattern with workout-specific widgets instead of social ones. */
export function WorkoutsRail() {
    return (
        <section className="space-y-3" aria-label="Workout activity summary">
            <WorkoutActivityGraphCard />
            <StreakCard />
            <TodaysDurationCard />
        </section>
    );
}
