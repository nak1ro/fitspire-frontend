'use client';

import { useSession } from 'next-auth/react';

export function useAuthSession() {
    const { data: session, status, update } = useSession();
    const accessToken = session?.accessToken;
    const roles = session?.roles ?? [];

    return {
        session,
        user: session?.user ?? null,
        accessToken: accessToken ?? null,
        roles,
        isAdmin: roles.includes('Admin'),
        backendAuthError: session?.backendAuthError ?? null,
        isAuthenticated: status === 'authenticated' && Boolean(accessToken),
        isLoading: status === 'loading',
        status,
        update,
    };
}
