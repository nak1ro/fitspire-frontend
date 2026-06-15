'use client';

import { useRouter } from 'next/navigation';
import { AuthTabButton } from './AuthTabButton';
import type { AuthMode } from '../hooks/useAuthMode';

interface AuthTabsProps {
    mode: AuthMode;
}

export function AuthTabs({ mode }: AuthTabsProps) {
    const router = useRouter();

    return (
        <div role="tablist" aria-label="Authentication mode" className="flex gap-2 p-1 bg-surface-100 rounded-lg">
            <AuthTabButton active={mode === 'login'} onClick={() => router.push('/auth?mode=login')}>
                Log in
            </AuthTabButton>
            <AuthTabButton active={mode === 'signup'} onClick={() => router.push('/auth?mode=signup')}>
                Sign up
            </AuthTabButton>
        </div>
    );
}
