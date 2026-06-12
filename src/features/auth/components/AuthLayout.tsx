import { ReactNode } from 'react';
import Link from 'next/link';

interface AuthLayoutProps {
    children: ReactNode;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
}

export function AuthLayout({ children, eyebrow, title, subtitle }: AuthLayoutProps) {
    return (
        <main className="relative overflow-hidden min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">

            {/* CSS line grid */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        'linear-gradient(rgba(28,21,16,0.04) 1px, transparent 1px), ' +
                        'linear-gradient(to right, rgba(28,21,16,0.04) 1px, transparent 1px)',
                    backgroundSize: '72px 72px',
                }}
            />

            {/* Ambient orb — top-left */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: 560, height: 560,
                    top: -180, left: -160,
                    background: 'rgba(5,150,105,0.10)',
                    filter: 'blur(90px)',
                }}
            />

            {/* Ambient orb — bottom-right */}
            <div
                aria-hidden="true"
                className="absolute pointer-events-none rounded-full"
                style={{
                    width: 400, height: 400,
                    bottom: -120, right: -100,
                    background: 'rgba(5,150,105,0.07)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Warm radial wash */}
            <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(5,150,105,0.05) 0%, transparent 70%)',
                }}
            />

            <div className="relative w-full max-w-[420px]">

                {/* Wordmark */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block group">
                        <span className="text-2xl font-bold tracking-tight text-foreground transition-opacity group-hover:opacity-60">
                            Fitspire
                        </span>
                    </Link>
                </div>

                {/* Card */}
                <div
                    className="rounded-2xl bg-surface overflow-hidden"
                    style={{ boxShadow: '0 8px 32px rgba(28,21,16,0.10)' }}
                >
                    {/* Amber top accent */}
                    <div
                        className="h-[3px] shrink-0"
                        style={{ background: 'linear-gradient(to right, #059669, #34D399, transparent)' }}
                    />

                    <div className="p-6">
                        {(eyebrow || title || subtitle) && (
                            <div className="mb-6">
                                {eyebrow && (
                                    <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-1.5">
                                        {eyebrow}
                                    </p>
                                )}
                                {title && (
                                    <h1 className="text-2xl font-bold text-foreground">{title}</h1>
                                )}
                                {subtitle && (
                                    <p className="text-sm text-surface-500 mt-1">{subtitle}</p>
                                )}
                            </div>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </main>
    );
}
