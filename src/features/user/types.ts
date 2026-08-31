import { Media } from '@/features/media/types';

export type PreferredLanguage = 'en' | 'es' | 'ru';
export type UnitSystem = 'metric' | 'imperial';
export type FavoriteSport = 'Gym' | 'Running' | 'Cycling' | 'Swimming' | 'Yoga';
export type FitnessLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface UserProfile {
    id: string;
    userName: string;
    displayName: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
    profilePictureMediaId?: string | null;
    profilePicture?: Media | null;
    isPrivate: boolean;
    favoriteSport?: FavoriteSport | null;
    fitnessLevel?: FitnessLevel | null;
    heightCm?: number | null;
}

export interface UpdateUserProfileRequest {
    userName?: string;
    displayName?: string;
    bio?: string | null;
    isPrivate?: boolean;
    favoriteSport?: FavoriteSport;
    fitnessLevel?: FitnessLevel;
    heightCm?: number;
}

export interface UserPreferences {
    preferredLanguage: PreferredLanguage;
    isDarkModeEnabled: boolean;
    receiveEmailNotifications: boolean;
    unitSystem: UnitSystem;
    timeZoneId: string;
}

export interface UpdateUserPreferencesRequest {
    preferredLanguage?: PreferredLanguage;
    isDarkModeEnabled?: boolean;
    receiveEmailNotifications?: boolean;
    unitSystem?: UnitSystem;
    timeZoneId?: string;
}
