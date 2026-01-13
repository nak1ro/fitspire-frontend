/**
 * App Configuration
 * 
 * App-wide constants and settings.
 */

export const APP_CONFIG = {
    name: 'Fitspire',
    version: '1.0.0',

    pagination: {
        defaultPageSize: 20,
        maxPageSize: 100,
    },

    limits: {
        maxBioLength: 500,
        maxDisplayNameLength: 50,
        maxWorkoutDurationMinutes: 480,
    },

    animation: {
        fast: 150,
        normal: 250,
        slow: 400,
    },
} as const;
