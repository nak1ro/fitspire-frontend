import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleLogin, login as apiLogin, register as apiRegister } from './authApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { log } from '../../utils/logger';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    username: string,
    password: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
                                                                        children,
                                                                      }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: '268643532089-0lcasnq6gqjesub9qvaon791gu3a3r06.apps.googleusercontent.com',
    });

    const loadAuthData = async () => {
      log.auth.debug('Restoring auth state from storage...');
      const storedToken = await AsyncStorage.getItem('token');
      const storedUser = await AsyncStorage.getItem('user');

      if (storedToken) {
        setToken(storedToken);
        log.auth.info('Session restored from storage');
      } else {
        log.auth.debug('No stored session found');
      }
      if (storedUser) setUser(JSON.parse(storedUser));

      setLoading(false);
    };

    loadAuthData();
  }, []);

  const login = async (email: string, password: string) => {
    log.auth.info('Login attempt started');
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      setToken(data.token);
      setUser(data.user || null);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user || null));
      log.auth.info('Login successful', { userId: data.user?.id });
    } catch (err: any) {
      log.auth.error('Login failed', err?.response?.data?.message || err?.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    log.auth.info('Registration attempt started', { username });
    setLoading(true);
    try {
      const data = await apiRegister(email, username, password);
      setToken(data.token);
      setUser(data.user || null);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user || null));
      log.auth.info('Registration successful', { userId: data.user?.id });
    } catch (err: any) {
      log.auth.error('Registration failed', err?.response?.data?.message || err?.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    log.auth.info('Google sign-in started');
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      const idToken = (userInfo as any)?.idToken;
      if (!idToken) throw new Error('Google ID token is missing');

      const data = await googleLogin(idToken);

      setToken(data.token);
      setUser(data.user || null);
      await AsyncStorage.setItem('token', data.token);
      await AsyncStorage.setItem('user', JSON.stringify(data.user || null));
      log.auth.info('Google sign-in successful', { userId: data.user?.id });
    } catch (error: any) {
      log.auth.error('Google sign-in failed', error?.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    log.auth.info('User logging out');
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');
    log.auth.info('Logout complete, session cleared');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, loginWithGoogle, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
