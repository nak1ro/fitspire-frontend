'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Search, UserPlus, X } from 'lucide-react';
import { Avatar, Button, EmptyState, Modal } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useSearchSocialUsers } from '@/features/social/hooks/useSocialReads';
import type { SocialUserSummary } from '@/features/social/types';
import { useChallengeLeaderboard, useInviteChallengeUser } from '../hooks/useChallenges';
import type { ChallengeDetail } from '../types';

interface Props {
    challenge: ChallengeDetail;
    open: boolean;
    onClose: () => void;
}

function useDebouncedValue(value: string, delayMs: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}

function ResultsSkeleton() {
    return (
        <div className="p-1.5 space-y-1">
            {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3 px-3 py-2.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-surface-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-28 bg-surface-200 rounded-full" />
                        <div className="h-2.5 w-20 bg-surface-200 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

function ResultRow({ user, challengeId, alreadyIn }: { user: SocialUserSummary; challengeId: string; alreadyIn: boolean }) {
    const [invited, setInvited] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: invite, isPending } = useInviteChallengeUser();

    const handleInvite = () => {
        setError(null);
        invite(
            { challengeId, data: { userId: user.id } },
            {
                onSuccess: () => setInvited(true),
                onError: (err) => setError(getErrorMessage(err, 'Failed to invite.')),
            }
        );
    };

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Link href={`/profile/${user.id}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                <Avatar displayName={user.displayName} userName={user.userName} avatarUrl={user.profilePictureUrl} size="sm" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{user.displayName}</p>
                    <p className="text-xs leading-tight mt-0.5 truncate text-surface-400">
                        {error ? <span className="text-error">{error}</span> : `@${user.userName}`}
                    </p>
                </div>
            </Link>
            {alreadyIn ? (
                <span className="text-xs font-semibold text-surface-400 shrink-0">Already in</span>
            ) : invited ? (
                <span className="text-xs font-semibold text-success shrink-0">Invited</span>
            ) : (
                <Button size="sm" variant="secondary" loading={isPending} onClick={handleInvite} className="gap-1 shrink-0">
                    <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                    Invite
                </Button>
            )}
        </div>
    );
}

export function InviteChallengeModal({ challenge, open, onClose }: Props) {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 300);
    const trimmed = debouncedQuery.trim();
    const canSearch = trimmed.length >= 2;

    const { data: results, isLoading, isFetching } = useSearchSocialUsers(canSearch ? trimmed : '', { pageSize: 15 });
    const { data: leaderboard } = useChallengeLeaderboard(open ? challenge.id : null, { pageSize: 100 });

    const excludeUserIds = useMemo(() => {
        const set = new Set<string>([challenge.creator.userId]);
        for (const entry of leaderboard?.items ?? []) set.add(entry.userId);
        return set;
    }, [leaderboard, challenge.creator.userId]);

    // Reset the search only after the close animation finishes, so results
    // don't visibly clear while the panel is fading out.
    useEffect(() => {
        if (open) return;
        const timeout = setTimeout(() => setQuery(''), 200);
        return () => clearTimeout(timeout);
    }, [open]);

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-lg" className="max-h-[92dvh] sm:max-h-[88dvh] flex flex-col" labelledBy="invite-challenge-title">
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 id="invite-challenge-title" className="flex-1 text-base font-bold text-foreground">Invite people</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-5 pt-2 pb-1 shrink-0">
                    <div className="flex items-center gap-2 h-11 px-4 rounded-xl bg-surface-50 border border-surface-200">
                        <Search className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />
                        <input
                            autoFocus
                            type="text"
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Search people…"
                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none min-w-0"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-3 pb-5 pt-1">
                    {!canSearch ? (
                        <p className="text-sm text-surface-400 text-center py-10">Search for someone to invite.</p>
                    ) : isLoading || isFetching ? (
                        <ResultsSkeleton />
                    ) : !results || results.length === 0 ? (
                        <EmptyState icon={Search} title="No people found" className="py-10" />
                    ) : (
                        results.map(user => (
                            <ResultRow key={user.id} user={user} challengeId={challenge.id} alreadyIn={excludeUserIds.has(user.id)} />
                        ))
                    )}
                </div>
        </Modal>
    );
}
