import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { log } from '../utils/logger';

const API_BASE_URL = 'http://10.0.2.2:5016/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Request interceptor - attach token and log outgoing requests
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      log.api.warn('Failed to retrieve token from storage');
    }

    log.api.debug(`→ ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error: AxiosError) => {
    log.api.error('Request setup failed', error.message);
    return Promise.reject(error);
  }
);

// Response interceptor - log responses and errors
api.interceptors.response.use(
  (response) => {
    log.api.debug(`← ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    const status = error.response?.status;
    const url = error.config?.url;
    const message = (error.response?.data as any)?.message || error.message;

    if (status === 401) {
      log.api.warn(`← 401 Unauthorized: ${url}`);
    } else if (status && status >= 500) {
      log.api.error(`← ${status} Server error: ${url}`, message);
    } else {
      log.api.warn(`← ${status || 'Network'} Error: ${url}`, message);
    }

    return Promise.reject(error);
  }
);

export default api;
