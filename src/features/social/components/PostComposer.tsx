'use client';

import { useState, useRef } from 'react';
import { useCreatePost } from '../hooks/useSocialMutations';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { Avatar, Button, Card } from '@/shared/ui';

export function PostComposer() {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { mutate, isPending } = useCreatePost();
    const { data: profile } = useUserProfile();

    const handlePost = () => {
        const trimmed = content.trim();
        if (!trimmed) return;
        mutate({ content: trimmed }, {
            onSuccess: () => setContent(''),
        });
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
            handlePost();
        }
    };

    const hasContent = content.trim().length > 0;

    return (
        <Card padding="md">
            <div className="flex gap-3">
                <Avatar
                    displayName={profile?.displayName ?? ''}
                    userName={profile?.userName ?? '...'}
                    avatarUrl={profile?.profilePictureUrl}
                    size="sm"
                    className="mt-0.5"
                />

                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Share a workout, milestone, or thought…"
                    rows={hasContent ? 3 : 1}
                    className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none leading-relaxed transition-all"
                />
            </div>

            {hasContent && (
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-surface-100">
                    <span className="text-[11px] text-surface-400">⌘ + Enter to post</span>
                    <Button onClick={handlePost} loading={isPending} size="sm">
                        Post
                    </Button>
                </div>
            )}
        </Card>
    );
}
