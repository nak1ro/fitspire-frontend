/**
 * [Feature] API - Endpoints
 * 
 * API endpoint constants for [Feature].
 * Replace [Feature] with your feature name.
 */

const BASE = '/feature-name';

export const endpoints = {
    list: `${BASE}`,
    detail: (id: string) => `${BASE}/${id}`,
    create: `${BASE}`,
    update: (id: string) => `${BASE}/${id}`,
    delete: (id: string) => `${BASE}/${id}`,
} as const;
