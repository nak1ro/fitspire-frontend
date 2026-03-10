import { auth } from './auth';

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
