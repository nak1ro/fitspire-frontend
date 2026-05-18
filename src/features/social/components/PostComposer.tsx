'use client';

import { useState, useRef } from 'react';
import { useCreatePost } from '../hooks/useSocialMutations';

export function PostComposer() {
    const [content, setContent] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const { mutate, isPending } = useCreatePost();

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
        <div className="rounded-2xl border border-surface-200 bg-surface p-4">
            <div className="flex gap-3">
                {/* Avatar placeholder */}
                <div
                    className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
                    style={{ backgroundColor: 'rgba(194,109,56,0.12)', color: '#C26D38' }}
                    aria-hidden="true"
                >
                    Me
                </div>

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
                    <button
                        onClick={handlePost}
                        disabled={isPending}
                        className="px-4 py-1.5 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                        style={{ background: 'linear-gradient(135deg, #C26D38, #EDAC76)' }}
                    >
                        {isPending ? 'Posting…' : 'Post'}
                    </button>
                </div>
            )}
        </div>
    );
}
