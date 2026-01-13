/**
 * Environment Configuration
 * 
 * Centralized environment-specific settings.
 */

export const ENV = {
    isDev: __DEV__,
    isProd: !__DEV__,

    api: {
        baseUrl: __DEV__
            ? 'http://localhost:5000/api'
            : 'https://api.fitspire.app/api',
        timeout: 30000,
    },

    storage: {
        tokenKey: 'authToken',
        themeKey: 'themePreference',
    },
} as const;
