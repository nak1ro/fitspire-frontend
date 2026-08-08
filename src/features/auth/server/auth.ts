import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import { callbacks } from './callbacks';
import { loginWithCredentials } from './dotnet-bridge';
import { env } from '@/shared/lib/env';

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Credentials({
            name: 'Credentials',
            credentials: {
                login: { label: 'Login', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => {
                if (!credentials?.login || !credentials?.password) return null;
                try {
                    // Verify credentials against .NET backend
                    const user = await loginWithCredentials(
                        credentials.login as string,
                        credentials.password as string
                    );
                    return user;
                } catch {
                    return null;
                }
            },
        }),
        ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
            ? [Google({
                clientId: env.GOOGLE_CLIENT_ID,
                clientSecret: env.GOOGLE_CLIENT_SECRET,
            })]
            : []),
    ],
    callbacks,
    pages: {
        signIn: '/sign-in',
        error: '/sign-in', // Error code passed in query string
    },
    session: { strategy: 'jwt' },
});
