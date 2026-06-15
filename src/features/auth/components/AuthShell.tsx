import { ReactNode } from 'react';
import { MarketingNav } from '@/features/marketing/components/MarketingNav';
import { MarketingFooter } from '@/features/marketing/components/MarketingFooter';

interface AuthShellProps {
    children: ReactNode;
    /** Card width — the tabbed auth card is wider than the single-purpose ones. */
    maxWidth?: 420 | 460;
}

// Shared with the landing page (same MarketingNav/MarketingFooter chrome) so
// auth doesn't feel like a separate app. Background wrapper is used by /auth
// (tabbed login/signup/forgot-password) and the standalone /reset-password
// and /confirm-email pages — same visual treatment, different card content.
export function AuthShell({ children, maxWidth = 420 }: AuthShellProps) {
    return (
        <>
            <MarketingNav />

            <main className="relative overflow-hidden min-h-[calc(100vh-4rem)] bg-background flex flex-col items-center justify-center px-4 py-12 pt-16">

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
                        background: 'rgba(52,211,153,0.08)',
                        filter: 'blur(80px)',
                    }}
                />

                <div className="relative w-full" style={{ maxWidth }}>
                    {/* Card */}
                    <div
                        className="rounded-2xl bg-surface border border-surface-200 overflow-hidden"
                        style={{ boxShadow: 'var(--shadow-panel)' }}
                    >
                        {/* Emerald top accent */}
                        <div
                            className="h-[3px] shrink-0"
                            style={{ background: 'linear-gradient(to right, #059669, #34D399, transparent)' }}
                        />
                        {children}
                    </div>
                </div>
            </main>

            <MarketingFooter />
        </>
    );
}
