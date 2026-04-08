import { http } from '@/shared/lib/http';
import { SOCIAL_ROUTES } from './routes';
import {
    CommentRequest,
    CreatePostRequest,
    FeedItem,
    FeedPagination,
    FollowResponse,
    LikeResponse,
    UpdatePostRequest,
} from '../types';

function toPaginationQuery(pagination?: FeedPagination) {
    return {
        page: pagination?.page,
        pageSize: pagination?.pageSize,
    };
}

export const getFeed = (accessToken: string, pagination?: FeedPagination) =>
    http<FeedItem[]>(SOCIAL_ROUTES.feed, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getUserPosts = (
    accessToken: string,
    targetUserId: string,
    pagination?: FeedPagination
) =>
    http<FeedItem[]>(SOCIAL_ROUTES.userPosts(targetUserId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const createPost = (accessToken: string, data: CreatePostRequest) =>
    http<string>(SOCIAL_ROUTES.posts, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const updatePost = (accessToken: string, postId: string, data: UpdatePostRequest) =>
    http<void>(SOCIAL_ROUTES.post(postId), {
        method: 'PATCH',
        accessToken,
        json: data,
    });

export const deletePost = (accessToken: string, postId: string) =>
    http<void>(SOCIAL_ROUTES.post(postId), {
        method: 'DELETE',
        accessToken,
    });

export const togglePostLike = (accessToken: string, postId: string) =>
    http<LikeResponse>(SOCIAL_ROUTES.like(postId), {
        method: 'POST',
        accessToken,
    });

export const commentOnPost = (accessToken: string, postId: string, data: CommentRequest) =>
    http<string>(SOCIAL_ROUTES.comments(postId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const deleteComment = (accessToken: string, postId: string, commentId: string) =>
    http<void>(SOCIAL_ROUTES.comment(postId, commentId), {
        method: 'DELETE',
        accessToken,
    });

export const toggleFollowUser = (accessToken: string, targetUserId: string) =>
    http<FollowResponse>(SOCIAL_ROUTES.follow(targetUserId), {
        method: 'POST',
        accessToken,
    });
