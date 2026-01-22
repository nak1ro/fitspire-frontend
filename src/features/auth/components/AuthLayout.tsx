import { ReactNode } from 'react';
import { Card } from '@/shared/ui/Card';
import { Typography } from '@/shared/ui/Typography';

interface AuthLayoutProps {
    children: ReactNode;
    title?: string;
    subtitle?: string;
    showBrand?: boolean;
}

export function AuthLayout({ children, title, subtitle, showBrand = true }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-primary-950 via-background to-accent-950 relative overflow-hidden">

            {/* Ambient Background Orbs */}
            <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary-600/20 blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] rounded-full bg-accent-600/20 blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-md relative z-10 space-y-8">
                {showBrand && (
                    <div className="flex flex-col items-center text-center space-y-2">
                        <Typography variant="h2" weight="bold" className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-accent-400">
                            Fitspire
                        </Typography>
                    </div>
                )}

                <Card variant="glass" padding="lg" className="w-full space-y-6">
                    {(title || subtitle) && (
                        <div className="text-center space-y-2">
                            {title && <Typography variant="h3" weight="semibold">{title}</Typography>}
                            {subtitle && <Typography variant="body" color="muted">{subtitle}</Typography>}
                        </div>
                    )}

                    {children}
                </Card>
            </div>
        </div>
    );
}
