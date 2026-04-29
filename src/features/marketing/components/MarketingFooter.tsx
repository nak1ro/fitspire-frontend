import Link from 'next/link';

export function MarketingFooter() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-surface-200 bg-background">
            <div className="mx-auto max-w-6xl px-6 py-14">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-10 items-start">

                    {/* Brand */}
                    <div className="space-y-3 max-w-xs">
                        <p className="text-base font-bold tracking-tight text-foreground">Fitspire</p>
                        <p className="text-sm text-surface-500 leading-relaxed">
                            The social fitness platform for committed athletes
                            and curious beginners alike.
                        </p>
                    </div>

                    {/* Links */}
                    <div className="flex gap-14">
                        <div className="space-y-4">
                            <p className="text-xs font-semibold tracking-widest uppercase text-surface-400">
                                Product
                            </p>
                            <nav className="space-y-3">
                                <Link
                                    href="/sign-up"
                                    className="block text-sm text-surface-600 hover:text-foreground transition-colors"
                                >
                                    Sign up
                                </Link>
                                <Link
                                    href="/sign-in"
                                    className="block text-sm text-surface-600 hover:text-foreground transition-colors"
                                >
                                    Sign in
                                </Link>
                            </nav>
                        </div>
                    </div>
                </div>

                <div className="mt-12 pt-6 border-t border-surface-100">
                    <p className="text-xs text-surface-400">
                        © {year} Fitspire. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
