'use client';

import { useEffect, useState } from 'react';
import { Loader2, Target, Trophy, X } from 'lucide-react';
import { useGoals } from '@/features/goal/hooks/useGoals';
import { Button, Card, EmptyState, IconChip, Modal } from '@/shared/ui';
import { useMySharedGoalIds } from '../hooks/useSocialReads';
import type { Goal } from '@/features/goal/types';

function shortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function GoalRow({ goal, onSelect }: { goal: Goal; onSelect: () => void }) {
    return (
        <Card padding="sm" interactive onClick={onSelect} className="flex items-center gap-3">
            <IconChip icon={Trophy} size="sm" variant="warning" />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{goal.goalTypeName}</p>
                <p className="text-xs text-surface-500 mt-0.5">
                    {goal.targetValue} {goal.unit} · {shortDate(goal.createdAt)}
                </p>
            </div>
        </Card>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (goal: Goal) => void;
}

export function AttachGoalPicker({ open, onClose, onSelect }: Props) {
    const [page, setPage] = useState(1);
    const [allItems, setAllItems] = useState<Goal[]>([]);
    const { data, isLoading, isFetching } = useGoals({ scope: 'all', status: 'Completed', page, pageSize: 20 });
    const { data: sharedIds } = useMySharedGoalIds();

    useEffect(() => {
        if (!data) return;
        setAllItems(prev => {
            const merged = page === 1 ? data.items : [...prev, ...data.items];
            const seen = new Set<string>();
            return merged.filter(item => (seen.has(item.id) ? false : (seen.add(item.id), true)));
        });
    }, [data, page]);

    const eligible = allItems.filter(goal => goal.isPublic && !(sharedIds ?? []).includes(goal.id));
    const canLoadMore = Boolean(data && data.page * data.pageSize < data.totalCount);

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-md" className="max-h-[85dvh] flex flex-col" labelledBy="attach-goal-title">
                <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                    <h2 id="attach-goal-title" className="text-base font-bold text-foreground">Attach a goal</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2.5">
                    {isLoading && page === 1 && (
                        <div className="flex justify-center py-10">
                            <Loader2 className="h-5 w-5 animate-spin text-surface-400" aria-hidden="true" />
                        </div>
                    )}

                    {!(isLoading && page === 1) && eligible.length === 0 && (
                        <EmptyState
                            icon={Target}
                            title="No goals ready to share"
                            description="Complete a public, one-off goal to be able to attach it to a post."
                        />
                    )}

                    {eligible.map(goal => (
                        <GoalRow key={goal.id} goal={goal} onSelect={() => onSelect(goal)} />
                    ))}

                    {canLoadMore && (
                        <Button
                            variant="secondary"
                            size="sm"
                            fullWidth
                            loading={isFetching}
                            onClick={() => setPage(p => p + 1)}
                        >
                            Load more
                        </Button>
                    )}
                </div>
        </Modal>
    );
}
