'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { Alert, Button } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useUpdatePost } from '../hooks/useSocialMutations';

interface Props {
    postId: string;
    initialContent: string;
    open: boolean;
    onClose: () => void;
}

export function EditPostModal({ postId, initialContent, open, onClose }: Props) {
    const [content, setContent] = useState(initialContent);
    const [error, setError] = useState<string | null>(null);
    const { mutate: updatePost, isPending } = useUpdatePost();

    useEffect(() => {
        if (open) {
            setContent(initialContent);
            setError(null);
        }
    }, [open, initialContent]);

    if (!open) return null;

    const handleSave = () => {
        const trimmed = content.trim();
        if (!trimmed) return;
        setError(null);
        updatePost(
            { postId, data: { content: trimmed } },
            {
                onSuccess: () => onClose(),
                onError: (err) => setError(getErrorMessage(err, 'Failed to update post.')),
            }
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />

            <div
                className="relative w-full sm:max-w-lg bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden flex flex-col z-10"
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                <div className="flex items-center gap-2 px-5 pt-4 pb-1 shrink-0">
                    <h2 className="flex-1 text-base font-bold text-foreground">Edit post</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-xl text-surface-500 hover:text-foreground hover:bg-surface-100 transition-all"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="px-5 pt-3 pb-5 space-y-4">
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        rows={5}
                        maxLength={2000}
                        className="w-full resize-none rounded-xl bg-background border border-surface-200 px-4 py-3 text-sm text-foreground placeholder:text-surface-400 outline-none focus:border-primary-500 transition-colors"
                    />

                    {error && <Alert variant="error">{error}</Alert>}

                    <div className="flex gap-3">
                        <Button variant="secondary" fullWidth onClick={onClose}>
                            Cancel
                        </Button>
                        <Button fullWidth loading={isPending} disabled={!content.trim()} onClick={handleSave}>
                            Save
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
