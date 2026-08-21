'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Alert, Button, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { todayLocalDateInput } from '@/shared/lib/localDate';
import { useCreateChallenge } from '../hooks/useChallenges';
import { CHALLENGE_METRICS, type ChallengeMetricOption } from '../metricConfig';
import type { ChallengeJoinClosing, ChallengeMode, ChallengeVisibility } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
}

const today = todayLocalDateInput;

function daysFromNow(days: number): string {
    return addDaysToDate(today(), days);
}

function addDaysToDate(dateStr: string, days: number): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    date.setDate(date.getDate() + days);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

// Date <input> values are plain "YYYY-MM-DD" with no timezone, and
// `new Date(dateStr)` parses that as UTC midnight — which is already in the
// past for most timezones once any time has passed "today". Use the current
// moment when the picked date is today, and local midnight otherwise.
function toDateInstant(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    if (dateStr === today()) return new Date().toISOString();
    return new Date(y, m - 1, d).toISOString();
}

function MetricStep({ onSelect }: { onSelect: (metric: ChallengeMetricOption) => void }) {
    return (
        <div className="space-y-1.5">
            {CHALLENGE_METRICS.map(metric => (
                <button
                    key={metric.code}
                    onClick={() => onSelect(metric)}
                    className="w-full flex items-center justify-between gap-3 p-3.5 rounded-xl border border-surface-200 bg-background hover:bg-surface transition-all text-left"
                >
                    <div className="flex items-center gap-3 min-w-0">
                        <IconChip icon={metric.Icon} size="sm" color={metric.color} bg={metric.bg} />
                        <p className="text-sm font-semibold text-foreground truncate">{metric.label}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-surface-300 shrink-0" aria-hidden="true" />
                </button>
            ))}
        </div>
    );
}

function DetailsStep({ metric, onSuccess }: { metric: ChallengeMetricOption; onSuccess: () => void }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [mode, setMode] = useState<ChallengeMode>('Leaderboard');
    const [targetValue, setTargetValue] = useState('');
    const [visibility, setVisibility] = useState<ChallengeVisibility>('Public');
    const [startDate, setStartDate] = useState(today());
    const [endDate, setEndDate] = useState(daysFromNow(7));
    const [joinClosing, setJoinClosing] = useState<ChallengeJoinClosing>('AtStart');
    const [participantLimit, setParticipantLimit] = useState('100');
    const [error, setError] = useState<string | null>(null);

    const { mutateAsync: createChallenge, isPending } = useCreateChallenge();

    const handleSubmit = async () => {
        setError(null);
        if (!title.trim()) { setError('Enter a title.'); return; }
        if (mode === 'Target' && (!targetValue || Number(targetValue) <= 0)) { setError('Enter a target value.'); return; }
        if (endDate <= startDate) { setError('End date must be after the start date.'); return; }
        const limit = Number(participantLimit);
        if (!Number.isFinite(limit) || limit < 2 || limit > 100) { setError('Participant limit must be between 2 and 100.'); return; }

        try {
            await createChallenge({
                title: title.trim(),
                description: description.trim() || null,
                metricCode: metric.code,
                workoutType: metric.workoutType,
                mode,
                targetValue: mode === 'Target' ? Number(targetValue) : null,
                visibility,
                startDate: toDateInstant(startDate),
                endDate: toDateInstant(endDate),
                joinClosing,
                participantLimit: limit,
            });
            onSuccess();
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to create challenge. Please try again.'));
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
                    placeholder="30-Day Running Challenge"
                    maxLength={120}
                    className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:border-primary-500"
                />
            </div>

            <div className="space-y-1.5">
                <label className="block text-sm font-medium text-surface-700">Description <span className="text-surface-400 font-normal">(optional)</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows={2}
                    maxLength={1000}
                    className="w-full text-sm bg-surface-50 border border-surface-200 rounded-xl px-4 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:border-primary-500"
                />
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Mode</label>
                <div className="flex gap-2">
                    {(['Leaderboard', 'Target'] as ChallengeMode[]).map(m => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => setMode(m)}
                            className={
                                'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ' +
                                (mode === m ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                            }
                        >
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
                        className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:border-primary-500"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Visibility</label>
                <div className="flex gap-2">
                    {(['Public', 'FollowersOnly', 'InviteOnly'] as ChallengeVisibility[]).map(v => (
                        <button
                            key={v}
                            type="button"
                            onClick={() => setVisibility(v)}
                            className={
                                'flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all ' +
                                (visibility === v ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                            }
                        >
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
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-surface-700">End date</label>
                    <input
                        type="date"
                        value={endDate}
                        min={addDaysToDate(startDate, 1)}
                        onChange={e => setEndDate(e.target.value)}
                        className="flex h-11 w-full rounded-xl border border-surface-200 px-4 text-sm text-foreground bg-surface-50 outline-none focus:border-primary-500"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-surface-700">Joining closes</label>
                <div className="flex gap-2">
                    {(['AtStart', 'AtEnd'] as ChallengeJoinClosing[]).map(j => (
                        <button
                            key={j}
                            type="button"
                            onClick={() => setJoinClosing(j)}
                            className={
                                'flex-1 py-2.5 rounded-xl text-sm font-semibold border transition-all ' +
                                (joinClosing === j ? 'bg-primary-50 border-primary-500 text-primary-600' : 'border-surface-200 text-surface-500 hover:bg-surface-100')
                            }
                        >
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
                    className="w-full h-11 px-4 text-sm bg-surface-50 border border-surface-200 rounded-xl outline-none focus:border-primary-500"
                />
            </div>

            {error && <Alert variant="error">{error}</Alert>}

            <Button onClick={handleSubmit} loading={isPending} fullWidth>
                Create challenge
            </Button>
        </div>
    );
}

export function CreateChallengeModal({ open, onClose }: Props) {
    const [selectedMetric, setSelectedMetric] = useState<ChallengeMetricOption | null>(null);

    if (!open) return null;

    const handleClose = () => {
        onClose();
        setSelectedMetric(null);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={handleClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-lg max-h-[92dvh] sm:max-h-[88dvh] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    {selectedMetric && (
                        <button
                            onClick={() => setSelectedMetric(null)}
                            className="p-1.5 -ml-1 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                            aria-label="Back to metric selection"
                        >
                            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                        </button>
                    )}
                    <h2 className="flex-1 text-base font-bold text-foreground">
                        {selectedMetric ? 'New Challenge' : 'Choose a metric'}
                    </h2>
                    <button
                        onClick={handleClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-5 pb-5 pt-1">
                    {selectedMetric ? (
                        <DetailsStep metric={selectedMetric} onSuccess={handleClose} />
                    ) : (
                        <MetricStep onSelect={setSelectedMetric} />
                    )}
                </div>
            </div>
        </div>
    );
}
