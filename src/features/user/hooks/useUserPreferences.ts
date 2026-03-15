'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getUserPreferences, updateUserPreferences } from '../api/client';
import { UpdateUserPreferencesRequest } from '../types';
import { userQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

export function useUserPreferences() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: userQueryKeys.preferences(),
        queryFn: () => getUserPreferences(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}

export function useUpdateUserPreferences() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateUserPreferencesRequest) =>
            updateUserPreferences(requireAccessToken(accessToken), data),
        onSuccess: async (preferences) => {
            queryClient.setQueryData(userQueryKeys.preferences(), preferences);
            await queryClient.invalidateQueries({ queryKey: userQueryKeys.preferences() });
        },
    });
}
