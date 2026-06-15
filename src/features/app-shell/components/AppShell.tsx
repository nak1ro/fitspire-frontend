'use client';

import { useState, type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';
import { LogWorkoutModal } from '@/features/workout/components/LogWorkoutModal';

export function AppShell({ children }: { children: ReactNode }) {
    const [logWorkoutOpen, setLogWorkoutOpen] = useState(false);

    return (
        <div className="flex h-dvh overflow-hidden bg-background">

            {/* Left sidebar — desktop only */}
            <Sidebar onLogWorkout={() => setLogWorkoutOpen(true)} />

            {/* Right column: header + scrollable content + mobile bottom nav */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AppHeader />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
                <BottomNav onLogWorkout={() => setLogWorkoutOpen(true)} />
            </div>

            <LogWorkoutModal open={logWorkoutOpen} onClose={() => setLogWorkoutOpen(false)} />
        </div>
    );
}
