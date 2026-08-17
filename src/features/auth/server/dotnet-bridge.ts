import { AUTH_ROUTES } from '../api/routes';
import { AuthResponse, AuthUser } from '../types';
import { env } from '@/shared/lib/env';

/**
 * .NET Bridge
 * 
 * Server-only utility to talk to the backend Identity API.
 * This keeps the NextAuth configuration clean and SRP-compliant.
 */

// We use fetch directly here instead of shared/lib/http because this runs on the server
// and we might need to handle headers/cookies differently in the future.
// But for now, we can keep it simple.

const BASE_URL = env.NEXT_PUBLIC_API_URL;

function toAuthUser(data: AuthResponse): AuthUser {
    return {
        id: data.id,
        userName: data.userName,
        email: data.email,
        createdAt: data.createdAt,
        token: data.token ?? undefined,
        roles: data.roles,
    };
}

export async function loginWithCredentials(login: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}${AUTH_ROUTES.login}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ login, password }),
    });

    if (!res.ok) {
        // NextAuth expects null on failure to trigger default error handling
        // or we can throw to show specific error messages
        const errorText = await res.text();
        console.error('Login failed:', errorText);
        throw new Error(errorText || 'Invalid credentials');
    }

    const data: AuthResponse = await res.json();
    return toAuthUser(data);
}

export async function exchangeGoogleToken(idToken: string): Promise<AuthUser> {
    const res = await fetch(`${BASE_URL}${AUTH_ROUTES.externalLogin}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            provider: 'Google',
            idToken: idToken,
        }),
    });

    if (!res.ok) {
        const errorText = await res.text();
        console.error('Google exchange failed:', errorText);
        throw new Error('Failed to authenticate with Google');
    }

    const data: AuthResponse = await res.json();
    return toAuthUser(data);
}
