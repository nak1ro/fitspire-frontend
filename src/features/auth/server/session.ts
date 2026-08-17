import { auth } from './auth';
import { hasAdminRole } from '../lib/hasAdminRole';

export async function getCurrentUser() {
    const session = await auth();
    return session?.user ?? null;
}

export async function getAccessToken() {
    const session = await auth();
    return session?.accessToken ?? null;
}

export async function requireAccessToken() {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

export async function isCurrentUserAdmin() {
    const session = await auth();
    return hasAdminRole(session?.roles);
}
