'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, ChevronLeft, Loader2, Send, Trash2 } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import type { ApiError } from '@/shared/types';
import { getCoachMessages } from '../api/client';
import {
    useCoachThread,
    useCoachMessages,
    useUpdateCoachThread,
    useDeleteCoachThread,
    useSendCoachMessage,
    useRetryCoachMessage,
} from '../hooks/useCoachInteractions';
import { CoachMarkdown } from './CoachMarkdown';
import type { CoachMessage } from '../types';

const MAX_LENGTH = 2000;

function formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function formatRetryAfter(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.ceil((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
}

function ThreadHeader({ threadId, title, onBack }: { threadId: string; title: string; onBack: () => void }) {
    const router = useRouter();
    const [titleDraft, setTitleDraft] = useState(title);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { mutate: updateThread } = useUpdateCoachThread();
    const { mutateAsync: deleteThread, isPending: deleting } = useDeleteCoachThread();

    const handleBlur = () => {
        const trimmed = titleDraft.trim();
        if (!trimmed || trimmed === title) { setTitleDraft(title); return; }
        updateThread({ threadId, data: { title: trimmed } });
    };

    const handleDelete = async () => {
        if (!confirmDelete) { setConfirmDelete(true); return; }
        setError(null);
        try {
            await deleteThread(threadId);
            router.push('/coach?tab=chat');
        } catch (err) {
            setError(getErrorMessage(err, 'Failed to delete conversation.'));
            setConfirmDelete(false);
        }
    };

    return (
        <div className="shrink-0 border-b border-surface-200">
            <div className="flex items-center gap-2 px-3 py-2.5">
                <button
                    type="button"
                    onClick={onBack}
                    aria-label="Back to conversations"
                    className="flex items-center justify-center h-9 w-9 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all shrink-0"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <input
                    value={titleDraft}
                    onChange={e => setTitleDraft(e.target.value)}
                    onBlur={handleBlur}
                    maxLength={100}
                    className="flex-1 min-w-0 text-sm font-bold text-foreground bg-transparent outline-none rounded-lg px-1.5 py-1 focus:bg-surface-100"
                    aria-label="Conversation title"
                />
                <button
                    type="button"
                    onClick={handleDelete}
                    disabled={deleting}
                    aria-label="Delete conversation"
                    className="flex items-center justify-center h-9 w-9 rounded-xl text-surface-500 hover:text-error hover:bg-surface-100 transition-all shrink-0 disabled:opacity-50"
                >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
            {confirmDelete && (
                <div className="px-3 pb-2.5 flex items-center gap-2 text-xs text-surface-500">
                    <AlertTriangle className="h-3.5 w-3.5 text-error shrink-0" aria-hidden="true" />
                    <span>Tap delete again to confirm — this can&apos;t be undone.</span>
                </div>
            )}
            {error && <div className="px-3 pb-2.5"><Alert variant="error">{error}</Alert></div>}
        </div>
    );
}

function UserBubble({ message }: { message: CoachMessage }) {
    return (
        <div className="flex justify-end">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary-500 text-white px-4 py-2.5">
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                <p className="text-[10px] text-white/70 mt-1 text-right">{formatTime(message.requestedAt)}</p>
            </div>
        </div>
    );
}

function AssistantBubble({ message, threadId }: { message: CoachMessage; threadId: string }) {
    const { mutate: retry, isPending: retrying } = useRetryCoachMessage(threadId);

    if (message.status === 'Pending' || message.status === 'Processing') {
        return (
            <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-surface-100 px-4 py-2.5 flex items-center gap-2">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-surface-500" aria-hidden="true" />
                    <p className="text-sm text-surface-500">Coach is thinking…</p>
                </div>
            </div>
        );
    }

    if (message.status === 'Failed') {
        return (
            <div className="flex justify-start">
                <div className="max-w-[85%] space-y-2">
                    <Alert variant="error">{message.failureMessage ?? 'Failed to generate a reply.'}</Alert>
                    {message.canRetry && (
                        <Button size="sm" variant="secondary" loading={retrying} onClick={() => retry(message.id)}>
                            Retry
                        </Button>
                    )}
                </div>
            </div>
        );
    }

    const answer = message.answer;
    if (!answer) return null;

    return (
        <div className="flex justify-start">
            <div className="max-w-[85%] space-y-2.5">
                <div className="rounded-2xl rounded-bl-md bg-surface-100 px-4 py-3">
                    <CoachMarkdown>{answer.answerMarkdown}</CoachMarkdown>
                </div>

                {answer.suggestedActions.length > 0 && (
                    <div className="space-y-1.5">
                        {answer.suggestedActions.map((action, i) => (
                            <div key={i} className="rounded-xl bg-primary-50 px-3.5 py-2.5">
                                <p className="text-xs font-bold text-foreground">{action.title}</p>
                                <p className="text-xs text-surface-600 leading-relaxed mt-0.5">{action.description}</p>
                            </div>
                        ))}
                    </div>
                )}

                {answer.dataLimitations.length > 0 && (
                    <div className="space-y-0.5 px-1">
                        {answer.dataLimitations.map((limitation, i) => (
                            <p key={i} className="text-[11px] text-surface-400 leading-relaxed">{limitation}</p>
                        ))}
                    </div>
                )}

                <p className="text-[10px] text-surface-400 leading-relaxed px-1">{answer.wellnessDisclaimer}</p>
            </div>
        </div>
    );
}

export function CoachChatView({ threadId }: { threadId: string }) {
    const router = useRouter();
    const { accessToken } = useAuthSession();
    const { data: thread, isLoading: threadLoading } = useCoachThread(threadId);
    const { data: history, isLoading: messagesLoading } = useCoachMessages(threadId, { pageSize: 30 });
    const { mutateAsync: sendMessage, isPending: sending } = useSendCoachMessage(threadId);

    const [content, setContent] = useState('');
    const [pendingRequestId, setPendingRequestId] = useState<string | null>(null);
    const [sendError, setSendError] = useState<string | null>(null);
    const [olderMessages, setOlderMessages] = useState<CoachMessage[]>([]);
    const [loadingOlder, setLoadingOlder] = useState(false);
    const [nextBeforeSequence, setNextBeforeSequence] = useState<number | null | undefined>(undefined);

    const goBack = () => router.push('/coach?tab=chat');

    const items = [...olderMessages, ...(history?.items ?? [])].sort((a, b) => a.sequenceNumber - b.sequenceNumber);
    const cursor = nextBeforeSequence === undefined ? history?.nextBeforeSequence : nextBeforeSequence;
    const isGenerating = items.some(m => m.status === 'Pending' || m.status === 'Processing');

    const handleLoadOlder = async () => {
        if (!cursor) return;
        setLoadingOlder(true);
        try {
            const older = await getCoachMessages(requireAccessToken(accessToken), threadId, { beforeSequence: cursor, pageSize: 30 });
            setOlderMessages(prev => [...older.items, ...prev]);
            setNextBeforeSequence(older.nextBeforeSequence ?? null);
        } catch {
            // silently ignore — user can retry the button
        } finally {
            setLoadingOlder(false);
        }
    };

    const handleSend = async (retryId?: string) => {
        const trimmed = content.trim();
        if (!trimmed || isGenerating || sending) return;
        setSendError(null);
        const requestId = retryId ?? crypto.randomUUID();
        setPendingRequestId(requestId);
        try {
            await sendMessage({ content: trimmed, clientRequestId: requestId });
            setContent('');
            setPendingRequestId(null);
        } catch (err) {
            const apiErr = err as Partial<ApiError>;
            if (apiErr?.status === 429) {
                const wait = apiErr.retryAfterSeconds != null ? ` Try again in ${formatRetryAfter(apiErr.retryAfterSeconds)}.` : '';
                setSendError(`You've reached today's question limit.${wait}`);
            } else if (apiErr?.status === 409) {
                setSendError('The coach is still answering your last question.');
            } else if (apiErr?.status === 503) {
                setSendError('AI coach is temporarily unavailable. Please try again shortly.');
            } else {
                setSendError(getErrorMessage(err, 'Failed to send your question.'));
            }
        }
    };

    if (threadLoading || !thread) {
        return (
            <div className="flex-1 flex flex-col animate-pulse">
                <div className="h-14 border-b border-surface-200 shrink-0" />
                <div className="flex-1 p-4 space-y-3">
                    <div className="h-12 w-2/3 rounded-2xl bg-surface-100 ml-auto" />
                    <div className="h-16 w-3/4 rounded-2xl bg-surface-100" />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full">
            <ThreadHeader threadId={threadId} title={thread.title} onBack={goBack} />

            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                {cursor && (
                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={handleLoadOlder}
                            disabled={loadingOlder}
                            className="text-xs font-semibold text-primary-600 hover:opacity-70 transition-opacity disabled:opacity-50"
                        >
                            {loadingOlder ? 'Loading…' : 'Load earlier messages'}
                        </button>
                    </div>
                )}

                {messagesLoading && items.length === 0 && (
                    <div className="space-y-3">
                        <div className="h-12 w-2/3 rounded-2xl bg-surface-100 ml-auto animate-pulse" />
                        <div className="h-16 w-3/4 rounded-2xl bg-surface-100 animate-pulse" />
                    </div>
                )}

                {items.map(message => (
                    message.role === 'User'
                        ? <UserBubble key={message.id} message={message} />
                        : <AssistantBubble key={message.id} message={message} threadId={threadId} />
                ))}
            </div>

            <div className="shrink-0 border-t border-surface-200 p-3 space-y-2">
                {sendError && <Alert variant="error">{sendError}</Alert>}
                {isGenerating && !sendError && (
                    <p className="text-xs text-surface-400 px-1">Waiting for the coach to finish answering…</p>
                )}
                <div className="flex items-end gap-2">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value.slice(0, MAX_LENGTH))}
                        placeholder="Ask about your training, recovery, goals, or nutrition…"
                        rows={2}
                        disabled={isGenerating}
                        onKeyDown={e => {
                            if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
                        }}
                        className="flex-1 text-sm bg-surface-50 border border-surface-200 rounded-xl px-3.5 py-2.5 outline-none resize-none text-foreground placeholder:text-surface-400 focus:bg-primary-50 focus:border-primary-500 disabled:opacity-60"
                    />
                    <Button
                        size="md"
                        loading={sending}
                        disabled={!content.trim() || isGenerating}
                        onClick={() => handleSend(sendError ? pendingRequestId ?? undefined : undefined)}
                        aria-label="Send"
                    >
                        <Send className="h-4 w-4" aria-hidden="true" />
                    </Button>
                </div>
                <p className="text-[10px] text-surface-400 px-1">{content.length}/{MAX_LENGTH}</p>
            </div>
        </div>
    );
}
