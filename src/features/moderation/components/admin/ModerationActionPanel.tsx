'use client';

import { useState } from 'react';
import { Alert, Button, Card } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useResolveModerationReport, useRestoreModerationTarget, useUnsuspendModerationUser } from '../../hooks/useAdminModeration';
import type { AdminModerationReportDetail, AdminModerationResolutionAction } from '../../types';

interface Props {
    report: AdminModerationReportDetail;
}

const ACTION_LABELS: Record<AdminModerationResolutionAction, string> = {
    Dismiss: 'Dismiss report',
    RemoveTarget: 'Remove content',
    SuspendUser: 'Suspend account',
    RemoveTargetAndSuspendUser: 'Remove and suspend',
};

export function ModerationActionPanel({ report }: Props) {
    const [action, setAction] = useState<AdminModerationResolutionAction>('Dismiss');
    const [duration, setDuration] = useState(7);
    const [note, setNote] = useState('');
    const [confirming, setConfirming] = useState(false);
    const [followUpConfirmation, setFollowUpConfirmation] = useState<'restore' | 'unsuspend' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const resolve = useResolveModerationReport();
    const restore = useRestoreModerationTarget();
    const unsuspend = useUnsuspendModerationUser();
    const needsDuration = action === 'SuspendUser' || action === 'RemoveTargetAndSuspendUser';
    const canRemove = report.targetType !== 'Profile';

    const submitResolution = () => {
        if (!confirming) { setConfirming(true); return; }
        setError(null);
        resolve.mutate({ reportId: report.id, data: { action, moderatorNote: note.trim() || null, suspensionDurationDays: needsDuration ? duration : null } }, {
            onSuccess: () => setConfirming(false),
            onError: (requestError) => { setError(getErrorMessage(requestError, 'Could not apply this moderation action.')); setConfirming(false); },
        });
    };

    const restoreTarget = () => {
        if (followUpConfirmation !== 'restore') { setFollowUpConfirmation('restore'); return; }
        restore.mutate(report.id, { onSuccess: () => setFollowUpConfirmation(null), onError: (requestError) => { setError(getErrorMessage(requestError, 'Could not restore this target.')); setFollowUpConfirmation(null); } });
    };

    const unsuspendUser = () => {
        if (followUpConfirmation !== 'unsuspend') { setFollowUpConfirmation('unsuspend'); return; }
        unsuspend.mutate(report.id, { onSuccess: () => setFollowUpConfirmation(null), onError: (requestError) => { setError(getErrorMessage(requestError, 'Could not unsuspend this account.')); setFollowUpConfirmation(null); } });
    };

    if (report.status === 'Resolved') {
        return <Card padding="md" className="space-y-3"><h2 className="text-sm font-bold text-foreground">Follow-up actions</h2>{report.currentTarget.isRemoved && <Button variant="secondary" loading={restore.isPending} onClick={restoreTarget}>{followUpConfirmation === 'restore' ? 'Confirm restore target' : 'Restore target'}</Button>}{report.subjectSuspendedUntil && new Date(report.subjectSuspendedUntil) > new Date() && <Button variant="secondary" loading={unsuspend.isPending} onClick={unsuspendUser}>{followUpConfirmation === 'unsuspend' ? 'Confirm unsuspend account' : 'Unsuspend account'}</Button>}{followUpConfirmation && <Button variant="ghost" onClick={() => setFollowUpConfirmation(null)}>Cancel</Button>}{error && <Alert variant="error">{error}</Alert>}</Card>;
    }

    return (
        <Card padding="md" className="space-y-4">
            <div><h2 className="text-sm font-bold text-foreground">Resolve report</h2><p className="mt-1 text-xs text-surface-500">Suspension blocks account access but does not hide existing public content.</p></div>
            <select value={action} onChange={(event) => { setAction(event.target.value as AdminModerationResolutionAction); setConfirming(false); }} className="w-full rounded-xl border border-surface-200 bg-background px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500">
                <option value="Dismiss">Dismiss report</option>
                {canRemove && <option value="RemoveTarget">Remove content</option>}
                <option value="SuspendUser">Suspend account</option>
                {canRemove && <option value="RemoveTargetAndSuspendUser">Remove content and suspend account</option>}
            </select>
            {needsDuration && <label className="block text-sm font-semibold text-foreground">Suspension days<input type="number" min={1} max={365} value={duration} onChange={(event) => setDuration(Number(event.target.value))} className="mt-1.5 w-full rounded-xl border border-surface-200 bg-background px-3 py-2.5 font-normal outline-none focus:border-primary-500" /></label>}
            <label className="block text-sm font-semibold text-foreground">Internal note <span className="font-normal text-surface-400">(optional)</span><textarea value={note} onChange={(event) => setNote(event.target.value)} maxLength={1000} rows={3} className="mt-1.5 w-full resize-none rounded-xl border border-surface-200 bg-background px-3 py-2.5 font-normal outline-none focus:border-primary-500" /></label>
            {error && <Alert variant="error">{error}</Alert>}
            <Button variant={action === 'Dismiss' ? 'secondary' : 'danger'} fullWidth loading={resolve.isPending} disabled={needsDuration && (duration < 1 || duration > 365)} onClick={submitResolution}>{confirming ? `Confirm: ${ACTION_LABELS[action]}` : ACTION_LABELS[action]}</Button>
        </Card>
    );
}
