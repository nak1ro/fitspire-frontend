'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';

export function MarketingNav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 16);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header
            className="fixed top-0 inset-x-0 z-40 h-16 transition-all duration-300"
            style={{
                background: 'rgba(255, 251, 247, 0.82)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderBottom: scrolled
                    ? '1px solid rgba(235, 233, 228, 0.65)'
                    : '1px solid transparent',
                boxShadow: scrolled
                    ? '0 2px 20px rgba(28, 21, 16, 0.07)'
                    : 'none',
            }}
        >
            <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-6">

                <Link href="/" className="group">
                    <span className="text-xl font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-60">
                        Fitspire
                    </span>
                </Link>

                <nav className="flex items-center gap-2" aria-label="Main navigation">
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">Sign in</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm">Get started</Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
