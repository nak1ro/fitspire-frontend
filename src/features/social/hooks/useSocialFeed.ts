'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { getFeed, getUserPosts } from '../api/client';
import { FeedPagination } from '../types';
import { socialQueryKeys } from './queryKeys';

export function useSocialFeed(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.feed(pagination),
        queryFn: () => getFeed(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useUserPosts(targetUserId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.userPosts(targetUserId ?? '', pagination),
        queryFn: () => getUserPosts(requireAccessToken(accessToken), targetUserId ?? '', pagination),
        enabled: Boolean(accessToken && targetUserId),
    });
}
