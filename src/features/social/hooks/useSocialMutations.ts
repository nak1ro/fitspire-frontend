'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import { notificationQueryKeys } from '@/features/notification/hooks/queryKeys';
import {
    acceptFollowRequest,
    cancelFollowRequest,
    commentOnPost,
    createPost,
    deleteComment,
    deletePost,
    followUser,
    likeComment,
    likePost,
    rejectFollowRequest,
    removeFollower,
    shareWorkout,
    unlikeComment,
    unlikePost,
    unfollowUser,
    updateComment,
    updatePost,
} from '../api/client';
import {
    CommentRequest,
    CreatePostRequest,
    ShareWorkoutRequest,
    UpdateCommentRequest,
    UpdatePostRequest,
} from '../types';
import { socialQueryKeys } from './queryKeys';

async function invalidateFeedReads(queryClient: ReturnType<typeof useQueryClient>) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: socialQueryKeys.feeds() }),
        queryClient.invalidateQueries({ queryKey: socialQueryKeys.userPostsRoot() }),
    ]);
}

async function invalidatePostReads(
    queryClient: ReturnType<typeof useQueryClient>,
    postId: string
) {
    await Promise.all([
        invalidateFeedReads(queryClient),
        queryClient.invalidateQueries({ queryKey: socialQueryKeys.post(postId) }),
        queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
    ]);
}

export function useCreatePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostRequest) => createPost(requireAccessToken(accessToken), data),
        onSuccess: async () => invalidateFeedReads(queryClient),
    });
}

export function useUpdatePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) =>
            updatePost(requireAccessToken(accessToken), postId, data),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useDeletePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost(requireAccessToken(accessToken), postId),
        onSuccess: async (_, postId) => invalidatePostReads(queryClient, postId),
    });
}

export function useLikePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => likePost(requireAccessToken(accessToken), postId),
        onSuccess: async (_, postId) => invalidatePostReads(queryClient, postId),
    });
}

export function useUnlikePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => unlikePost(requireAccessToken(accessToken), postId),
        onSuccess: async (_, postId) => invalidatePostReads(queryClient, postId),
    });
}

export function useCommentOnPost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: CommentRequest }) =>
            commentOnPost(requireAccessToken(accessToken), postId, data),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useUpdateComment() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId, data }: {
            postId: string;
            commentId: string;
            data: UpdateCommentRequest;
        }) => updateComment(requireAccessToken(accessToken), postId, commentId, data),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useDeleteComment() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
            deleteComment(requireAccessToken(accessToken), postId, commentId),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useLikeComment() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
            likeComment(requireAccessToken(accessToken), postId, commentId),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useUnlikeComment() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
            unlikeComment(requireAccessToken(accessToken), postId, commentId),
        onSuccess: async (_, variables) => invalidatePostReads(queryClient, variables.postId),
    });
}

export function useFollowUser() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => followUser(requireAccessToken(accessToken), userId),
        onSuccess: async (_, userId) => {
            await Promise.all([
                invalidateFeedReads(queryClient),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profile(userId) }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profiles() }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.followRequests() }),
                queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
            ]);
        },
    });
}

export function useUnfollowUser() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => unfollowUser(requireAccessToken(accessToken), userId),
        onSuccess: async (_, userId) => {
            await Promise.all([
                invalidateFeedReads(queryClient),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profile(userId) }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profiles() }),
            ]);
        },
    });
}

export function useRemoveFollower() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => removeFollower(requireAccessToken(accessToken), userId),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: socialQueryKeys.profiles() }),
    });
}

export function useCancelFollowRequest() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => cancelFollowRequest(requireAccessToken(accessToken), requestId),
        onSuccess: async () => queryClient.invalidateQueries({ queryKey: socialQueryKeys.followRequests() }),
    });
}

export function useAcceptFollowRequest() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => acceptFollowRequest(requireAccessToken(accessToken), requestId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.followRequests() }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profiles() }),
                invalidateFeedReads(queryClient),
                queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
            ]);
        },
    });
}

export function useRejectFollowRequest() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (requestId: string) => rejectFollowRequest(requireAccessToken(accessToken), requestId),
        onSuccess: async () => {
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.followRequests() }),
                queryClient.invalidateQueries({ queryKey: socialQueryKeys.profiles() }),
            ]);
        },
    });
}

export function useShareWorkout() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: ShareWorkoutRequest) => shareWorkout(requireAccessToken(accessToken), data),
        onSuccess: async () => {
            await Promise.all([
                invalidateFeedReads(queryClient),
                queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all }),
            ]);
        },
    });
}
