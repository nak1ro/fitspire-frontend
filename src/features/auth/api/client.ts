import { http } from '@/shared/lib/http';
import { AUTH_ROUTES } from './routes';
import { SignUpRequest, AuthResponse, ForgotPasswordRequest, VerifyEmailRequest, RegisterRequest } from '../types';

/**
 * Auth Client API
 * 
 * Client-side API calls that don't go through NextAuth.
 * Note: Login is handled by NextAuth (signIn), so we don't need a client function for it
 * unless we have a custom flow.
 */

export const signUp = (data: SignUpRequest) => {
    const request: RegisterRequest = {
        email: data.email,
        userName: data.userName,
        password: data.password,
        displayName: data.displayName,
    };

    return http<AuthResponse>(AUTH_ROUTES.register, {
        method: 'POST',
        body: JSON.stringify(request)
    });
};

export const forgotPassword = (data: ForgotPasswordRequest) =>
    http<void>(AUTH_ROUTES.forgotPassword, {
        method: 'POST',
        body: JSON.stringify(data)
    });

export const verifyEmail = (data: VerifyEmailRequest) =>
    http<void>(AUTH_ROUTES.confirmEmail, {
        method: 'POST',
        body: JSON.stringify(data)
    });
