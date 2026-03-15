import { http } from '@/shared/lib/http';
import { USER_ROUTES } from './routes';
import {
    UpdateUserPreferencesRequest,
    UpdateUserProfileRequest,
    UserPreferences,
    UserProfile,
} from '../types';

export const getUserProfile = (accessToken: string) =>
    http<UserProfile>(USER_ROUTES.profile, {
        accessToken,
    });

export const updateUserProfile = (accessToken: string, data: UpdateUserProfileRequest) =>
    http<UserProfile>(USER_ROUTES.profile, {
        method: 'PATCH',
        accessToken,
        json: data,
    });

export const updateUserProfilePhoto = (accessToken: string, file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return http<UserProfile>(USER_ROUTES.profilePhoto, {
        method: 'PATCH',
        accessToken,
        formData,
    });
};

export const getUserPreferences = (accessToken: string) =>
    http<UserPreferences>(USER_ROUTES.preferences, {
        accessToken,
    });

export const updateUserPreferences = (accessToken: string, data: UpdateUserPreferencesRequest) =>
    http<UserPreferences>(USER_ROUTES.preferences, {
        method: 'PATCH',
        accessToken,
        json: data,
    });
