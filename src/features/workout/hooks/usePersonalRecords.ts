'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getPersonalRecords } from '../api/client';
import { workoutQueryKeys } from './queryKeys';

export function usePersonalRecords() {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: workoutQueryKeys.personalRecords(),
        queryFn: () => getPersonalRecords(requireAccessToken(accessToken)),
        enabled: Boolean(accessToken),
    });
}
