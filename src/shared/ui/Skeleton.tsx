import { HTMLAttributes } from 'react';
import { cn } from '../lib/cn';

/**
 * Static pulsing-block building piece for composing page-specific loading
 * skeletons. No default border-radius or size — always pass one (e.g.
 * `rounded-full` for lines/circles, `rounded-xl` for larger blocks).
 */
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('bg-surface-200', className)} {...props} />;
}

/**
 * Shared skeleton "shell" — the bordered, padded card every page-specific
 * skeleton card sits inside, with one synchronized pulse on the whole card
 * instead of each inner `Skeleton` block animating independently.
 */
export function SkeletonCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('animate-pulse rounded-2xl border border-surface-200 bg-surface p-4', className)}
            {...props}
        />
    );
}
