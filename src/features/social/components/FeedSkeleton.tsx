export function FeedSkeleton() {
    return (
        <div className="space-y-4" aria-label="Loading feed" aria-busy="true">
            {[1, 2, 3].map(i => (
                <div key={i} className="rounded-2xl border border-surface-200 bg-surface p-4 space-y-4 animate-pulse">
                    {/* Header */}
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-surface-200 shrink-0" />
                        <div className="space-y-1.5 flex-1">
                            <div className="h-3 w-24 rounded-full bg-surface-200" />
                            <div className="h-2.5 w-12 rounded-full bg-surface-200" />
                        </div>
                    </div>

                    {/* Body */}
                    {i % 2 === 0 ? (
                        /* Text post skeleton */
                        <div className="space-y-2">
                            <div className="h-3 w-full rounded-full bg-surface-200" />
                            <div className="h-3 w-4/5 rounded-full bg-surface-200" />
                        </div>
                    ) : (
                        /* Workout card skeleton */
                        <div className="rounded-xl border border-surface-200 overflow-hidden">
                            <div className="h-10 bg-surface-200" />
                            <div className="flex gap-5 px-4 py-3">
                                <div className="h-4 w-16 rounded-full bg-surface-200" />
                                <div className="h-4 w-20 rounded-full bg-surface-200" />
                                <div className="h-4 w-14 rounded-full bg-surface-200" />
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="flex gap-4 pt-1 border-t border-surface-100">
                        <div className="h-4 w-12 rounded-full bg-surface-200" />
                        <div className="h-4 w-12 rounded-full bg-surface-200" />
                    </div>
                </div>
            ))}
        </div>
    );
}
