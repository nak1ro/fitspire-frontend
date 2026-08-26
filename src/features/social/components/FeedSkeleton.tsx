import { Skeleton, SkeletonCard } from '@/shared/ui';

export function FeedSkeleton() {
    return (
        <div className="space-y-4" aria-label="Loading feed" aria-busy="true">
            {[1, 2, 3].map(i => (
                <SkeletonCard key={i} className="space-y-4">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <Skeleton className="h-3 w-24 rounded-full" />
                            <Skeleton className="h-2.5 w-12 rounded-full" />
                        </div>
                    </div>

                    {/* Body */}
                    {i % 2 === 0 ? (
                        /* Text post skeleton */
                        <div className="space-y-2">
                            <Skeleton className="h-3 w-full rounded-full" />
                            <Skeleton className="h-3 w-4/5 rounded-full" />
                        </div>
                    ) : (
                        /* Workout card skeleton */
                        <div className="rounded-xl border border-surface-200 overflow-hidden">
                            <Skeleton className="h-10" />
                            <div className="flex gap-5 px-4 py-3">
                                <Skeleton className="h-4 w-16 rounded-full" />
                                <Skeleton className="h-4 w-20 rounded-full" />
                                <Skeleton className="h-4 w-14 rounded-full" />
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-4 pt-1 border-t border-surface-100">
                        <Skeleton className="h-4 w-12 rounded-full" />
                        <Skeleton className="h-4 w-12 rounded-full" />
                    </div>
                </SkeletonCard>
            ))}
        </div>
    );
}
