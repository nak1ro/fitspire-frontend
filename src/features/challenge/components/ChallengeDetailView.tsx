'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AlertCircle, Calendar, Pencil, Target, Trophy, UserPlus, Users, XCircle } from 'lucide-react';
import { Alert, Avatar, Badge, Button, Card, IconChip } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCancelChallenge, useChallenge, useJoinChallenge, useLeaveChallenge } from '../hooks/useChallenges';
import { getMetricConfig } from '../metricConfig';
import { ChallengeInvitationsManageList } from './ChallengeInvitationsManageList';
import { ChallengeLeaderboard } from './ChallengeLeaderboard';
import { STATUS_VARIANT } from './ChallengeCard';
import { EditChallengeModal } from './EditChallengeModal';
import { InviteChallengeModal } from './InviteChallengeModal';
import { ManageParticipantsList } from './ManageParticipantsList';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function DetailSkeleton() {
    return (
        <div className="space-y-4 animate-pulse">
            <div className="h-32 rounded-2xl bg-surface-100" />
            <div className="h-11 rounded-xl bg-surface-100" />
            <div className="h-48 rounded-2xl bg-surface-100" />
        </div>
    );
}

export function ChallengeDetailView({ challengeId }: { challengeId: string }) {
    const { data: challenge, isLoading, isError } = useChallenge(challengeId);
    const { mutate: join, isPending: joining } = useJoinChallenge();
    const { mutate: leave, isPending: leaving } = useLeaveChallenge();
    const { mutate: cancel, isPending: cancelling } = useCancelChallenge();
    const [actionError, setActionError] = useState<string | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [cancelConfirming, setCancelConfirming] = useState(false);

    if (isLoading) return <DetailSkeleton />;

    if (isError || !challenge) {
        return (
            <div className="rounded-2xl border border-surface-200 bg-surface px-6 py-10 text-center">
                <p className="text-sm font-medium text-foreground">Couldn't load this challenge</p>
                <p className="text-xs text-surface-400 mt-1">It may not exist, or you don't have access to it.</p>
            </div>
        );
    }

    const metric = getMetricConfig(challenge.metricCode);
    const ModeIcon = challenge.mode === 'Target' ? Target : Trophy;
    const showResults = challenge.status === 'Completed';
    const showLeaderboard = ['Upcoming', 'Active', 'Finalizing', 'Completed'].includes(challenge.status);

    const handleJoin = () => {
        setActionError(null);
        join(challengeId, { onError: (err) => setActionError(getErrorMessage(err, 'Failed to join challenge.')) });
    };

    const handleLeave = () => {
        setActionError(null);
        leave(challengeId, { onError: (err) => setActionError(getErrorMessage(err, 'Failed to leave challenge.')) });
    };

    const handleCancel = () => {
        if (!cancelConfirming) { setCancelConfirming(true); return; }
        setActionError(null);
        cancel(challengeId, {
            onError: (err) => { setActionError(getErrorMessage(err, 'Failed to cancel challenge.')); setCancelConfirming(false); },
        });
    };

    // viewer.canManage tracks only full-edit eligibility (Upcoming), not general creator actions —
    // the creator can still edit copy, invite, and cancel while Active, so those gate on status directly.
    const canEdit = challenge.viewer.isCreator && (challenge.status === 'Upcoming' || challenge.status === 'Active');
    const canInvite = challenge.viewer.isCreator
        && (challenge.status === 'Upcoming' || (challenge.status === 'Active' && challenge.joinClosing === 'AtEnd'));
    const canCancel = challenge.viewer.isCreator && (challenge.status === 'Upcoming' || challenge.status === 'Active');
    const canManageParticipants = challenge.viewer.isCreator && challenge.status === 'Upcoming';

    return (
        <div className="space-y-5">
            <Card padding="md" className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                        <IconChip icon={metric.Icon} color={metric.color} bg={metric.bg} />
                        <div className="min-w-0">
                            <h1 className="text-lg font-extrabold text-foreground leading-tight">{challenge.title}</h1>
                            <p className="text-xs text-surface-400 mt-0.5">{metric.label}</p>
                        </div>
                    </div>
                    <Badge variant={STATUS_VARIANT[challenge.status]} size="sm">
                        {challenge.status}
                    </Badge>
                </div>

                {challenge.description && (
                    <p className="text-sm text-surface-600 leading-relaxed">{challenge.description}</p>
                )}

                <Link href={`/profile/${challenge.creator.userId}`} className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                    <Avatar displayName={challenge.creator.displayName} userName={challenge.creator.userName} avatarUrl={challenge.creator.profilePictureUrl} size="xs" />
                    <p className="text-xs text-surface-500">
                        Created by <span className="font-semibold text-foreground">{challenge.creator.displayName}</span>
                    </p>
                </Link>

                <div className="flex items-center gap-4 pt-2 border-t border-surface-100">
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                        <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
                        {formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {challenge.participantsCount}/{challenge.participantLimit}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-surface-500">
                        <ModeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        {challenge.mode === 'Target' ? `${challenge.targetValue} ${metric.unit}` : 'Leaderboard'}
                    </div>
                </div>
            </Card>

            {!challenge.viewer.isCreator && (
                <>
                    {challenge.viewer.membershipStatus === 'Joined' ? (
                        <Button variant="secondary" fullWidth loading={leaving} onClick={handleLeave}>
                            Leave challenge
                        </Button>
                    ) : challenge.viewer.canJoin ? (
                        <Button fullWidth loading={joining} onClick={handleJoin}>
                            Join challenge
                        </Button>
                    ) : (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-surface-100 text-sm text-surface-500">
                            <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                            {challenge.participantsCount >= challenge.participantLimit ? 'This challenge is full.' : 'Joining is closed.'}
                        </div>
                    )}
                </>
            )}

            {challenge.viewer.isCreator && (canEdit || canInvite || canCancel) && (
                <div className="flex items-center gap-2 flex-wrap">
                    {canEdit && (
                        <button
                            onClick={() => setEditOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                        >
                            <Pencil className="h-3.5 w-3.5" aria-hidden="true" />
                            Edit
                        </button>
                    )}
                    {canInvite && (
                        <button
                            onClick={() => setInviteOpen(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground transition-all"
                        >
                            <UserPlus className="h-3.5 w-3.5" aria-hidden="true" />
                            Invite
                        </button>
                    )}
                    {canCancel && (
                        <button
                            onClick={handleCancel}
                            disabled={cancelling}
                            className={
                                'flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all disabled:opacity-50 ' +
                                (cancelConfirming ? 'border-error text-error bg-error/5' : 'border-surface-200 bg-surface text-surface-600 hover:bg-background hover:text-foreground')
                            }
                        >
                            <XCircle className="h-3.5 w-3.5" aria-hidden="true" />
                            {cancelConfirming ? 'Confirm cancel' : 'Cancel challenge'}
                        </button>
                    )}
                </div>
            )}

            {actionError && <Alert variant="error">{actionError}</Alert>}

            {canManageParticipants && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Manage participants</h3>
                    <ManageParticipantsList challengeId={challengeId} creatorUserId={challenge.creator.userId} />
                </div>
            )}

            {canManageParticipants && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">Pending invitations</h3>
                    <ChallengeInvitationsManageList challengeId={challengeId} />
                </div>
            )}

            {challenge.viewer.membershipStatus === 'Joined' && challenge.viewer.score != null && (
                <Card padding="sm" className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-surface-600">Your score</p>
                    <p className="text-lg font-extrabold text-foreground tabular-nums">{challenge.viewer.score}</p>
                </Card>
            )}

            {showLeaderboard && (
                <div className="space-y-2.5">
                    <h3 className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">
                        {showResults ? 'Results' : 'Leaderboard'}
                    </h3>
                    <ChallengeLeaderboard challengeId={challengeId} showResults={showResults} />
                </div>
            )}

            <EditChallengeModal challenge={challenge} open={editOpen} onClose={() => setEditOpen(false)} />
            <InviteChallengeModal challenge={challenge} open={inviteOpen} onClose={() => setInviteOpen(false)} />
        </div>
    );
}
