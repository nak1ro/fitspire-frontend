'use client';

import { ReactQueryProvider } from './ReactQueryProvider';
import { ThemeProvider } from 'next-themes';
import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';

export function AppProviders({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <ReactQueryProvider>
                <ThemeProvider attribute="class" defaultTheme="light" storageKey="fitspire-theme">
                    {children}
                </ThemeProvider>
            </ReactQueryProvider>
        </SessionProvider>
    );
}
