'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { Alert, Button, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUpdateActiveChallengeCopy, useUpdateChallenge } from '../hooks/useChallenges';
import { getMetricConfig } from '../metricConfig';
import type { ChallengeDetail, ChallengeJoinClosing, ChallengeMode, ChallengeVisibility } from '../types';

interface Props {
    challenge: ChallengeDetail;
    open: boolean;
    onClose: () => void;
}

function toDateInputValue(iso: string): string {
    const d = new Date(iso);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function today(): string {
    return toDateInputValue(new Date().toISOString());
}

function addDaysToDate(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return toDateInputValue(date.toISOString());
}

// See CreateChallengeModal.tsx for why "today" needs the current instant rather than local midnight.
function toDateInstant(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (dateStr === today()) return new Date().toISOString();
    return new Date(y, m - 1, d).toISOString();
}

const fieldToggleClass = (active: boolean, textSize: string = 'text-sm') =>
    `flex-1 py-2.5 rounded-xl ${textSize} font-semibold border transition-all ` +
    (active ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100');

function CopyForm({ challenge, onSuccess }: { challenge: ChallengeDetail; onSuccess: () => void }) {
    const [title, setTitle] = useState(challenge.title);
    const [description, setDescription] = useState(challenge.description ?? '');
    const [error, setError] = useState<string | null>(null);
    const { mutateAsync, isPending } = useUpdateActiveChallengeCopy();

    const handleSubmit = async () => {
        setError(null);
        if (!title.trim()) { setError('Enter a title.'); return; }
        try {
            await mutateAsync({ challengeId: challenge.id, data: { title: title.trim(), description: description.trim() || null } });
            onSuccess();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to update challenge.'));
        }
    };

    return (
        <div className="space-y-4">
            <p className="text-xs text-surface-400">This challenge is active — only the title and description can change now.</p>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={120}
                    className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:bg-primary-50 focus:border-primary-500"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Description <span className="text-surface-400 font-normal">(optional)</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={3}
                    maxLength={1000}
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500"
                />
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Save changes
            </Button>
        </div>
    );
}

function FullForm({ challenge, onSuccess }: { challenge: ChallengeDetail; onSuccess: () => void }) {
    const metric = getMetricConfig(challenge.metricCode);
    const [title, setTitle] = useState(challenge.title);
    const [description, setDescription] = useState(challenge.description ?? '');
    const [mode, setMode] = useState<ChallengeMode>(challenge.mode);
    const [targetValue, setTargetValue] = useState(challenge.targetValue?.toString() ?? '');
    const [visibility, setVisibility] = useState<ChallengeVisibility>(challenge.visibility);
    const [startDate, setStartDate] = useState(toDateInputValue(challenge.startDate));
    const [endDate, setEndDate] = useState(toDateInputValue(challenge.endDate));
    const [joinClosing, setJoinClosing] = useState<ChallengeJoinClosing>(challenge.joinClosing);
    const [participantLimit, setParticipantLimit] = useState(challenge.participantLimit.toString());
    const [error, setError] = useState<string | null>(null);
    const { mutateAsync, isPending } = useUpdateChallenge();

    const handleSubmit = async () => {
        setError(null);
        if (!title.trim()) { setError('Enter a title.'); return; }
        if (mode === 'Target' && (!targetValue || Number(targetValue) <= 0)) { setError('Enter a target value.'); return; }
        if (endDate <= startDate) { setError('End date must be after the start date.'); return; }
        const limit = Number(participantLimit);
        if (!Number.isFinite(limit) || limit < 2 || limit > 100) { setError('Participant limit must be between 2 and 100.'); return; }

        try {
            await mutateAsync({
                challengeId: challenge.id,
                data: {
                    title: title.trim(),
                    description: description.trim() || null,
                    metricCode: challenge.metricCode,
                    workoutType: challenge.workoutType,
                    mode,
                    targetValue: mode === 'Target' ? Number(targetValue) : null,
                    visibility,
                    startDate: toDateInstant(startDate),
                    endDate: toDateInstant(endDate),
                    joinClosing,
                    participantLimit: limit,
                },
            });
            onSuccess();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to update challenge.'));
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2.5">
                <IconChip icon={metric.Icon} size="sm" color={metric.color} bg={metric.bg} />
                <p className="text-sm font-semibold text-foreground">{metric.label}</p>
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Title</label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    maxLength={120}
                    className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:bg-primary-50 focus:border-primary-500"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Description <span className="text-surface-400 font-normal">(optional)</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    maxLength={1000}
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Mode</label>
                <div className="flex gap-2">
                    {(['Leaderboard', 'Target'] as ChallengeMode[]).map(m => (
                        <button key={m} type="button" onClick={() => setMode(m)} className={fieldToggleClass(mode === m)}>
                            {m === 'Leaderboard' ? 'Leaderboard' : 'Target'}
                        </button>
                    ))}
                </div>
            </div>

            {mode === 'Target' && (
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Target ({metric.unit})</label>
                    <input
                        type="number"
                        min={0}
                        value={targetValue}
                        onChange={e => setTargetValue(e.target.value)}
                        className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Visibility</label>
                <div className="flex gap-2">
                    {(['Public', 'FollowersOnly', 'InviteOnly'] as ChallengeVisibility[]).map(v => (
                        <button key={v} type="button" onClick={() => setVisibility(v)} className={fieldToggleClass(visibility === v, 'text-xs sm:text-sm')}>
                            {v === 'Public' ? 'Public' : v === 'FollowersOnly' ? 'Followers only' : 'Invite only'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">Start date</label>
                    <input
                        type="date"
                        value={startDate}
                        min={today()}
                        onChange={e => {
                            const value = e.target.value;
                            setStartDate(value);
                            if (endDate <= value) setEndDate(addDaysToDate(value, 1));
                        }}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">End date</label>
                    <input
                        type="date"
                        value={endDate}
                        min={addDaysToDate(startDate, 1)}
                        onChange={e => setEndDate(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:bg-primary-50 focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Joining closes</label>
                <div className="flex gap-2">
                    {(['AtStart', 'AtEnd'] as ChallengeJoinClosing[]).map(j => (
                        <button key={j} type="button" onClick={() => setJoinClosing(j)} className={fieldToggleClass(joinClosing === j)}>
                            {j === 'AtStart' ? 'When it starts' : 'When it ends'}
                        </button>
                    ))}
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Participant limit</label>
                <input
                    type="number"
                    min={2}
                    max={100}
                    value={participantLimit}
                    onChange={e => setParticipantLimit(e.target.value)}
                    className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:bg-primary-50 focus:border-primary-500"
                />
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Save changes
            </Button>
        </div>
    );
}

export function EditChallengeModal({ challenge, open, onClose }: Props) {
    if (!open) return null;

    const isUpcoming = challenge.status === 'Upcoming';

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 className="flex-1 text-base font-bold text-foreground">Edit challenge</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1">
                    {isUpcoming ? (
                        <FullForm challenge={challenge} onSuccess={onClose} />
                    ) : (
                        <CopyForm challenge={challenge} onSuccess={onClose} />
                    )}
                </div>
            </div>
        </div>
    );
}
