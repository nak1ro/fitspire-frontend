function SkeletonCard() {
    return (
        <div className="animate-pulse flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-surface-200 bg-surface">
            <div className="w-10 h-10 rounded-xl bg-surface-200 shrink-0" />
            <div className="flex-1 space-y-2">
                <div className="h-3.5 w-28 bg-surface-200 rounded-full" />
                <div className="h-3 w-20 bg-surface-200 rounded-full" />
            </div>
            <div className="h-3 w-12 bg-surface-200 rounded-full shrink-0" />
        </div>
    );
}

function SkeletonMonthGroup() {
    return (
        <div className="space-y-2 mb-6">
            <div className="animate-pulse h-3 w-24 bg-surface-200 rounded-full mb-3" />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
        </div>
    );
}

export function WorkoutListSkeleton() {
    return (
        <div className="space-y-2">
            <SkeletonMonthGroup />
            <SkeletonMonthGroup />
        </div>
    );
}
