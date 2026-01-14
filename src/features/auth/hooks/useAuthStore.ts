/**
 * Auth Store (Zustand)
 * 
 * Manages authentication state with persistence.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStore, User } from '../types';

export const useAuthStore = create<AuthStore>()(
    persist(
        (set, get) => ({
            // State
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isHydrated: false,

            // Actions
            setAuth: (token: string, user: User | null) => {
                set({
                    token,
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            },

            clearAuth: () => {
                set({
                    token: null,
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                });
            },

            setLoading: (loading: boolean) => {
                set({ isLoading: loading });
            },

            hydrate: async () => {
                // This is called automatically by persist middleware
                // We use onRehydrateStorage callback instead
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
            partialize: (state) => ({
                token: state.token,
                user: state.user,
                isAuthenticated: state.isAuthenticated,
            }),
            onRehydrateStorage: () => (state) => {
                if (state) {
                    state.isHydrated = true;
                }
            },
        }
    )
);

// Selector hooks for convenience
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useCurrentUser = () => useAuthStore((s) => s.user);
export const useAuthToken = () => useAuthStore((s) => s.token);
export const useAuthLoading = () => useAuthStore((s) => s.isLoading);
export const useIsHydrated = () => useAuthStore((s) => s.isHydrated);
