import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { googleLogin, login as apiLogin, register as apiRegister } from './authApi';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

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
      webClientId: '268643532089-0lcasnq6gqjesub9qvaon791gu3a3r06.apps.googleusercontent.com', // from Google Cloud Console
    });

    const loadToken = async () => {
      const storedToken = await AsyncStorage.getItem('token');
      if (storedToken) setToken(storedToken);
      setLoading(false);
    };
    loadToken();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    const data = await apiLogin(email, password);
    setToken(data.token);
    setUser(data.user || null); // if your API returns user details
    await AsyncStorage.setItem('token', data.token);
    setLoading(false);
  };

  const register = async (
    email: string,
    username: string,
    password: string,
  ) => {
    setLoading(true);
    const data = await apiRegister(email, username, password);
    setToken(data.token);
    setUser(data.user || null);
    await AsyncStorage.setItem('token', data.token);
    setLoading(false);
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();

      const idToken = (userInfo as any)?.idToken; // quick workaround
      if (!idToken) throw new Error('Google ID token is missing');

      const data = await googleLogin(idToken); // send to backend

      setToken(data.token);
      setUser(data.user || null);
      await AsyncStorage.setItem('token', data.token);
    } catch (error) {
      console.error('Google sign-in failed', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
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
