'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Trophy, User, Settings, Plus, Utensils, LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useUserProfile } from '@/features/user/hooks/useUserProfile';

function getInitials(displayName: string, userName: string): string {
    const name = displayName || userName;
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.slice(0, 2).toUpperCase();
}

const NAV_ITEMS = [
    { href: '/feed',       label: 'Feed',       Icon: Home },
    { href: '/workouts',   label: 'Workouts',   Icon: Dumbbell },
    { href: '/nutrition',  label: 'Nutrition',  Icon: Utensils },
    { href: '/challenges', label: 'Challenges', Icon: Trophy },
    { href: '/profile',    label: 'Profile',    Icon: User },
] as const;

interface SidebarProps {
    onLogWorkout?: () => void;
}

export function Sidebar({ onLogWorkout }: SidebarProps) {
    const pathname = usePathname();
    const { data: profile } = useUserProfile();
    const initials = profile ? getInitials(profile.displayName, profile.userName) : '…';

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="hidden lg:flex flex-col w-60 h-full shrink-0 border-r border-surface-200 bg-surface">

            {/* Wordmark */}
            <div className="h-14 flex items-center px-5 border-b border-surface-200 shrink-0">
                <Link
                    href="/feed"
                    className="text-xl font-bold tracking-tight text-foreground hover:opacity-60 transition-opacity"
                >
                    Fitspire
                </Link>
            </div>

            {/* Log Workout CTA */}
            <div className="px-3 pt-4 pb-2 shrink-0">
                <button
                    onClick={onLogWorkout}
                    className="w-full flex items-center justify-center gap-2 h-10 rounded-xl text-sm font-semibold text-white transition-opacity hover:opacity-90 active:opacity-80"
                    style={{ background: 'linear-gradient(135deg, #059669 0%, #34D399 100%)' }}
                >
                    <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Log Workout
                </button>
            </div>

            {/* Primary nav */}
            <nav className="flex-1 px-3 py-1 space-y-0.5 overflow-y-auto" aria-label="Main navigation">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all"
                            style={{
                                backgroundColor: active ? 'rgba(5,150,105,0.08)' : undefined,
                                color: active ? '#059669' : 'var(--color-surface-600)',
                            }}
                        >
                            <Icon
                                className="h-[18px] w-[18px] shrink-0"
                                style={{ color: active ? '#059669' : 'var(--color-surface-500)' }}
                                aria-hidden="true"
                            />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Bottom section — settings + user + sign out */}
            <div className="shrink-0 border-t border-surface-200 px-3 pt-3 pb-3 space-y-0.5">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all"
                    style={{
                        backgroundColor: isActive('/settings') ? 'rgba(5,150,105,0.08)' : undefined,
                        color: isActive('/settings') ? '#059669' : 'var(--color-surface-600)',
                    }}
                >
                    <Settings
                        className="h-[18px] w-[18px] shrink-0"
                        style={{ color: isActive('/settings') ? '#059669' : 'var(--color-surface-500)' }}
                        aria-hidden="true"
                    />
                    Settings
                </Link>

                <button
                    onClick={() => signOut({ callbackUrl: '/' })}
                    className="w-full flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all text-left"
                    style={{ color: 'var(--color-surface-500)' }}
                >
                    <LogOut className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                    Sign out
                </button>

                {/* User chip */}
                <Link
                    href="/profile"
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl mt-1 transition-opacity hover:opacity-80"
                    style={{ backgroundColor: 'rgba(5,150,105,0.04)' }}
                >
                    <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{ backgroundColor: 'rgba(5,150,105,0.12)', color: '#059669' }}
                    >
                        {initials}
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-foreground truncate leading-tight">
                            {profile?.displayName ?? '…'}
                        </p>
                        <p className="text-[10px] truncate leading-tight" style={{ color: 'var(--color-surface-400)' }}>
                            @{profile?.userName ?? '…'}
                        </p>
                    </div>
                </Link>
            </div>
        </aside>
    );
}
