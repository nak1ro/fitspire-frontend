import React, { useEffect, useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStack from './AuthStack';
import MainStack from './MainStack';
import { useAuth } from '../features/auth/AuthContext';
import { log } from '../utils/logger';

export default function AppNavigator() {
  const { token, loading } = useAuth();
  const prevToken = useRef<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (prevToken.current !== token) {
      if (token && !prevToken.current) {
        log.nav.info('Auth state: User authenticated → showing MainStack');
      } else if (!token && prevToken.current) {
        log.nav.info('Auth state: User logged out → showing AuthStack');
      } else if (!token) {
        log.nav.info('Auth state: No session → showing AuthStack');
      }
      prevToken.current = token;
    }
  }, [token, loading]);

  if (loading) return null;

  return (
    <NavigationContainer>
      {token ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
