export const AUTH_ROUTES = {
    register: '/api/account/register',
    login: '/api/account/login',
    confirmEmail: '/api/account/confirm-email',
    externalLogin: '/api/account/external-login',
    forgotPassword: '/api/account/forgot-password',
    resetPassword: '/api/account/reset-password',
    changePassword: '/api/account/change-password',
} as const;
