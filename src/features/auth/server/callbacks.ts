import { NextAuthConfig } from 'next-auth';
import { exchangeGoogleToken } from './dotnet-bridge';

const GOOGLE_TOKEN_EXCHANGE_FAILED = 'GOOGLE_TOKEN_EXCHANGE_FAILED';

// Extend built-in types to include our custom token
declare module 'next-auth' {
    interface Session {
        accessToken?: string;
        roles?: string[];
        backendAuthError?: typeof GOOGLE_TOKEN_EXCHANGE_FAILED;
    }
    interface User {
        token?: string;
        roles?: string[];
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        accessToken?: string;
        roles?: string[];
        backendAuthError?: typeof GOOGLE_TOKEN_EXCHANGE_FAILED;
    }
}

export const callbacks: NextAuthConfig['callbacks'] = {
    async jwt({ token, user, account }) {
        if (user && user.token) {
            token.accessToken = user.token;
            token.roles = user.roles ?? [];
            delete token.backendAuthError;
        }

        if (account?.provider === 'google') {
            if (!account.id_token) {
                delete token.accessToken;
                delete token.roles;
                token.backendAuthError = GOOGLE_TOKEN_EXCHANGE_FAILED;
                return token;
            }

            try {
                const dotnetUser = await exchangeGoogleToken(account.id_token);
                if (!dotnetUser.token) {
                    delete token.accessToken;
                    delete token.roles;
                    token.backendAuthError = GOOGLE_TOKEN_EXCHANGE_FAILED;
                    return token;
                }

                token.accessToken = dotnetUser.token;
                token.roles = dotnetUser.roles;
                delete token.backendAuthError;
            } catch (error) {
                console.error('Google token exchange failed', error);
                delete token.accessToken;
                delete token.roles;
                token.backendAuthError = GOOGLE_TOKEN_EXCHANGE_FAILED;
            }
        }

        return token;
    },

    async session({ session, token }) {
        if (token.accessToken) {
            session.accessToken = token.accessToken;
            session.roles = token.roles ?? [];
        }

        if (token.backendAuthError) {
            session.backendAuthError = token.backendAuthError;
        }

        return session;
    },
};
