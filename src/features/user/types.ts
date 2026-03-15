export type PreferredLanguage = 'en' | 'es' | 'ru';
export type UnitSystem = 'metric' | 'imperial';

export interface UserProfile {
    id: string;
    userName: string;
    displayName: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
    isPrivate: boolean;
}

export interface UpdateUserProfileRequest {
    displayName: string;
    bio?: string | null;
}

export interface UserPreferences {
    preferredLanguage: PreferredLanguage;
    isDarkModeEnabled: boolean;
    receiveEmailNotifications: boolean;
    unitSystem: UnitSystem;
}

export interface UpdateUserPreferencesRequest {
    preferredLanguage?: PreferredLanguage;
    isDarkModeEnabled?: boolean;
    receiveEmailNotifications?: boolean;
    unitSystem?: UnitSystem;
}
