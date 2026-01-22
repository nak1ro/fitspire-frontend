export const AUTH_ROUTES = {
    login: '/api/auth/login',         // .NET endpoint
    register: '/api/auth/register',      // .NET endpoint
    externalLogin: '/api/auth/external-login', // .NET endpoint
    forgotPassword: '/api/auth/forgot-password',
    verifyEmail: '/api/auth/verify-email',
} as const;
