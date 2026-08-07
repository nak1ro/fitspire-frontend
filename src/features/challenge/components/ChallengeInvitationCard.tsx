'use client';

import { useState } from 'react';
import { Check, Mail, X } from 'lucide-react';
import { Alert, Button, Card, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useAcceptChallengeInvitation, useRejectChallengeInvitation } from '../hooks/useChallenges';
import type { ChallengeInvitation } from '../types';

function formatDateRange(startDate: string, endDate: string): string {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', opts);
    const end = new Date(endDate).toLocaleDateString('en-US', opts);
    return `${start} – ${end}`;
}

export function ChallengeInvitationCard({
    invitation,
    onOpen,
}: {
    invitation: ChallengeInvitation;
    onOpen: (challengeId: string) => void;
}) {
    const { mutate: accept, isPending: accepting } = useAcceptChallengeInvitation();
    const { mutate: reject, isPending: rejecting } = useRejectChallengeInvitation();
    const [error, setError] = useState<string | null>(null);

    const handleAccept = () => {
        setError(null);
        accept(invitation.id, { onError: (err) => setError(getErrorMessage(err, 'Failed to accept invitation.')) });
    };

    const handleReject = () => {
        setError(null);
        reject(invitation.id, { onError: (err) => setError(getErrorMessage(err, 'Failed to decline invitation.')) });
    };

    return (
        <Card padding="sm" className="space-y-3">
            <button
                onClick={() => onOpen(invitation.challengeId)}
                className="flex items-start gap-2.5 min-w-0 w-full text-left"
            >
                <IconChip icon={Mail} size="sm" />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{invitation.challengeTitle}</p>
                    <p className="text-xs text-surface-400 leading-tight mt-0.5">
                        {formatDateRange(invitation.startDate, invitation.endDate)}
                    </p>
                    <p className="text-xs text-surface-500 mt-1">
                        Invited by <span className="font-semibold text-foreground">{invitation.invitedByDisplayName}</span>
                    </p>
                </div>
            </button>

            {error && <Alert variant="error">{error}</Alert>}

            <div className="flex items-center gap-2">
                <Button size="sm" fullWidth loading={accepting} disabled={rejecting} onClick={handleAccept} className="gap-1.5">
                    <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    Accept
                </Button>
                <Button
                    size="sm"
                    variant="secondary"
                    fullWidth
                    loading={rejecting}
                    disabled={accepting}
                    onClick={handleReject}
                    className="gap-1.5"
                >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    Decline
                </Button>
            </div>
        </Card>
    );
}
