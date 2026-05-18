'use client';

import { type ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { AppHeader } from './AppHeader';
import { BottomNav } from './BottomNav';

export function AppShell({ children }: { children: ReactNode }) {
    return (
        <div className="flex h-dvh overflow-hidden bg-background">

            {/* Left sidebar — desktop only (hidden on mobile via Sidebar itself) */}
            <Sidebar />

            {/* Right column: header + scrollable content + mobile bottom nav */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                <AppHeader />
                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
                <BottomNav />
            </div>

        </div>
    );
}
