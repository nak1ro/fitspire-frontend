'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { requireAccessToken } from '@/features/auth/lib/requireAccessToken';
import {
    commentOnPost,
    createPost,
    deleteComment,
    deletePost,
    toggleFollowUser,
    togglePostLike,
    updatePost,
} from '../api/client';
import { CommentRequest, CreatePostRequest, UpdatePostRequest } from '../types';
import { socialQueryKeys } from './queryKeys';

async function invalidateSocialReads(queryClient: ReturnType<typeof useQueryClient>) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: socialQueryKeys.feeds() }),
        queryClient.invalidateQueries({ queryKey: socialQueryKeys.userPostsRoot() }),
    ]);
}

export function useCreatePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: CreatePostRequest) => createPost(requireAccessToken(accessToken), data),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useUpdatePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: UpdatePostRequest }) =>
            updatePost(requireAccessToken(accessToken), postId, data),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useDeletePost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => deletePost(requireAccessToken(accessToken), postId),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useTogglePostLike() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (postId: string) => togglePostLike(requireAccessToken(accessToken), postId),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useCommentOnPost() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, data }: { postId: string; data: CommentRequest }) =>
            commentOnPost(requireAccessToken(accessToken), postId, data),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useDeleteComment() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ postId, commentId }: { postId: string; commentId: string }) =>
            deleteComment(requireAccessToken(accessToken), postId, commentId),
        onSuccess: async () => {
            await invalidateSocialReads(queryClient);
        },
    });
}

export function useToggleFollowUser() {
    const { accessToken } = useAuthSession();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (targetUserId: string) => toggleFollowUser(requireAccessToken(accessToken), targetUserId),
        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: socialQueryKeys.feeds() });
        },
    });
}
