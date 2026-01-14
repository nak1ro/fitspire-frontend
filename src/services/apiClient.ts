/**
 * Shared Axios API Client
 * 
 * All features should use this client for API calls.
 * Centralizes base URL, headers, and interceptors.
 */

import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL, API_TIMEOUT } from '@env';

const TOKEN_KEY = 'authToken';

/**
 * Create configured Axios instance
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: parseInt(API_TIMEOUT, 10) || 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor - adds auth token
 */
apiClient.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const token = await AsyncStorage.getItem(TOKEN_KEY);
        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => Promise.reject(error)
);

/**
 * Response interceptor - handles common errors
 */
apiClient.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Token expired or invalid - could trigger logout here
        }
        return Promise.reject(error);
    }
);

export { apiClient };
export default apiClient;
