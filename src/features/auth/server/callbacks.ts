import { NextAuthConfig } from 'next-auth';
import { exchangeGoogleToken } from './dotnet-bridge';

// Extend built-in types to include our custom token
declare module 'next-auth' {
    interface Session {
        accessToken?: string;
    }
    interface User {
        token?: string;
    }
}

declare module '@auth/core/jwt' {
    interface JWT {
        accessToken?: string;
    }
}

export const callbacks: NextAuthConfig['callbacks'] = {
    async signIn({ account }) {
        // We can just allow it here, and do the exchange in JWT
        // If exchange fails in JWT, we might end up with a session without nice token, 
        // but passing data from here is hard.
        // Alternatively, we could check consistency here.
        return true;
    },

    async jwt({ token, user, account }) {
        // Initial sign in with Credentials
        if (user && user.token) {
            token.accessToken = user.token;
        }

        // OAuth sign in - exchange token here
        if (account?.provider === 'google' && account.id_token) {
            try {
                const dotnetUser = await exchangeGoogleToken(account.id_token);
                token.accessToken = dotnetUser.token;
            } catch (error) {
                console.error('Google token exchange failed', error);
                // What to do? Throwing here might crash the flow.
            }
        }
        return token;
    },


    async session({ session, token }) {
        if (token.accessToken) {
            session.accessToken = token.accessToken;
        }
        return session;
    },
};
