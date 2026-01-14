/**
 * Auth Feature - API Mutations
 * 
 * React Query hooks for auth operations.
 */

import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/services';
import { endpoints } from './endpoints';
import {
    LoginRequest,
    RegisterRequest,
    OAuthLoginRequest,
    ForgotPasswordRequest,
    VerifyEmailRequest,
    AuthResponse,
} from '../types';

// API Functions
const loginApi = async (request: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.login, request);
    return data;
};

const registerApi = async (request: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.register, request);
    return data;
};

const oAuthLoginApi = async (request: OAuthLoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.externalLogin, request);
    return data;
};

const forgotPasswordApi = async (request: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post(endpoints.forgotPassword, request);
};

const verifyEmailApi = async (request: VerifyEmailRequest): Promise<void> => {
    await apiClient.post(endpoints.verifyEmail, request);
};

// Mutation Hooks
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
