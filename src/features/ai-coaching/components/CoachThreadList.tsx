'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageCircle, Plus } from 'lucide-react';
import { Alert, Button, Card, EmptyState } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useCoachThreads, useCreateCoachThread } from '../hooks/useCoachInteractions';

function formatRelative(dateStr: string): string {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const minutes = Math.floor(diffMs / 60_000);
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
}

function ViewSkeleton() {
    return (
        <div className="space-y-2.5 animate-pulse">
            <div className="h-16 rounded-2xl bg-surface-100" />
            <div className="h-16 rounded-2xl bg-surface-100" />
            <div className="h-16 rounded-2xl bg-surface-100" />
        </div>
    );
}

export function CoachThreadList() {
    const router = useRouter();
    const [actionError, setActionError] = useState<string | null>(null);
    const { data: history, isLoading } = useCoachThreads({ pageSize: 20 });
    const { mutateAsync: createThread, isPending: creating } = useCreateCoachThread();

    const handleNewThread = async () => {
        setActionError(null);
        try {
            const thread = await createThread({});
            router.push(`/coach/threads/${thread.id}`);
        } catch (err) {
            setActionError(getErrorMessage(err, 'Failed to start a new conversation.'));
        }
    };

    if (isLoading) return <ViewSkeleton />;

    const items = history?.items ?? [];

    if (items.length === 0) {
        return (
            <div className="space-y-4">
                {actionError && <Alert variant="error">{actionError}</Alert>}
                <EmptyState
                    icon={MessageCircle}
                    title="No conversations yet"
                    description="Ask the coach about your training, recovery, goals, or nutrition — it can see your recent Fitspire activity."
                    action={
                        <Button onClick={handleNewThread} loading={creating} className="gap-2">
                            <Plus className="h-4 w-4" aria-hidden="true" />
                            New question
                        </Button>
                    }
                />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {actionError && <Alert variant="error">{actionError}</Alert>}

            <Button onClick={handleNewThread} loading={creating} fullWidth className="gap-2">
                <Plus className="h-4 w-4" aria-hidden="true" />
                New question
            </Button>

            <div className="space-y-2.5">
                {items.map(item => (
                    <Card
                        key={item.id}
                        padding="sm"
                        interactive
                        onClick={() => router.push(`/coach/threads/${item.id}`)}
                        className="flex items-center justify-between gap-3"
                    >
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-foreground truncate">{item.title}</p>
                            <p className="text-xs text-surface-500 mt-0.5">
                                {item.messageCount} message{item.messageCount === 1 ? '' : 's'} · {formatRelative(item.lastActivityAt)}
                            </p>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
