'use client';

import { useSearchParams } from 'next/navigation';

export type AuthMode = 'login' | 'signup' | 'forgot-password';

export function useAuthMode(): AuthMode {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');

    if (mode === 'signup') return 'signup';
    if (mode === 'forgot-password') return 'forgot-password';
    return 'login';
}
