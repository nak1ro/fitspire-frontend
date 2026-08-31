'use client';

import { Loader2, Trophy, X } from 'lucide-react';
import { usePersonalRecords } from '@/features/workout/hooks/usePersonalRecords';
import { getTypeConfig } from '@/features/workout/typeConfig';
import { formatMetric, formatValue } from '@/features/workout/personalRecordFormat';
import { Card, EmptyState, IconChip, Modal } from '@/shared/ui';
import { useMySharedPersonalRecordIds } from '../hooks/useSocialReads';
import type { PersonalRecord } from '@/features/workout/types';

function shortDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function RecordRow({ record, onSelect }: { record: PersonalRecord; onSelect: () => void }) {
    const { Icon, color, bg } = getTypeConfig(record.workoutType);
    const metricLabel = formatMetric(record.metric);

    return (
        <Card padding="sm" interactive onClick={onSelect} className="flex items-center gap-3">
            <IconChip icon={Icon} size="sm" color={color} bg={bg} />
            <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground truncate">{record.exerciseName ?? metricLabel}</p>
                <p className="text-xs text-surface-500 mt-0.5">
                    {record.exerciseName ? `${metricLabel} · ` : ''}{formatValue(record.value, record.unit)} · {shortDate(record.achievedAt)}
                </p>
            </div>
        </Card>
    );
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSelect: (record: PersonalRecord) => void;
}

export function AttachPersonalRecordPicker({ open, onClose, onSelect }: Props) {
    const { data: records, isLoading } = usePersonalRecords();
    const { data: sharedIds } = useMySharedPersonalRecordIds();

    const eligible = (records ?? []).filter(record => !(sharedIds ?? []).includes(record.id));

    return (
        <Modal open={open} onClose={onClose} maxWidthClassName="sm:max-w-md" className="max-h-[85dvh] flex flex-col" labelledBy="attach-pr-title">
            <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
                <h2 id="attach-pr-title" className="text-base font-bold text-foreground">Attach a personal record</h2>
                <button
                    onClick={onClose}
                    className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 pb-6 space-y-2.5">
                {isLoading && (
                    <div className="flex justify-center py-10">
                        <Loader2 className="h-5 w-5 animate-spin text-surface-400" aria-hidden="true" />
                    </div>
                )}

                {!isLoading && eligible.length === 0 && (
                    <EmptyState
                        icon={Trophy}
                        title="No records ready to share"
                        description="Set a new personal best to be able to attach it to a post."
                    />
                )}

                {eligible.map(record => (
                    <RecordRow key={record.id} record={record} onSelect={() => onSelect(record)} />
                ))}
            </div>
        </Modal>
    );
}
