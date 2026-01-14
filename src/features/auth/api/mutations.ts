/**
 * Auth Feature - React Query Mutations
 * 
 * React Query hooks that wrap the auth API functions.
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import {
    loginApi,
    registerApi,
    oAuthLoginApi,
    forgotPasswordApi,
    verifyEmailApi,
} from './authApi';
import {
    LoginRequest,
    RegisterRequest,
    ForgotPasswordRequest,
    VerifyEmailRequest,
    AuthResponse,
} from '../types';

export function useLogin(
    options?: Omit<UseMutationOptions<AuthResponse, Error, LoginRequest>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: loginApi,
        ...options,
    });
}

export function useRegister(
    options?: Omit<UseMutationOptions<AuthResponse, Error, RegisterRequest>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: registerApi,
        ...options,
    });
}

export function useGoogleLogin(
    options?: Omit<UseMutationOptions<AuthResponse, Error, string>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: (idToken: string) => oAuthLoginApi({ provider: 'Google', idToken }),
        ...options,
    });
}

export function useMicrosoftLogin(
    options?: Omit<UseMutationOptions<AuthResponse, Error, string>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: (idToken: string) => oAuthLoginApi({ provider: 'Microsoft', idToken }),
        ...options,
    });
}

export function useForgotPassword(
    options?: Omit<UseMutationOptions<void, Error, ForgotPasswordRequest>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: forgotPasswordApi,
        ...options,
    });
}

export function useVerifyEmail(
    options?: Omit<UseMutationOptions<void, Error, VerifyEmailRequest>, 'mutationFn'>
) {
    return useMutation({
        mutationFn: verifyEmailApi,
        ...options,
    });
}
