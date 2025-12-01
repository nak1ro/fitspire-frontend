export type ThemeScheme = 'light' | 'dark';

export type AppTheme = {
  scheme: ThemeScheme;
  colors: {
    bg: string;

    text: string;
    muted: string;

    cardBg: string;
    border: string;

    accent: string;
    accentSoft: string;
  };
};

// Light / Dark palettes
export const lightTheme: AppTheme = {
  scheme: 'light',
  colors: {
    bg: '#eef2f6',
    text: '#0b1220',
    muted: '#8a95a6',
    cardBg: '#ffffff',
    border: '#e8edf3',
    accent: '#ff6b4a',
    accentSoft: '#ffd9ce',
  },
};

export const darkTheme: AppTheme = {
  scheme: 'dark',
  colors: {
    bg: '#1a1d21',
    text: '#f0f1f3',
    muted: '#aab4be',
    cardBg: '#22262b',
    border: '#2f343a',
    accent: '#ff6b4a',
    accentSoft: '#3a2f20',
  },
};

// Tokens used by cards (WorkoutCard / ProfileCard)
export type Tokens = {
  primary: string;
  onPrimary: string;

  textStrong: string;
  textMuted: string;
  textBase: string;

  card: string;
  cardBorder: string;

  fieldBg: string;
  fieldBorder: string;

  rowBg: string;
  rowBorder: string;

  chipBg: string;
  chipBorder: string;

  divider: string;

  ghostBg: string;
  ghostBorder: string;

  pillBg: string;
  pillBorder: string;
  pillText: string;

  iconSoft: string;
  iconStrong: string;
};

export function buildTokens(theme: AppTheme): Tokens {
  if (theme.scheme === 'dark') {
    return {
      primary: theme.colors.accent,
      onPrimary: '#ffffff',

      textStrong: theme.colors.text,
      textMuted: theme.colors.muted,
      textBase: '#cfd6dd',

      card: theme.colors.cardBg,
      cardBorder: theme.colors.border,

      fieldBg: '#14171a',
      fieldBorder: '#272c31',

      rowBg: '#1b1f23',
      rowBorder: '#252b31',

      chipBg: '#171a1d',
      chipBorder: '#2a3138',

      divider: '#262b31',

      ghostBg: '#1a1e22',
      ghostBorder: '#283037',

      pillBg: '#ff6b4a',
      pillBorder: '#ff6b4a',
      pillText: '#1b0d07',

      iconSoft: '#ffd76a',
      iconStrong: '#ff6b4a',
    };
  }

  return {
    primary: theme.colors.accent,
    onPrimary: '#ffffff',

    textStrong: theme.colors.text,
    textMuted: theme.colors.muted,
    textBase: '#1f2937',

    card: theme.colors.cardBg,
    cardBorder: theme.colors.border,

    fieldBg: '#ffffff',
    fieldBorder: '#dfe7f0',

    rowBg: '#fff5ef',
    rowBorder: '#ffe4d7',

    chipBg: '#f2f6fb',
    chipBorder: '#e1e7ee',

    divider: '#e7edf3',

    ghostBg: '#f5f7fa',
    ghostBorder: '#e3e9f0',

    pillBg: '#ffe8e5',
    pillBorder: '#ffd1cb',
    pillText: '#ee3a22',

    iconSoft: '#8a5b00',
    iconStrong: '#ff6b4a',
  };
}
