import { Skeleton, SkeletonCard } from '@/shared/ui';

function SkeletonWorkoutCard() {
    return (
        <SkeletonCard className="flex items-center gap-3 px-4 py-3.5">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-3.5 w-28 rounded-full" />
                <Skeleton className="h-3 w-20 rounded-full" />
            </div>
            <Skeleton className="h-3 w-12 rounded-full shrink-0" />
        </SkeletonCard>
    );
}

function SkeletonMonthGroup() {
    return (
        <div className="space-y-2 mb-6">
            <Skeleton className="h-3 w-24 rounded-full mb-3 animate-pulse" />
            <SkeletonWorkoutCard />
            <SkeletonWorkoutCard />
            <SkeletonWorkoutCard />
        </div>
    );
}

export function WorkoutListSkeleton() {
    return (
        <div className="space-y-2" aria-label="Loading workouts" aria-busy="true">
            <SkeletonMonthGroup />
            <SkeletonMonthGroup />
        </div>
    );
}
