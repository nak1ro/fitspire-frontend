import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { login as apiLogin, register as apiRegister } from './authApi';

interface AuthContextType {
  user: any;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
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
    // Load token on app start
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

  const register = async (email: string, password: string) => {
    setLoading(true);
    const data = await apiRegister(email, password);
    setToken(data.token);
    setUser(data.user || null);
    await AsyncStorage.setItem('token', data.token);
    setLoading(false);
  };

  const logout = async () => {
    setToken(null);
    setUser(null);
    await AsyncStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, register, logout, loading }}
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
