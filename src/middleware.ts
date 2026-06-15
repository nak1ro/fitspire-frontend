import { auth } from '@/features/auth/server/auth';

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth') ||
        req.nextUrl.pathname.startsWith('/sign') ||
        req.nextUrl.pathname.startsWith('/forgot-password') ||
        req.nextUrl.pathname.startsWith('/reset-password') ||
        req.nextUrl.pathname.startsWith('/confirm-email');
    const isApi = req.nextUrl.pathname.startsWith('/api');
    const isPublic = req.nextUrl.pathname === '/' || req.nextUrl.pathname === '/design-test'; // Landing page & Design Test

    // Redirect unauthenticated users to sign-in
    if (!isLoggedIn && !isAuthPage && !isApi && !isPublic) {
        return Response.redirect(new URL('/auth?mode=login', req.nextUrl));
    }

    // Redirect authenticated users away from auth pages
    if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/feed', req.nextUrl));
    }
});

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
