'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Target, User, Sparkles, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface NavItem {
    href: string;
    label: string;
    Icon: LucideIcon;
}

const NAV_ITEMS = [
    { href: '/feed',     label: 'Feed',     Icon: Home },
    { href: '/workouts', label: 'Workouts', Icon: Dumbbell },
    { href: '/coach',    label: 'Coach',    Icon: Sparkles },
    { href: '/goals',    label: 'Goals',    Icon: Target },
    { href: '/profile',  label: 'Profile',  Icon: User },
] as const;

export function BottomNav() {
    const pathname = usePathname();
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

    const renderItem = ({ href, label, Icon }: NavItem) => {
        const active = isActive(href);
        return (
            <Link
                key={href}
                href={href}
                className={cn(
                    'flex-1 flex flex-col items-center justify-center gap-1 h-16 text-[10px] font-medium transition-all',
                    active ? 'text-primary-600' : 'text-surface-500'
                )}
                aria-current={active ? 'page' : undefined}
            >
                <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                <span>{label}</span>
            </Link>
        );
    };

    return (
        <nav
            className="lg:hidden flex items-stretch shrink-0 bg-surface border-t border-surface-200"
            aria-label="Mobile navigation"
        >
            {NAV_ITEMS.map(renderItem)}
        </nav>
    );
}
