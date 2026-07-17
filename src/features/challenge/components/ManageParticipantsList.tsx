'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserMinus, Users } from 'lucide-react';
import { Avatar, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useChallengeLeaderboard, useRemoveChallengeParticipant } from '../hooks/useChallenges';

function Row({ challengeId, userId, displayName, avatarUrl }: {
    challengeId: string;
    userId: string;
    displayName: string;
    avatarUrl?: string | null;
}) {
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: remove, isPending } = useRemoveChallengeParticipant();

    const handleRemove = () => {
        if (!confirming) { setConfirming(true); return; }
        setError(null);
        remove(
            { challengeId, userId },
            { onError: (err) => { setError(getErrorMessage(err, 'Failed to remove.')); setConfirming(false); } }
        );
    };

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Link href={`/profile/${userId}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                <Avatar displayName={displayName} userName={displayName} avatarUrl={avatarUrl} size="sm" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{displayName}</p>
                    {error && <p className="text-xs text-error leading-tight mt-0.5">{error}</p>}
                </div>
            </Link>
            <button
                type="button"
                onClick={handleRemove}
                disabled={isPending}
                className={
                    'flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all disabled:opacity-50 shrink-0 ' +
                    (confirming ? 'border-error text-error bg-error/5' : 'border-surface-200 text-surface-600 hover:bg-surface-100')
                }
            >
                <UserMinus className="h-3.5 w-3.5" aria-hidden="true" />
                {confirming ? 'Confirm' : 'Remove'}
            </button>
        </div>
    );
}

export function ManageParticipantsList({ challengeId, creatorUserId }: { challengeId: string; creatorUserId: string }) {
    const { data, isLoading } = useChallengeLeaderboard(challengeId, { pageSize: 100 });
    const entries = (data?.items ?? []).filter(entry => entry.userId !== creatorUserId);

    if (isLoading) {
        return (
            <div className="space-y-2 px-1">
                {[1, 2].map(i => <div key={i} className="h-12 rounded-xl bg-surface-100 animate-pulse" />)}
            </div>
        );
    }

    if (entries.length === 0) {
        return <EmptyState icon={Users} title="No participants yet" description="Invite people to get this challenge started." className="py-8" />;
    }

    return (
        <div className="space-y-0.5">
            {entries.map(entry => (
                <Row
                    key={entry.userId}
                    challengeId={challengeId}
                    userId={entry.userId}
                    displayName={entry.displayName}
                    avatarUrl={entry.profilePictureUrl}
                />
            ))}
        </div>
    );
}
