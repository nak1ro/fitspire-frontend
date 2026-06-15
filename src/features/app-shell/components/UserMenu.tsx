'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, Settings, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';

function getInitials(displayName: string, userName: string): string {
    const name = displayName || userName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

interface UserMenuProps {
    displayName?: string;
    userName?: string;
}

export function UserMenu({ displayName, userName }: UserMenuProps) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const initials = displayName && userName ? getInitials(displayName, userName) : '...';

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
                className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-opacity hover:opacity-80 bg-primary-100 text-primary-600"
            >
                {initials}
            </button>

            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-surface-200 bg-background p-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow-panel)' }}
                >
                    <Link
                        href="/profile"
                        role="menuitem"
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors"
                    >
                        <User className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Profile
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
                        onClick={() => signOut({ callbackUrl: '/' })}
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
