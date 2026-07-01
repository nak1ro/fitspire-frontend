import { Media } from '@/features/media/types';

export type PreferredLanguage = 'en' | 'es' | 'ru';
export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
    id: string;
    userName: string;
    displayName: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
    profilePictureMediaId?: string | null;
    profilePicture?: Media | null;
    isPrivate: boolean;
}

export interface UpdateUserProfileRequest {
    displayName?: string;
    bio?: string | null;
    isPrivate?: boolean;
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
