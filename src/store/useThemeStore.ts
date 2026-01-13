/**
 * Theme Store (Zustand)
 * 
 * Manages user theme preference with persistence.
 * Falls back to OS preference when user hasn't chosen.
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
    /** User's preference: light, dark, or system (OS default) */
    themeMode: ThemeMode;

    /** Set theme preference */
    setThemeMode: (mode: ThemeMode) => void;

    /** Get resolved theme (light or dark) based on preference and OS */
    getResolvedTheme: () => 'light' | 'dark';
}

export const useThemeStore = create<ThemeState>()(
    persist(
        (set, get) => ({
            themeMode: 'system',

            setThemeMode: (mode: ThemeMode) => {
                set({ themeMode: mode });
            },

            getResolvedTheme: () => {
                const { themeMode } = get();
                if (themeMode === 'system') {
                    return Appearance.getColorScheme() ?? 'light';
                }
                return themeMode;
            },
        }),
        {
            name: 'theme-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
