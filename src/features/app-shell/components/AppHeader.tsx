'use client';

import { usePathname } from 'next/navigation';
import { Search } from 'lucide-react';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { NotificationsBell } from '@/features/notification/components/NotificationsBell';
import { UserMenu } from './UserMenu';

const PAGE_TITLES: Record<string, string> = {
    '/feed': 'Feed',
    '/workouts': 'Workouts',
    '/goals': 'Goals',
    '/nutrition': 'Nutrition',
    '/challenges': 'Challenges',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/notifications': 'Notifications',
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

    return (
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-background border-b border-surface-200">

            <h1 className="text-lg font-bold text-foreground tracking-tight">{title}</h1>

            <div className="flex items-center gap-1">

                {/* Search — decorative for now, no backend to search against */}
                <button
                    className="p-2 rounded-xl transition-all text-surface-500 hover:bg-surface-100 hover:text-foreground"
                    aria-label="Search"
                >
                    <Search className="h-5 w-5" aria-hidden="true" />
                </button>

                <NotificationsBell />

                <UserMenu displayName={profile?.displayName} userName={profile?.userName} />
            </div>
        </header>
    );
}
