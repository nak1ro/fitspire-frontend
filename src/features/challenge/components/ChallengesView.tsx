'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Plus, Trophy } from 'lucide-react';
import { Badge, Button, EmptyState, Skeleton, SkeletonCard } from '@/shared/ui';
import { useDiscoverChallenges, useAvailableChallenges, useIncomingChallengeInvitations, useMyChallenges } from '../hooks/useChallenges';
import { ChallengeCard } from './ChallengeCard';
import { ChallengeInvitationCard } from './ChallengeInvitationCard';
import { CreateChallengeModal } from './CreateChallengeModal';
import type { ChallengeResponse } from '../types';

type Tab = 'discover' | 'mine' | 'invites';

const ACTIVE_STATUSES = new Set(['Upcoming', 'Active', 'Finalizing']);

function SkeletonChallengeCard() {
    return (
        <SkeletonCard className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                    <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-3.5 w-36 rounded-full" />
                        <Skeleton className="h-2.5 w-24 rounded-full" />
                    </div>
                </div>
                <Skeleton className="h-4 w-14 rounded-full shrink-0" />
            </div>
            <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-24 rounded-full" />
                <Skeleton className="h-3 w-16 rounded-full" />
            </div>
        </SkeletonCard>
    );
}

function ChallengesSkeleton() {
    return (
        <div className="space-y-2.5" aria-label="Loading challenges" aria-busy="true">
            <SkeletonChallengeCard />
            <SkeletonChallengeCard />
            <SkeletonChallengeCard />
        </div>
    );
}

function DiscoverTab({ onOpen }: { onOpen: (id: string) => void }) {
    const { data: discover, isLoading: loadingDiscover } = useDiscoverChallenges({ pageSize: 30 });
    const { data: available, isLoading: loadingAvailable } = useAvailableChallenges({ pageSize: 30 });

    const isLoading = loadingDiscover || loadingAvailable;
    const items = useMemo(() => {
        const seen = new Set<string>();
        const merged: ChallengeResponse[] = [];
        for (const item of [...(discover?.items ?? []), ...(available?.items ?? [])]) {
            if (seen.has(item.id)) continue;
            seen.add(item.id);
            merged.push(item);
        }
        return merged;
    }, [discover, available]);

    if (isLoading) return <ChallengesSkeleton />;

    if (items.length === 0) {
        return <EmptyState icon={Trophy} title="No challenges to discover" description="Public and followers-only challenges you can join will show up here." />;
    }

    return (
        <div className="space-y-2.5">
            {items.map(c => <ChallengeCard key={c.id} challenge={c} onClick={() => onOpen(c.id)} />)}
        </div>
    );
}

function MineTab({ onOpen }: { onOpen: (id: string) => void }) {
    const { data: mine, isLoading } = useMyChallenges({ pageSize: 50 });

    const { active, past } = useMemo(() => {
        const items = mine?.items ?? [];
        return {
            active: items.filter(c => ACTIVE_STATUSES.has(c.status)),
            past: items.filter(c => !ACTIVE_STATUSES.has(c.status)),
        };
    }, [mine]);

    if (isLoading) return <ChallengesSkeleton />;

    if (active.length === 0 && past.length === 0) {
        return <EmptyState icon={Trophy} title="No challenges yet" description="Challenges you create or join will show up here." />;
    }

    return (
        <div className="space-y-6">
            {active.length > 0 && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Active</h3>
                    <div className="space-y-2.5">
                        {active.map(c => <ChallengeCard key={c.id} challenge={c} onClick={() => onOpen(c.id)} />)}
                    </div>
                </div>
            )}
            {past.length > 0 && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Past</h3>
                    <div className="space-y-2.5">
                        {past.map(c => <ChallengeCard key={c.id} challenge={c} onClick={() => onOpen(c.id)} />)}
                    </div>
                </div>
            )}
        </div>
    );
}

function InvitesTab({ onOpen }: { onOpen: (id: string) => void }) {
    const { data, isLoading } = useIncomingChallengeInvitations({ pageSize: 50 });
    const items = data?.items ?? [];

    if (isLoading) return <ChallengesSkeleton />;

    if (items.length === 0) {
        return <EmptyState icon={Mail} title="No pending invites" description="Challenge invitations you receive will show up here." />;
    }

    return (
        <div className="space-y-2.5">
            {items.map(invitation => (
                <ChallengeInvitationCard key={invitation.id} invitation={invitation} onOpen={onOpen} />
            ))}
        </div>
    );
}

export function ChallengesView() {
    const [tab, setTab] = useState<Tab>('discover');
    const [createOpen, setCreateOpen] = useState(false);
    const router = useRouter();
    const { data: invitations } = useIncomingChallengeInvitations({ pageSize: 50 });
    const invitationCount = invitations?.totalCount ?? 0;

    const openChallenge = (id: string) => router.push(`/challenges/${id}`);

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <div className="flex border-b border-surface-200 flex-1">
                    {(['discover', 'mine', 'invites'] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`flex items-center gap-1.5 px-1 mr-6 py-3 text-sm font-bold transition-colors relative capitalize ${tab === t ? 'text-primary-500' : 'text-surface-500'}`}
                        >
                            {t}
                            {t === 'invites' && invitationCount > 0 && (
                                <Badge variant="primary" size="sm">{invitationCount}</Badge>
                            )}
                            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                        </button>
                    ))}
                </div>
                <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 shrink-0">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create
                </Button>
            </div>

            {tab === 'discover' ? (
                <DiscoverTab onOpen={openChallenge} />
            ) : tab === 'mine' ? (
                <MineTab onOpen={openChallenge} />
            ) : (
                <InvitesTab onOpen={openChallenge} />
            )}

            <CreateChallengeModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
    );
}
