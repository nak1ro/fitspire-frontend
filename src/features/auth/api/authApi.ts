/**
 * Auth Feature - API Functions
 * 
 * Pure API functions for auth operations (no React Query).
 * These can be used for testing or outside React components.
 */

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

export const loginApi = async (request: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.login, request);
    return data;
};

export const registerApi = async (request: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.register, request);
    return data;
};

export const oAuthLoginApi = async (request: OAuthLoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(endpoints.externalLogin, request);
    return data;
};

export const forgotPasswordApi = async (request: ForgotPasswordRequest): Promise<void> => {
    await apiClient.post(endpoints.forgotPassword, request);
};

export const verifyEmailApi = async (request: VerifyEmailRequest): Promise<void> => {
    await apiClient.post(endpoints.verifyEmail, request);
};
