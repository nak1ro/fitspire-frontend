'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, X } from 'lucide-react';
import { Avatar, Button, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCancelChallengeInvitation, useSentChallengeInvitations } from '../hooks/useChallenges';

function Row({ invitationId, userId, displayName, avatarUrl }: {
    invitationId: string;
    userId: string;
    displayName: string;
    avatarUrl?: string | null;
}) {
    const [confirming, setConfirming] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: cancel, isPending } = useCancelChallengeInvitation();

    const handleCancel = () => {
        if (!confirming) { setConfirming(true); return; }
        setError(null);
        cancel(
            invitationId,
            { onError: (err) => { setError(getErrorMessage(err, 'Failed to cancel invitation.')); setConfirming(false); } }
        );
    };

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
            <Link href={`/profile/${userId}`} className="flex items-center gap-3 min-w-0 flex-1 hover:opacity-80 transition-opacity">
                <Avatar displayName={displayName} userName={displayName} avatarUrl={avatarUrl} size="sm" />
                <p className="text-sm font-semibold text-foreground leading-tight truncate min-w-0">{displayName}</p>
            </Link>
            <div className="flex flex-col items-end gap-1 shrink-0">
                <Button
                    size="sm"
                    variant={confirming ? 'danger' : 'secondary'}
                    loading={isPending}
                    onClick={handleCancel}
                    className="gap-1"
                >
                    <X className="h-3.5 w-3.5" aria-hidden="true" />
                    {confirming ? 'Confirm' : 'Cancel'}
                </Button>
                {error && <p className="text-xs text-error">{error}</p>}
            </div>
        </div>
    );
}

export function ChallengeInvitationsManageList({ challengeId }: { challengeId: string }) {
    const { data, isLoading } = useSentChallengeInvitations(challengeId, { pageSize: 100 });
    const items = data?.items ?? [];

    if (isLoading) {
        return (
            <div className="space-y-2 px-1">
                {[1, 2].map(i => <div key={i} className="h-12 rounded-xl bg-surface-100 animate-pulse" />)}
            </div>
        );
    }

    if (items.length === 0) {
        return <EmptyState icon={Mail} title="No pending invitations" description="Invitations you send will show up here until they're accepted, declined, or cancelled." className="py-8" />;
    }

    return (
        <div className="space-y-0.5">
            {items.map(invitation => (
                <Row
                    key={invitation.id}
                    invitationId={invitation.id}
                    userId={invitation.invitedUserId}
                    displayName={invitation.invitedUserDisplayName}
                    avatarUrl={invitation.invitedUserAvatarUrl}
                />
            ))}
        </div>
    );
}
