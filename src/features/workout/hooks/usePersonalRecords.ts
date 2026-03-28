'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { getPersonalRecords } from '../api/client';
import { workoutQueryKeys } from './queryKeys';

function requireAccessToken(accessToken: string | null) {
    if (!accessToken) {
        throw new Error('Authentication required');
    }

    return accessToken;
}

export function usePersonalRecords() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.personalRecords(),
        queryFn: () => getPersonalRecords(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}
