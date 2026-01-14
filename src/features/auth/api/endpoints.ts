/**
 * Auth Feature - API Endpoints
 */

const BASE = '/account';

export const endpoints = {
    login: `${BASE}/login`,
    register: `${BASE}/register`,
    externalLogin: `${BASE}/external-login`,
    forgotPassword: `${BASE}/forgot-password`,
    verifyEmail: `${BASE}/verify-email`,
    refreshToken: `${BASE}/refresh`,
} as const;
