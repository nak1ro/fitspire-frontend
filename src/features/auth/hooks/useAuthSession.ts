'use client';

import { useSession } from 'next-auth/react';

export function useAuthSession() {
    const { data: session, status, update } = useSession();
    const accessToken = session?.accessToken;

    return {
        session,
        user: session?.user ?? null,
        accessToken: accessToken ?? null,
        backendAuthError: session?.backendAuthError ?? null,
        isAuthenticated: status === 'authenticated' && Boolean(accessToken),
        isLoading: status === 'loading',
        status,
        update,
    };
}
