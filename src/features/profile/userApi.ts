import api from '../../services/api';

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
  console.log('getProfile', res.data);
  if (!res.data) {console.log('no data');}
  return res.data;
};

export const updateProfile = async (dto: UpdateProfileDto): Promise<UserProfileDto> => {
  const res = await api.patch('/user/profile', dto);
  return res.data;
};

export const uploadProfilePhoto = async (uri: string, fileName: string, mime: string): Promise<UserProfileDto> => {
  const form = new FormData();
  form.append('file', { uri, name: fileName, type: mime });
  const res = await api.patch('/user/profile/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const getPreferences = async (): Promise<UserPreferencesDto> => {
  const res = await api.get('/user/preferences');
  return res.data;
};

export const updatePreferences = async (dto: UpdateUserPreferencesDto): Promise<UserPreferencesDto> => {
  const res = await api.patch('/user/preferences', dto);
  return res.data;
};
