// App.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  Theme as NavTheme,
} from '@react-navigation/native';

import { AuthProvider, useAuth } from './src/features/auth/AuthContext';
import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { ThemeProvider, useTheme } from './src/ui/theme/ThemeProvider.tsx';


function ThemedNavigation() {
  const { theme, schemePref } = useTheme();
  const { token, loading } = useAuth();

  const navTheme: NavTheme =
    schemePref === 'dark'
      ? {
        ...NavDarkTheme,
        colors: {
          ...NavDarkTheme.colors,
          background: theme.colors.bg,
          card: theme.colors.cardBg,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
          notification: theme.colors.accent,
        },
      }
      : {
        ...NavLightTheme,
        colors: {
          ...NavLightTheme.colors,
          background: theme.colors.bg,
          card: theme.colors.cardBg,
          text: theme.colors.text,
          border: theme.colors.border,
          primary: theme.colors.accent,
          notification: theme.colors.accent,
        },
      };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.bg,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {!token ? <AuthStack /> : <MainStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <ThemedNavigation />
      </ThemeProvider>
    </AuthProvider>
  );
}
