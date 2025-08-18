// src/ui/theme/theme.ts
export type Scheme = 'light' | 'dark';

export type AppTheme = {
  name: Scheme;
  colors: {
    bg: string;
    cardBg: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    danger: string;
    success: string;
  };
};

export const lightTheme: AppTheme = {
  name: 'light',
  colors: {
    bg: '#fdfdfd',
    cardBg: '#ffffff',
    border: '#dddddd',
    text: '#222222',
    muted: '#6b7280',
    accent: '#007BFF',
    accentSoft: '#B7D3FF',
    danger: '#EF4444',
    success: '#10B981',
  },
};

export const darkTheme: AppTheme = {
  name: 'dark',
  colors: {
    bg: '#0f1115',
    cardBg: '#171a21',
    border: '#2a2f3a',
    text: '#e5e7eb',
    muted: '#9ca3af',
    accent: '#4F8EF7',
    accentSoft: '#334C7A',
    danger: '#F87171',
    success: '#34D399',
  },
};
