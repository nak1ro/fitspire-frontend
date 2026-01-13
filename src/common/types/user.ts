/**
 * User Types
 * 
 * Shared user-related types used across features.
 */

/**
 * Base user object
 */
export interface User {
    id: string;
    email: string;
    userName: string;
    displayName?: string;
    bio?: string;
    profilePictureUrl?: string | null;
    createdAt: string;
    updatedAt: string;
}

/**
 * User preferences
 */
export interface UserPreferences {
    preferredLanguage: 'en' | 'pl' | 'es';
    isDarkModeEnabled: boolean;
    receiveEmailNotifications: boolean;
    unitSystem: 'metric' | 'imperial';
}

/**
 * Public user profile (what others see)
 */
export interface UserProfile {
    id: string;
    userName: string;
    displayName?: string;
    bio?: string;
    profilePictureUrl?: string | null;
    followersCount: number;
    followingCount: number;
    workoutsCount: number;
}
