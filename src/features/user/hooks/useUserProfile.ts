'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getUserProfile, updateUserProfile, updateUserProfilePhoto } from '../api/client';
import { UpdateUserProfileRequest } from '../types';
import { userQueryKeys } from './queryKeys';

export function useUserProfile() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: userQueryKeys.profile(),
        queryFn: () => getUserProfile(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useUpdateUserProfile() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserProfileRequest) =>
            updateUserProfile(requireAccessToken(accessToken), data),
        onSuccess: async (profile) => {
            queryClient.setQueryData(userQueryKeys.profile(), profile);
            await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
        },
    });
}

export function useUpdateUserProfilePhoto() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (file: File) => updateUserProfilePhoto(requireAccessToken(accessToken), file),
        onSuccess: async (profile) => {
            queryClient.setQueryData(userQueryKeys.profile(), profile);
            await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
        },
    });
}
