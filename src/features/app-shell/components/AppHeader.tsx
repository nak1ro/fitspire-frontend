'use client';

import { usePathname } from 'next/navigation';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';
import { NotificationsBell } from '@/features/notification/components/NotificationsBell';
import { UserSearch } from '@/features/social/components/UserSearch';
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
    '/coach': 'Weekly Coach',
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

                <UserSearch />

                <NotificationsBell />

                <UserMenu displayName={profile?.displayName} userName={profile?.userName} avatarUrl={profile?.profilePictureUrl} />
            </div>
        </header>
    );
}
