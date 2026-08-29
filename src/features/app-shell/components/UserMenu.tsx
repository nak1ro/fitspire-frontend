'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Bookmark, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { Avatar } from '@/shared/ui';

interface UserMenuProps {
    displayName?: string;
    userName?: string;
    avatarUrl?: string | null;
}

export function UserMenu({ displayName, userName, avatarUrl }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    async function handleSignOut() {
        await signOut({ redirect: false });
        window.location.assign('/');
    }

    useEffect(() => {
        if (!open) return;
        function handleOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    return (
        <div ref={ref} className="relative">
            <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-expanded={open}
                aria-haspopup="true"
                aria-label="User menu"
                className="ml-1 transition-opacity hover:opacity-80"
            >
                <Avatar displayName={displayName ?? ''} userName={userName ?? '...'} avatarUrl={avatarUrl} size="sm" />
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-surface-200 bg-background p-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow-panel)' }}
                >
                    <Link
                        href="/saved"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors"
                    >
                        <Bookmark className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Saved posts
                    </Link>
                    <Link
                        href="/settings"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors"
                    >
                        <Settings className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Settings
                    </Link>
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors text-left"
                    >
                        <LogOut className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Sign out
                    </button>
                </div>
            )}
        </div>
    );
}
