'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Avatar } from '@/shared/ui';
import { useSearchSocialUsers } from '../hooks/useSocialReads';
import type { SocialUserSummary } from '../types';

function useDebouncedValue(value: string, delayMs: number) {
    const [debounced, setDebounced] = useState(value);
    useEffect(() => {
        const timer = setTimeout(() => setDebounced(value), delayMs);
        return () => clearTimeout(timer);
    }, [value, delayMs]);
    return debounced;
}

function ResultRow({ user, onSelect }: { user: SocialUserSummary; onSelect: () => void }) {
    return (
        <button
            type="button"
            onClick={onSelect}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left hover:bg-surface-100 transition-colors"
        >
            <Avatar displayName={user.displayName} userName={user.userName} avatarUrl={user.profilePictureUrl} size="sm" />
            <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground leading-tight truncate">{user.displayName}</p>
                <p className="text-xs text-surface-400 leading-tight mt-0.5">@{user.userName}</p>
            </div>
        </button>
    );
}

export function UserSearch() {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebouncedValue(query, 300);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const router = useRouter();

    const trimmed = debouncedQuery.trim();
    const canSearch = trimmed.length >= 2;
    const { data: results, isLoading, isFetching } = useSearchSocialUsers(canSearch ? trimmed : '', { pageSize: 8 });

    useEffect(() => {
        if (!open) return;
        function handleOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setOpen(false);
            }
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleClose = () => {
        setOpen(false);
        setQuery('');
    };

    const handleSelect = (userId: string) => {
        handleClose();
        router.push(`/profile/${userId}`);
    };

    if (!open) {
        return (
            <button
                type="button"
                onClick={handleOpen}
                className="p-2 rounded-xl transition-all text-surface-500 hover:bg-surface-100 hover:text-foreground"
                aria-label="Search people"
            >
                <Search className="h-5 w-5" aria-hidden="true" />
            </button>
        );
    }

    return (
        <div ref={containerRef} className="relative">
            <div className="flex items-center gap-2 h-9 w-64 px-3 rounded-xl bg-surface-100 border border-surface-200">
                <Search className="h-4 w-4 text-surface-400 shrink-0" aria-hidden="true" />
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Escape') handleClose(); }}
                    placeholder="Search people…"
                    className="flex-1 bg-transparent text-sm text-foreground placeholder:text-surface-400 outline-none min-w-0"
                />
                <button type="button" onClick={handleClose} className="shrink-0 text-surface-400 hover:text-foreground transition-colors" aria-label="Close search">
                    <X className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>

            {query.trim().length > 0 && (
                <div
                    role="listbox"
                    className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-surface-200 bg-background p-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow-panel)' }}
                >
                    {!canSearch ? (
                        <p className="text-sm text-surface-400 text-center py-6">Keep typing…</p>
                    ) : isLoading || isFetching ? (
                        <p className="text-sm text-surface-400 text-center py-6">Searching…</p>
                    ) : !results || results.length === 0 ? (
                        <p className="text-sm text-surface-400 text-center py-6">No people found</p>
                    ) : (
                        results.map((user) => (
                            <ResultRow key={user.id} user={user} onSelect={() => handleSelect(user.id)} />
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
