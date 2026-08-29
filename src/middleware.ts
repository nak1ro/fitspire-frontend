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
    // Excludes any path with a file extension (icon.svg, favicon.ico, robots.txt, etc.)
    // so static assets under public/ are always served directly instead of being
    // treated as a protected page and redirected to /auth.
    matcher: ['/((?!api|_next/static|_next/image|.*\\..*).*)'],
};
