// App.tsx
import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import {
  NavigationContainer,
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavLightTheme,
  Theme as NavTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClientProvider } from '@tanstack/react-query';

import AuthStack from './src/navigation/AuthStack';
import MainStack from './src/navigation/MainStack';
import { useTheme } from './src/common/hooks/useTheme';
import { queryClient } from './src/services';
import { useIsAuthenticated, useIsHydrated } from './src/features/auth/hooks';

function ThemedNavigation() {
  const theme = useTheme();
  const isAuthenticated = useIsAuthenticated();
  const isHydrated = useIsHydrated();

  const navTheme: NavTheme =
    theme.scheme === 'dark'
      ? {
        ...NavDarkTheme,
        colors: {
          ...NavDarkTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text.primary,
          border: theme.colors.border,
          primary: theme.colors.primary[500],
          notification: theme.colors.primary[500],
        },
      }
      : {
        ...NavLightTheme,
        colors: {
          ...NavLightTheme.colors,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text.primary,
          border: theme.colors.border,
          primary: theme.colors.primary[500],
          notification: theme.colors.primary[500],
        },
      };

  // Show loading while Zustand hydrates from AsyncStorage
  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: theme.colors.background,
        }}
      >
        <ActivityIndicator size="large" color={theme.colors.primary[500]} />
      </View>
    );
  }

  return (
    <NavigationContainer theme={navTheme}>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaProvider>
        <ThemedNavigation />
      </SafeAreaProvider>
    </QueryClientProvider>
  );
}
