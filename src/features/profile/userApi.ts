import api from '../../services/api';
import { log } from '../../utils/logger';

export type UserProfileDto = {
  id: string;
  userName: string;
  displayName: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  createdAt: string;
};

export type UserPreferencesDto = {
  preferredLanguage: string;
  isDarkModeEnabled: boolean;
  receiveEmailNotifications: boolean;
  unitSystem: string; // "metric" | "imperial"
};

export type UpdateProfileDto = {
  displayName?: string | null;
  bio?: string | null;
};

export type UpdateUserPreferencesDto = Partial<UserPreferencesDto>;

export const getProfile = async (): Promise<UserProfileDto> => {
  const res = await api.get('/user/profile');
  log.profile.debug('Profile loaded', { userName: res.data?.userName });
  return res.data;
};

export const updateProfile = async (dto: UpdateProfileDto): Promise<UserProfileDto> => {
  log.profile.info('Updating profile', dto);
  const res = await api.patch('/user/profile', dto);
  log.profile.info('Profile updated successfully');
  return res.data;
};

export const uploadProfilePhoto = async (uri: string, fileName: string, mime: string): Promise<UserProfileDto> => {
  log.profile.info('Uploading profile photo', { fileName });
  const form = new FormData();
  form.append('file', { uri, name: fileName, type: mime });
  const res = await api.patch('/user/profile/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  log.profile.info('Profile photo uploaded');
  return res.data;
};

export const getPreferences = async (): Promise<UserPreferencesDto> => {
  const res = await api.get('/user/preferences');
  log.profile.debug('Preferences loaded');
  return res.data;
};

export const updatePreferences = async (dto: UpdateUserPreferencesDto): Promise<UserPreferencesDto> => {
  log.profile.info('Updating preferences', dto);
  const res = await api.patch('/user/preferences', dto);
  log.profile.info('Preferences updated successfully');
  return res.data;
};
