export interface User {
    id: string;
    email: string;
    userName: string;
    displayName?: string;
    profilePictureUrl?: string;
    token?: string; // JWT from backend
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface SignInRequest {
    login: string; // email or username
    password?: string;
    provider?: 'Google' | 'Microsoft';
    idToken?: string;
}

export interface SignUpRequest {
    email: string;
    userName: string;
    password?: string;
    confirmPassword?: string;
}

export interface VerifyEmailRequest {
    email: string;
    token: string;
}

export interface ForgotPasswordRequest {
    email: string;
}
