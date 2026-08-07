import { http } from '@/shared/lib/http';
import { SOCIAL_ROUTES } from './routes';
import {
    CommentRequest,
    CommentResponse,
    CreatePostRequest,
    FeedItem,
    FeedPagination,
    FollowRequestResponse,
    FollowResponse,
    LikeResponse,
    PublicBadge,
    PublicChallengeResult,
    PublicGoal,
    PublicGoalPeriod,
    SaveResponse,
    ShareWorkoutRequest,
    SocialProfileResponse,
    SocialUserSummary,
    UpdateCommentRequest,
    UpdatePostRequest,
} from '../types';

function toPaginationQuery(pagination?: FeedPagination) {
    return {
        page: pagination?.page,
        pageSize: pagination?.pageSize,
    };
}

function toSearchQuery(query: string, pagination?: FeedPagination) {
    return {
        query,
        ...toPaginationQuery(pagination),
    };
}

export const getFollowingFeed = (accessToken: string, pagination?: FeedPagination) =>
    http<FeedItem[]>(SOCIAL_ROUTES.followingFeed, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getFeed = getFollowingFeed;

export const getDiscoverFeed = (accessToken: string, pagination?: FeedPagination) =>
    http<FeedItem[]>(SOCIAL_ROUTES.discoverFeed, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getPost = (accessToken: string, postId: string) =>
    http<FeedItem>(SOCIAL_ROUTES.post(postId), { accessToken });

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

export const likePost = (accessToken: string, postId: string) =>
    http<LikeResponse>(SOCIAL_ROUTES.postLikes(postId), {
        method: 'POST',
        accessToken,
    });

export const unlikePost = (accessToken: string, postId: string) =>
    http<LikeResponse>(SOCIAL_ROUTES.postLikes(postId), {
        method: 'DELETE',
        accessToken,
    });

export const savePost = (accessToken: string, postId: string) =>
    http<SaveResponse>(SOCIAL_ROUTES.postSaved(postId), {
        method: 'POST',
        accessToken,
    });

export const unsavePost = (accessToken: string, postId: string) =>
    http<SaveResponse>(SOCIAL_ROUTES.postSaved(postId), {
        method: 'DELETE',
        accessToken,
    });

export const getSavedPosts = (accessToken: string, pagination?: FeedPagination) =>
    http<FeedItem[]>(SOCIAL_ROUTES.savedPosts, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getPostLikes = (accessToken: string, postId: string, pagination?: FeedPagination) =>
    http<SocialUserSummary[]>(SOCIAL_ROUTES.postLikes(postId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getPostComments = (accessToken: string, postId: string, pagination?: FeedPagination) =>
    http<CommentResponse[]>(SOCIAL_ROUTES.comments(postId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const commentOnPost = (accessToken: string, postId: string, data: CommentRequest) =>
    http<string>(SOCIAL_ROUTES.comments(postId), {
        method: 'POST',
        accessToken,
        json: data,
    });

export const getCommentReplies = (
    accessToken: string,
    postId: string,
    commentId: string,
    pagination?: FeedPagination
) =>
    http<CommentResponse[]>(SOCIAL_ROUTES.commentReplies(postId, commentId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const updateComment = (
    accessToken: string,
    postId: string,
    commentId: string,
    data: UpdateCommentRequest
) =>
    http<void>(SOCIAL_ROUTES.comment(postId, commentId), {
        method: 'PATCH',
        accessToken,
        json: data,
    });

export const deleteComment = (accessToken: string, postId: string, commentId: string) =>
    http<void>(SOCIAL_ROUTES.comment(postId, commentId), {
        method: 'DELETE',
        accessToken,
    });

export const likeComment = (accessToken: string, postId: string, commentId: string) =>
    http<LikeResponse>(SOCIAL_ROUTES.commentLikes(postId, commentId), {
        method: 'POST',
        accessToken,
    });

export const unlikeComment = (accessToken: string, postId: string, commentId: string) =>
    http<LikeResponse>(SOCIAL_ROUTES.commentLikes(postId, commentId), {
        method: 'DELETE',
        accessToken,
    });

export const getCommentLikes = (
    accessToken: string,
    postId: string,
    commentId: string,
    pagination?: FeedPagination
) =>
    http<SocialUserSummary[]>(SOCIAL_ROUTES.commentLikes(postId, commentId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const searchSocialUsers = (accessToken: string, query: string, pagination?: FeedPagination) =>
    http<SocialUserSummary[]>(SOCIAL_ROUTES.socialUserSearch, {
        accessToken,
        query: toSearchQuery(query, pagination),
    });

export const getSocialProfile = (accessToken: string, userId: string) =>
    http<SocialProfileResponse>(SOCIAL_ROUTES.socialUser(userId), { accessToken });

export const getFollowers = (accessToken: string, userId: string, pagination?: FeedPagination) =>
    http<SocialUserSummary[]>(SOCIAL_ROUTES.followers(userId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getFollowing = (accessToken: string, userId: string, pagination?: FeedPagination) =>
    http<SocialUserSummary[]>(SOCIAL_ROUTES.following(userId), {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const followUser = (accessToken: string, userId: string) =>
    http<FollowResponse>(SOCIAL_ROUTES.followUser(userId), {
        method: 'POST',
        accessToken,
    });

export const unfollowUser = (accessToken: string, userId: string) =>
    http<void>(SOCIAL_ROUTES.followUser(userId), {
        method: 'DELETE',
        accessToken,
    });

export const removeFollower = (accessToken: string, userId: string) =>
    http<void>(SOCIAL_ROUTES.followers(userId), {
        method: 'DELETE',
        accessToken,
    });

export const getIncomingFollowRequests = (accessToken: string, pagination?: FeedPagination) =>
    http<FollowRequestResponse[]>(SOCIAL_ROUTES.followRequestsIncoming, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const getOutgoingFollowRequests = (accessToken: string, pagination?: FeedPagination) =>
    http<FollowRequestResponse[]>(SOCIAL_ROUTES.followRequestsOutgoing, {
        accessToken,
        query: toPaginationQuery(pagination),
    });

export const cancelFollowRequest = (accessToken: string, requestId: string) =>
    http<void>(SOCIAL_ROUTES.followRequest(requestId), {
        method: 'DELETE',
        accessToken,
    });

export const acceptFollowRequest = (accessToken: string, requestId: string) =>
    http<void>(`${SOCIAL_ROUTES.followRequest(requestId)}/accept`, {
        method: 'POST',
        accessToken,
    });

export const rejectFollowRequest = (accessToken: string, requestId: string) =>
    http<void>(`${SOCIAL_ROUTES.followRequest(requestId)}/reject`, {
        method: 'POST',
        accessToken,
    });

export const shareWorkout = (accessToken: string, data: ShareWorkoutRequest) =>
    http<string>(SOCIAL_ROUTES.workoutShares, {
        method: 'POST',
        accessToken,
        json: data,
    });

export const getPublicGoals = (accessToken: string, userId: string) =>
    http<PublicGoal[]>(SOCIAL_ROUTES.publicGoals(userId), { accessToken });

export const getPublicGoalPeriods = (accessToken: string, userId: string, pagination?: FeedPagination) =>
    http<{ items: PublicGoalPeriod[]; page: number; pageSize: number; totalCount: number }>(
        SOCIAL_ROUTES.publicGoalPeriods(userId),
        { accessToken, query: toPaginationQuery(pagination) }
    );

export const getPublicBadges = (
    accessToken: string,
    userId: string,
    category?: string,
    pagination?: FeedPagination
) => http<{ items: PublicBadge[]; page: number; pageSize: number; totalCount: number }>(
    SOCIAL_ROUTES.publicBadges(userId),
    { accessToken, query: { category, ...toPaginationQuery(pagination) } }
);

export const getPublicFeaturedBadges = (accessToken: string, userId: string) =>
    http<PublicBadge[]>(SOCIAL_ROUTES.publicFeaturedBadges(userId), { accessToken });

export const getPublicChallengeResults = (accessToken: string, userId: string) =>
    http<PublicChallengeResult[]>(SOCIAL_ROUTES.publicChallengeResults(userId), { accessToken });
