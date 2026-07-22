'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, UserCheck } from 'lucide-react';
import { Avatar, Button, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useIncomingFollowRequests } from '../hooks/useSocialReads';
import { useAcceptFollowRequest, useRejectFollowRequest } from '../hooks/useSocialMutations';
import type { FollowRequestResponse } from '../types';

interface Props {
    open: boolean;
    onClose: () => void;
}

function RequestRow({ request, onNavigate }: { request: FollowRequestResponse; onNavigate: () => void }) {
    const { mutate: accept, isPending: isAccepting } = useAcceptFollowRequest();
    const { mutate: reject, isPending: isRejecting } = useRejectFollowRequest();
    const [error, setError] = useState<string | null>(null);
    const isBusy = isAccepting || isRejecting;

    const handleAccept = () => {
        setError(null);
        accept(request.id, { onError: (err) => setError(getErrorMessage(err, 'Failed to accept.')) });
    };

    const handleReject = () => {
        setError(null);
        reject(request.id, { onError: (err) => setError(getErrorMessage(err, 'Failed to reject.')) });
    };

    return (
        <div className="flex items-center gap-3 px-5 py-2.5">
            <Link href={`/profile/${request.userId}`} onClick={onNavigate} className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar
                    displayName={request.displayName}
                    userName={request.userName}
                    avatarUrl={request.profilePictureUrl}
                    size="sm"
                />
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-foreground leading-tight truncate">{request.displayName}</p>
                    <p className="text-xs text-surface-400 leading-tight mt-0.5">
                        {error ? <span className="text-error">{error}</span> : `@${request.userName}`}
                    </p>
                </div>
            </Link>
            <div className="flex items-center gap-1.5 shrink-0">
                <Button size="sm" variant="primary" loading={isAccepting} disabled={isBusy} onClick={handleAccept}>
                    Accept
                </Button>
                <Button size="sm" variant="secondary" loading={isRejecting} disabled={isBusy} onClick={handleReject}>
                    Reject
                </Button>
            </div>
        </div>
    );
}

function ListSkeleton() {
    return (
        <div className="py-2">
            {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-2.5 animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-surface-200 shrink-0" />
                    <div className="space-y-1.5 flex-1">
                        <div className="h-3 w-28 bg-surface-200 rounded-full" />
                        <div className="h-2.5 w-20 bg-surface-200 rounded-full" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export function FollowRequestsModal({ open, onClose }: Props) {
    const { data: requests, isLoading } = useIncomingFollowRequests({ pageSize: 50 });

    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-sm h-[70vh] sm:h-[32rem] bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden z-10 flex flex-col"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center justify-between px-5 pt-4 pb-2 shrink-0">
                    <h2 className="text-base font-bold text-foreground">Follow requests</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {isLoading ? (
                        <ListSkeleton />
                    ) : !requests || requests.length === 0 ? (
                        <EmptyState icon={UserCheck} title="No pending requests" className="py-12" />
                    ) : (
                        <div className="py-1.5 divide-y divide-surface-100">
                            {requests.map((request) => (
                                <RequestRow key={request.id} request={request} onNavigate={onClose} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
