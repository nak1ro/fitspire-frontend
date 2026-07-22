'use client';

import { useMemo, useState } from 'react';
import { Plus, Scale } from 'lucide-react';
import { Button, EmptyState } from '@/shared/ui';
import { useBodyCheckIns, useBodyCheckInSummary } from '../hooks/useBodyCheckIns';
import { CheckInSummaryCard } from './CheckInSummaryCard';
import { CheckInCard } from './CheckInCard';
import { CheckInFormModal } from './CheckInFormModal';
import type { BodyCheckIn } from '../types';

function toISODate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function daysAgo(days: number): string {
    const d = new Date();
    d.setDate(d.getDate() - days);
    return toISODate(d);
}

function groupByMonth(checkIns: BodyCheckIn[]) {
    const groups = new Map<string, BodyCheckIn[]>();
    for (const c of checkIns) {
        const [y, m] = c.checkInDate.split('-').map(Number);
        const key = new Date(y, m - 1, 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(c);
    }
    return Array.from(groups.entries()).map(([label, items]) => ({ label, items }));
}

export function BodyTrackingTab() {
    const [addOpen, setAddOpen] = useState(false);
    const [editingCheckIn, setEditingCheckIn] = useState<BodyCheckIn | null>(null);

    const { data: summary, isLoading: loadingSummary } = useBodyCheckInSummary({ from: daysAgo(90), to: toISODate(new Date()) });
    const { data: history, isLoading } = useBodyCheckIns({ pageSize: 100 });

    const grouped = useMemo(() => groupByMonth(history?.items ?? []), [history]);

    return (
        <div className="space-y-6">
            <CheckInSummaryCard summary={summary} isLoading={loadingSummary} />

            <Button onClick={() => setAddOpen(true)} fullWidth className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New check-in
            </Button>

            {isLoading ? (
                <div className="space-y-2.5">
                    {[1, 2, 3].map(i => <div key={i} className="h-16 rounded-2xl bg-surface-100 animate-pulse" />)}
                </div>
            ) : grouped.length === 0 ? (
                <EmptyState icon={Scale} title="No check-ins yet" description="Log your weight, measurements, or how you're feeling to start tracking." />
            ) : (
                grouped.map(group => (
                    <div key={group.label} className="space-y-2.5">
                        <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">{group.label}</h3>
                        <div className="space-y-2.5">
                            {group.items.map(c => (
                                <CheckInCard key={c.id} checkIn={c} onClick={() => setEditingCheckIn(c)} />
                            ))}
                        </div>
                    </div>
                ))
            )}

            <CheckInFormModal
                open={addOpen || Boolean(editingCheckIn)}
                onClose={() => { setAddOpen(false); setEditingCheckIn(null); }}
                checkIn={editingCheckIn}
                defaultDate={toISODate(new Date())}
            />
        </div>
    );
}
