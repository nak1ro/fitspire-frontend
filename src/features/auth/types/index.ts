/**
 * Auth Feature - Types
 */

// OAuth Provider
export type OAuthProvider = 'Google' | 'Microsoft';

// Request Types
export interface LoginRequest {
    login: string;
    password: string;
}

export interface RegisterRequest {
    email: string;
    userName: string;
    password: string;
}

export interface OAuthLoginRequest {
    provider: OAuthProvider;
    idToken: string;
}

export interface ForgotPasswordRequest {
    email: string;
}

export interface VerifyEmailRequest {
    token: string;
}

// Response Types
export interface AuthResponse {
    token: string;
    user: User | null;
}

// User
export interface User {
    id: string;
    email: string;
    userName: string;
    displayName?: string;
    profilePictureUrl?: string | null;
}

// Auth State (for Zustand store)
export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    isHydrated: boolean;
}

// Auth Actions (for Zustand store)
export interface AuthActions {
    setAuth: (token: string, user: User | null) => void;
    clearAuth: () => void;
    setLoading: (loading: boolean) => void;
    hydrate: () => Promise<void>;
}

// Combined store type
export type AuthStore = AuthState & AuthActions;
