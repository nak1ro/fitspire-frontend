export function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}
