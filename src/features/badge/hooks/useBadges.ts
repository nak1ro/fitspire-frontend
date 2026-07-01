'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { socialQueryKeys } from '@/features/social/hooks/queryKeys';
import { getBadgeCatalogue, getMyBadges, setFeaturedBadges } from '../api/client';
import type { BadgeCatalogueFilter, BadgeCollectionFilter, SetFeaturedBadgesRequest } from '../types';
import { badgeQueryKeys } from './queryKeys';

export function useBadgeCatalogue(filter?: BadgeCatalogueFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: badgeQueryKeys.catalogue(filter),
        queryFn: () => getBadgeCatalogue(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken),
    });
}

export function useMyBadges(filter?: BadgeCollectionFilter) {
    const { accessToken } = useAuthSession();
    return useQuery({
        queryKey: badgeQueryKeys.mine(filter),
        queryFn: () => getMyBadges(requireAccessToken(accessToken), filter),
        enabled: Boolean(accessToken),
    });
}

export function useSetFeaturedBadges() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: SetFeaturedBadgesRequest) => setFeaturedBadges(requireAccessToken(accessToken), data),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: badgeQueryKeys.all }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.all }),
            ]);
        },
    });
}
