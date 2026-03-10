export interface BackendAuthUser {
    id: string;
    userName: string;
    email: string;
    createdAt: string;
    token?: string | null;
}

export interface AuthUser {
    id: string;
    userName: string;
    email: string;
    createdAt: string;
    token?: string;
}

export interface RegisterRequest {
    email: string;
    userName: string;
    password: string;
    displayName?: string | null;
}

export interface SignUpRequest extends RegisterRequest {
    confirmPassword: string;
}

export interface LoginRequest {
    login: string;
    password: string;
}

export interface ExternalLoginRequest {
    provider: 'Google';
    idToken: string;
}

export interface ConfirmEmailRequest {
    userId: string;
    token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface ResetPasswordRequest {
    email: string;
    token: string;
    newPassword: string;
}

export interface ChangePasswordRequest {
    currentPassword: string;
    newPassword: string;
}

export type AuthResponse = BackendAuthUser;
export type User = AuthUser;
export type SignInRequest = LoginRequest;
export type VerifyEmailRequest = ConfirmEmailRequest;
