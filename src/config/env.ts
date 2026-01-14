/**
 * Environment Configuration
 * 
 * Non-secret app configuration.
 * For API URLs and secrets, use .env files with @env imports.
 */

import { API_BASE_URL, API_TIMEOUT } from '@env';

export const ENV = {
    isDev: __DEV__,
    isProd: !__DEV__,

    api: {
        baseUrl: API_BASE_URL,
        timeout: parseInt(API_TIMEOUT, 10) || 30000,
    },

    storage: {
        tokenKey: 'authToken',
        themeKey: 'themePreference',
    },
} as const;
