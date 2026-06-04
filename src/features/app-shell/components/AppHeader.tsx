'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';

function getInitials(displayName: string, userName: string): string {
    const name = displayName || userName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

const PAGE_TITLES: Record<string, string> = {
    '/feed':       'Feed',
    '/workouts':   'Workouts',
    '/nutrition':  'Nutrition',
    '/challenges': 'Challenges',
    '/profile':    'Profile',
    '/settings':   'Settings',
};

function resolveTitle(pathname: string): string {
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
        if (pathname === path || pathname.startsWith(path + '/')) return title;
    }
    return 'Fitspire';
}

export function AppHeader() {
    const pathname = usePathname();
    const title = resolveTitle(pathname);
    const { data: profile } = useUserProfile();
    const initials = profile ? getInitials(profile.displayName, profile.userName) : '…';

    return (
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-background border-b border-surface-200">

            <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>

            <div className="flex items-center gap-1">

                {/* Search */}
                <button
                    className="p-2 rounded-xl transition-all"
                    style={{ color: 'var(--color-surface-500)' }}
                    aria-label="Search"
                >
                    <Search className="h-5 w-5" aria-hidden="true" />
                </button>

                {/* Notifications */}
                <button
                    className="relative p-2 rounded-xl transition-all"
                    style={{ color: 'var(--color-surface-500)' }}
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" aria-hidden="true" />
                    <span
                        className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full ring-2 ring-background"
                        style={{ backgroundColor: '#C26D38' }}
                        aria-hidden="true"
                    />
                </button>

                {/* Avatar — links to profile */}
                <Link
                    href="/profile"
                    className="ml-1 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'rgba(194,109,56,0.12)', color: '#C26D38' }}
                    aria-label="Go to profile"
                >
                    {initials}
                </Link>
            </div>
        </header>
    );
}
