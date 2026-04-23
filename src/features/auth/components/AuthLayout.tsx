import { ReactNode } from 'react';
import Link from 'next/link';
import { Card } from '@/shared/ui/Card';
import { Typography } from '@/shared/ui/Typography';

interface AuthLayoutProps {
    children: ReactNode;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, eyebrow, title, subtitle }: AuthLayoutProps) {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
            <div className="w-full max-w-[420px]">

                {/* Wordmark */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <Typography
                            variant="h2"
                            weight="bold"
                            className="tracking-tight transition-opacity group-hover:opacity-60"
                        >
                            Fitspire
                        </Typography>
                    </Link>
                </div>

                {/* Card */}
                <Card variant="elevated" padding="lg">
                    {(eyebrow || title || subtitle) && (
                        <div className="mb-6">
                            {eyebrow && (
                                <Typography variant="eyebrow" className="mb-1.5">
                                    {eyebrow}
                                </Typography>
                            )}
                            {title && (
                                <Typography variant="h3">{title}</Typography>
                            )}
                            {subtitle && (
                                <Typography variant="body-sm" color="muted" className="mt-1">
                                    {subtitle}
                                </Typography>
                            )}
                        </div>
                    )}
                    {children}
                </Card>
            </div>
        </main>
    );
}
