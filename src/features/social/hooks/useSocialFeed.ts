'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    getDiscoverFeed,
    getFollowingFeed,
    getPost,
    getSavedPosts,
    getUserPosts,
} from '../api/client';
import { FeedPagination } from '../types';
import { socialQueryKeys } from './queryKeys';

export function useFollowingFeed(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.followingFeed(pagination),
        queryFn: () => getFollowingFeed(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export const useSocialFeed = useFollowingFeed;

export function useDiscoverFeed(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.discoverFeed(pagination),
        queryFn: () => getDiscoverFeed(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useSavedPosts(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.savedPosts(pagination),
        queryFn: () => getSavedPosts(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function usePost(postId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.post(postId ?? ''),
        queryFn: () => getPost(requireAccessToken(accessToken), postId ?? ''),
        enabled: Boolean(accessToken && postId),
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
