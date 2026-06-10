'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Trophy, User, Utensils } from 'lucide-react';

const NAV_ITEMS = [
    { href: '/feed',       label: 'Feed',       Icon: Home },
    { href: '/workouts',   label: 'Workouts',   Icon: Dumbbell },
    { href: '/nutrition',  label: 'Nutrition',  Icon: Utensils },
    { href: '/challenges', label: 'Challenges', Icon: Trophy },
    { href: '/profile',    label: 'Profile',    Icon: User },
] as const;

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="lg:hidden flex items-stretch shrink-0 bg-surface border-t border-surface-200"
            aria-label="Mobile navigation"
        >
            {NAV_ITEMS.map(({ href, label, Icon }) => {
                const active = pathname === href || pathname.startsWith(href + '/');
                return (
                    <Link
                        key={href}
                        href={href}
                        className="flex-1 flex flex-col items-center justify-center gap-1 h-16 text-[10px] font-medium transition-all"
                        style={{ color: active ? '#059669' : 'var(--color-surface-500)' }}
                        aria-current={active ? 'page' : undefined}
                    >
                        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        <span>{label}</span>
                    </Link>
                );
            })}
        </nav>
    );
}
