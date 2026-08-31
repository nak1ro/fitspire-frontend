'use client';

import Link from 'next/link';
import { Button, Logo } from '@/shared/ui';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';

export function MarketingNav() {
    const { isAuthenticated } = useAuthSession();

    return (
        <header
            className="fixed top-0 inset-x-0 z-40 h-16"
            style={{
                background: 'rgba(255, 251, 247, 0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: '1px solid var(--color-surface-200)',
                boxShadow: 'var(--shadow-float)',
            }}
        >
            <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-6">

                <Link href="/" className="group flex items-center gap-2">
                    <Logo className="h-7 w-7 shrink-0" />
                    <span className="text-xl font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-60">
                        Fitspire
                    </span>
                </Link>

                <nav className="flex items-center gap-2" aria-label="Main navigation">
                    {isAuthenticated ? (
                        <Link href="/feed">
                            <Button size="sm">Go to Feed</Button>
                        </Link>
                    ) : (
                        <>
                            <Link href="/auth?mode=login">
                                <Button variant="ghost" size="sm">Sign in</Button>
                            </Link>
                            <Link href="/auth?mode=signup">
                                <Button size="sm">Get started</Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}
