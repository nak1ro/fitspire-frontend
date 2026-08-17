'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Target, Trophy, User, Plus, Utensils, Sparkles } from 'lucide-react';
import { Button } from '@/shared/ui';
import { cn } from '@/shared/lib/cn';
import { StreakCard } from './StreakCard';

const NAV_ITEMS = [
    { href: '/feed',       label: 'Feed',       Icon: Home },
    { href: '/workouts',   label: 'Workouts',   Icon: Dumbbell },
    { href: '/goals',      label: 'Goals',      Icon: Target },
    { href: '/nutrition',  label: 'Nutrition',  Icon: Utensils },
    { href: '/challenges', label: 'Challenges', Icon: Trophy },
    { href: '/coach',      label: 'Coach',      Icon: Sparkles },
] as const;

interface SidebarProps {
    onLogWorkout?: () => void;
}

export function Sidebar({ onLogWorkout }: SidebarProps) {
    const pathname = usePathname();

    const isActive = (href: string) =>
        pathname === href || pathname.startsWith(href + '/');

    return (
        <aside className="hidden lg:flex flex-col w-60 h-full shrink-0 border-r border-surface-200 bg-surface">

            {/* Wordmark */}
            <div className="h-14 flex items-center gap-2 px-5 shrink-0">
                <Dumbbell className="h-5 w-5 text-primary-500 shrink-0" aria-hidden="true" />
                <Link
                    href="/feed"
                    className="text-xl font-bold tracking-tight text-foreground hover:opacity-60 transition-opacity"
                >
                    Fitspire
                </Link>
            </div>

            {/* Primary nav */}
            <nav className="shrink-0 px-3 pt-3 pb-6 space-y-1.5" aria-label="Main navigation">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                    const active = isActive(href);
                    return (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all',
                                active ? 'bg-primary-50 text-primary-600' : 'text-surface-600 hover:bg-surface-100'
                            )}
                        >
                            <Icon
                                className={cn('h-[18px] w-[18px] shrink-0', active ? 'text-primary-500' : 'text-surface-500')}
                                aria-hidden="true"
                            />
                            {label}
                        </Link>
                    );
                })}
            </nav>

            {/* Log Workout CTA */}
            <div className="px-3 pt-4 pb-2 shrink-0">
                <Button onClick={onLogWorkout} fullWidth className="gap-2">
                    <Plus className="h-4 w-4 shrink-0" aria-hidden="true" />
                    Log Workout
                </Button>
            </div>

            {/* Spacer — pushes streak card + settings to the bottom */}
            <div className="flex-1" />

            {/* Bottom section — streak card + profile */}
            <div className="shrink-0 px-3 pt-1 pb-4 space-y-5">
                <StreakCard />

                <Link
                    href="/profile"
                    className={cn(
                        'flex items-center gap-3 h-10 px-3 rounded-xl text-sm font-medium transition-all',
                        isActive('/profile') ? 'bg-primary-50 text-primary-600' : 'text-surface-600 hover:bg-surface-100'
                    )}
                >
                    <User
                        className={cn('h-[18px] w-[18px] shrink-0', isActive('/profile') ? 'text-primary-500' : 'text-surface-500')}
                        aria-hidden="true"
                    />
                    Profile
                </Link>
            </div>
        </aside>
    );
}
