import Link from 'next/link';
import { Typography } from '@/shared/ui/Typography';

export function MarketingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-surface-200 py-8 px-6">
            <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-3">
                <Typography variant="body-sm" weight="bold" className="tracking-tight">
                    Fitspire
                </Typography>

                <div className="flex items-center gap-6">
                    <Link href="/sign-in">
                        <Typography
                            variant="caption"
                            color="muted"
                            className="hover:text-foreground transition-colors cursor-pointer"
                        >
                            Sign in
                        </Typography>
                    </Link>
                    <Typography variant="caption" color="subtle">
                        © {year} Fitspire. All rights reserved.
                    </Typography>
                </div>
            </div>
        </footer>
    );
}
