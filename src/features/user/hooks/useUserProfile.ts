'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    attachUserProfilePicture,
    getUserProfile,
    removeUserProfilePicture,
    updateUserProfile,
} from '../api/client';
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

export function useAttachUserProfilePicture() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (mediaAssetId: string) =>
            attachUserProfilePicture(requireAccessToken(accessToken), mediaAssetId),
        onSuccess: async (profile) => {
            queryClient.setQueryData(userQueryKeys.profile(), profile);
            await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
        },
    });
}

export function useRemoveUserProfilePicture() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => removeUserProfilePicture(requireAccessToken(accessToken)),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: userQueryKeys.profile() });
        },
    });
}
