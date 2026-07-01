'use client';

import { useQuery } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    getCommentLikes,
    getCommentReplies,
    getFollowers,
    getFollowing,
    getIncomingFollowRequests,
    getOutgoingFollowRequests,
    getPostComments,
    getPostLikes,
    getPublicBadges,
    getPublicChallengeResults,
    getPublicFeaturedBadges,
    getPublicGoalPeriods,
    getPublicGoals,
    getSocialProfile,
    searchSocialUsers,
} from '../api/client';
import { FeedPagination } from '../types';
import { socialQueryKeys } from './queryKeys';

export function usePostComments(postId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.commentList(postId ?? '', pagination),
        queryFn: () => getPostComments(requireAccessToken(accessToken), postId ?? '', pagination),
        enabled: Boolean(accessToken && postId),
    });
}

export function useCommentReplies(
    postId: string | null,
    commentId: string | null,
    pagination?: FeedPagination
) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.commentReplies(postId ?? '', commentId ?? '', pagination),
        queryFn: () =>
            getCommentReplies(requireAccessToken(accessToken), postId ?? '', commentId ?? '', pagination),
        enabled: Boolean(accessToken && postId && commentId),
    });
}

export function usePostLikes(postId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.postLikes(postId ?? '', pagination),
        queryFn: () => getPostLikes(requireAccessToken(accessToken), postId ?? '', pagination),
        enabled: Boolean(accessToken && postId),
    });
}

export function useCommentLikes(
    postId: string | null,
    commentId: string | null,
    pagination?: FeedPagination
) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.commentLikes(postId ?? '', commentId ?? '', pagination),
        queryFn: () =>
            getCommentLikes(requireAccessToken(accessToken), postId ?? '', commentId ?? '', pagination),
        enabled: Boolean(accessToken && postId && commentId),
    });
}

export function useSocialProfile(userId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.profile(userId ?? ''),
        queryFn: () => getSocialProfile(requireAccessToken(accessToken), userId ?? ''),
        enabled: Boolean(accessToken && userId),
    });
}

export function useSearchSocialUsers(query: string, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();
    const normalizedQuery = query.trim();

    return useQuery({
        queryKey: socialQueryKeys.search(normalizedQuery, pagination),
        queryFn: () => searchSocialUsers(requireAccessToken(accessToken), normalizedQuery, pagination),
        enabled: Boolean(accessToken && normalizedQuery),
    });
}

export function useFollowers(userId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.followers(userId ?? '', pagination),
        queryFn: () => getFollowers(requireAccessToken(accessToken), userId ?? '', pagination),
        enabled: Boolean(accessToken && userId),
    });
}

export function useFollowing(userId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.following(userId ?? '', pagination),
        queryFn: () => getFollowing(requireAccessToken(accessToken), userId ?? '', pagination),
        enabled: Boolean(accessToken && userId),
    });
}

export function useIncomingFollowRequests(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.incomingFollowRequests(pagination),
        queryFn: () => getIncomingFollowRequests(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function useOutgoingFollowRequests(pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.outgoingFollowRequests(pagination),
        queryFn: () => getOutgoingFollowRequests(requireAccessToken(accessToken), pagination),
        enabled: Boolean(accessToken),
    });
}

export function usePublicGoals(userId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.publicGoals(userId ?? ''),
        queryFn: () => getPublicGoals(requireAccessToken(accessToken), userId ?? ''),
        enabled: Boolean(accessToken && userId),
    });
}

export function usePublicGoalPeriods(userId: string | null, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.publicGoalPeriods(userId ?? '', pagination),
        queryFn: () => getPublicGoalPeriods(requireAccessToken(accessToken), userId ?? '', pagination),
        enabled: Boolean(accessToken && userId),
    });
}

export function usePublicBadges(userId: string | null, category?: string, pagination?: FeedPagination) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.publicBadges(userId ?? '', category, pagination),
        queryFn: () => getPublicBadges(requireAccessToken(accessToken), userId ?? '', category, pagination),
        enabled: Boolean(accessToken && userId),
    });
}

export function usePublicFeaturedBadges(userId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.publicFeaturedBadges(userId ?? ''),
        queryFn: () => getPublicFeaturedBadges(requireAccessToken(accessToken), userId ?? ''),
        enabled: Boolean(accessToken && userId),
    });
}

export function usePublicChallengeResults(userId: string | null) {
    const { accessToken } = useAuthSession();

    return useQuery({
        queryKey: socialQueryKeys.publicChallengeResults(userId ?? ''),
        queryFn: () => getPublicChallengeResults(requireAccessToken(accessToken), userId ?? ''),
        enabled: Boolean(accessToken && userId),
    });
}
