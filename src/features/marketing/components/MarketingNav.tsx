'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/shared/ui';
import { Typography } from '@/shared/ui/Typography';

export function MarketingNav() {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handler = () => setScrolled(window.scrollY > 8);
        window.addEventListener('scroll', handler, { passive: true });
        return () => window.removeEventListener('scroll', handler);
    }, []);

    return (
        <header
            className={`fixed top-0 inset-x-0 z-40 h-16 bg-background transition-all duration-200 ${
                scrolled ? 'border-b border-surface-200' : ''
            }`}
        >
            <div className="mx-auto max-w-6xl h-full flex items-center justify-between px-6">
                <Link href="/" className="group">
                    <Typography
                        variant="h4"
                        weight="bold"
                        className="tracking-tight transition-opacity group-hover:opacity-60"
                    >
                        Fitspire
                    </Typography>
                </Link>

                <nav className="flex items-center gap-2">
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">
                            Sign in
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm">
                            Get started
                        </Button>
                    </Link>
                </nav>
            </div>
        </header>
    );
}
