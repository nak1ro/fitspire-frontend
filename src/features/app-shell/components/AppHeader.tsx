'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, Plus } from 'lucide-react';
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
    '/saved': 'Saved Posts',
    '/profile': 'Profile',
    '/settings': 'Settings',
    '/notifications': 'Notifications',
    '/coach': 'Coach',
    '/admin': 'Moderation',
};

function resolveTitle(pathname: string): string {
    for (const [path, title] of Object.entries(PAGE_TITLES)) {
        if (pathname === path || pathname.startsWith(path + '/')) return title;
    }
    return 'Fitspire';
}

interface AppHeaderProps {
    onLogWorkout?: () => void;
}

export function AppHeader({ onLogWorkout }: AppHeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const title = resolveTitle(pathname);
    const { data: profile } = useUserProfile();

    return (
        <header className="h-14 shrink-0 flex items-center justify-between px-6 bg-background border-b border-surface-200">

            <div className="flex items-center gap-2 min-w-0">
                <button
                    type="button"
                    onClick={() => router.back()}
                    aria-label="Go back"
                    className="flex items-center justify-center h-8 w-8 -ml-1.5 rounded-full text-surface-500 hover:bg-surface-100 hover:text-foreground transition-colors shrink-0"
                >
                    <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <h1 key={title} className="text-lg font-bold text-foreground tracking-tight truncate animate-fade-in">{title}</h1>
            </div>

            <div className="flex items-center gap-1">

                <button
                    type="button"
                    onClick={onLogWorkout}
                    aria-label="Log workout"
                    className="lg:hidden flex items-center justify-center h-9 w-9 rounded-full text-white bg-primary-500 hover:bg-primary-600 active:opacity-90 transition-colors mr-1"
                >
                    <Plus className="h-4 w-4" aria-hidden="true" />
                </button>

                <UserSearch />

                <NotificationsBell />

                <UserMenu displayName={profile?.displayName} userName={profile?.userName} avatarUrl={profile?.profilePictureUrl} />
            </div>
        </header>
    );
}
