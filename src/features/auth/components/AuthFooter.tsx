import Link from 'next/link';
import type { AuthMode } from '../hooks/useAuthMode';

interface AuthFooterProps {
    mode: AuthMode;
}

// Signup's step-1 panel renders its own "Already have an account?" link
// inline (next to the OAuth/step content), so this footer only covers the
// login and forgot-password modes.
export function AuthFooter({ mode }: AuthFooterProps) {
    if (mode === 'signup') return null;

    return (
        <footer className="text-center px-6 pt-2 pb-6 border-t border-surface-200 mt-2">
            {mode === 'forgot-password' ? (
                <p className="text-xs text-surface-500">
                    Remember your password?{' '}
                    <Link href="/auth?mode=login" className="font-semibold text-primary-500 hover:opacity-70 transition-opacity">
                        Log in
                    </Link>
                </p>
            ) : (
                <p className="text-xs text-surface-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth?mode=signup" className="font-semibold text-primary-500 hover:opacity-70 transition-opacity">
                        Sign up
                    </Link>
                </p>
            )}
        </footer>
    );
}
