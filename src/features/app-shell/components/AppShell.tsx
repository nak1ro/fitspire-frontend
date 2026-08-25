'use client';

import { useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { LogWorkoutModal } from '@/features/workout/components/LogWorkoutModal';

export function AppShell({ children }: { children: ReactNode }) {
    const [logWorkoutOpen, setLogWorkoutOpen] = useState(false);
    const pathname = usePathname();

    return (
        <div className="flex h-dvh overflow-hidden bg-background">

            {/* Left sidebar — desktop only */}
            <Sidebar onLogWorkout={() => setLogWorkoutOpen(true)} />

            {/* Right column: header + scrollable content + mobile bottom nav */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AppHeader onLogWorkout={() => setLogWorkoutOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    {/* Keyed on route so it re-mounts (and re-plays the fade) on every
                        real navigation; in-page tabs don't change the pathname, so
                        they're untouched by this. */}
                    <div key={pathname} className="animate-fade-in">
                        {children}
                    </div>
                </main>
                <BottomNav />
            </div>

            <LogWorkoutModal open={logWorkoutOpen} onClose={() => setLogWorkoutOpen(false)} />
        </div>
    );
}
