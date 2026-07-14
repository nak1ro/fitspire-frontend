'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Trophy } from 'lucide-react';
import { Button, EmptyState } from '@/shared/ui';
import { useDiscoverChallenges, useAvailableChallenges, useMyChallenges } from '../hooks/useChallenges';
import { ChallengeCard } from './ChallengeCard';
import { CreateChallengeModal } from './CreateChallengeModal';
import type { ChallengeResponse } from '../types';

type Tab = 'discover' | 'mine';

const ACTIVE_STATUSES = new Set(['Upcoming', 'Active', 'Finalizing']);

function ChallengesSkeleton() {
    return (
        <div className="space-y-2.5">
            {[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-surface-100 animate-pulse" />)}
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

export function ChallengesView() {
    const [tab, setTab] = useState<Tab>('discover');
    const [createOpen, setCreateOpen] = useState(false);
    const router = useRouter();

    const openChallenge = (id: string) => router.push(`/challenges/${id}`);

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <div className="flex border-b border-surface-200 flex-1">
                    {(['discover', 'mine'] as Tab[]).map(t => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            className={`px-1 mr-6 py-3 text-sm font-bold transition-colors relative capitalize ${tab === t ? 'text-primary-500' : 'text-surface-500'}`}
                        >
                            {t}
                            {tab === t && <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-gradient-primary" />}
                        </button>
                    ))}
                </div>
                <Button size="sm" onClick={() => setCreateOpen(true)} className="gap-1.5 shrink-0">
                    <Plus className="h-4 w-4" aria-hidden="true" />
                    Create
                </Button>
            </div>

            {tab === 'discover' ? <DiscoverTab onOpen={openChallenge} /> : <MineTab onOpen={openChallenge} />}

            <CreateChallengeModal open={createOpen} onClose={() => setCreateOpen(false)} />
        </>
    );
}
