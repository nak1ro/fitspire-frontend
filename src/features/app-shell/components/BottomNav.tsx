'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Dumbbell, Target, User, Plus, type LucideIcon } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface NavItem {
    href: string;
    label: string;
    Icon: LucideIcon;
}

const LEFT_ITEMS = [
    { href: '/feed',     label: 'Feed',     Icon: Home },
    { href: '/workouts', label: 'Workouts', Icon: Dumbbell },
] as const;

const RIGHT_ITEMS = [
    { href: '/goals',   label: 'Goals',   Icon: Target },
    { href: '/profile', label: 'Profile', Icon: User },
] as const;

interface BottomNavProps {
    onLogWorkout?: () => void;
}

export function BottomNav({ onLogWorkout }: BottomNavProps) {
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
            {LEFT_ITEMS.map(renderItem)}

            <div className="flex-1 flex items-center justify-center">
                <button
                    type="button"
                    onClick={onLogWorkout}
                    aria-label="Log workout"
                    className="flex items-center justify-center h-11 w-11 rounded-full text-white shadow-float -translate-y-2 bg-primary-500 active:opacity-90"
                >
                    <Plus className="h-5 w-5" aria-hidden="true" />
                </button>
            </div>

            {RIGHT_ITEMS.map(renderItem)}
        </nav>
    );
}
