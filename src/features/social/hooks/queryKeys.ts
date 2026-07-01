import { FeedPagination } from '../types';

export const socialQueryKeys = {
    all: ['social'] as const,
    feeds: () => [...socialQueryKeys.all, 'feed'] as const,
    followingFeed: (pagination?: FeedPagination) =>
        [...socialQueryKeys.feeds(), 'following', pagination ?? {}] as const,
    discoverFeed: (pagination?: FeedPagination) =>
        [...socialQueryKeys.feeds(), 'discover', pagination ?? {}] as const,
    feed: (pagination?: FeedPagination) => socialQueryKeys.followingFeed(pagination),
    userPostsRoot: () => [...socialQueryKeys.all, 'user-posts'] as const,
    userPosts: (targetUserId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.userPostsRoot(), targetUserId, pagination ?? {}] as const,
    posts: () => [...socialQueryKeys.all, 'posts'] as const,
    post: (postId: string) => [...socialQueryKeys.posts(), postId] as const,
    comments: (postId: string) => [...socialQueryKeys.post(postId), 'comments'] as const,
    commentList: (postId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.comments(postId), pagination ?? {}] as const,
    commentReplies: (postId: string, commentId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.comments(postId), 'replies', commentId, pagination ?? {}] as const,
    postLikes: (postId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.post(postId), 'likes', pagination ?? {}] as const,
    commentLikes: (postId: string, commentId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.comments(postId), commentId, 'likes', pagination ?? {}] as const,
    profiles: () => [...socialQueryKeys.all, 'profiles'] as const,
    profile: (userId: string) => [...socialQueryKeys.profiles(), userId] as const,
    search: (query: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.profiles(), 'search', query, pagination ?? {}] as const,
    connections: (userId: string) => [...socialQueryKeys.profile(userId), 'connections'] as const,
    followers: (userId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.connections(userId), 'followers', pagination ?? {}] as const,
    following: (userId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.connections(userId), 'following', pagination ?? {}] as const,
    followRequests: () => [...socialQueryKeys.all, 'follow-requests'] as const,
    incomingFollowRequests: (pagination?: FeedPagination) =>
        [...socialQueryKeys.followRequests(), 'incoming', pagination ?? {}] as const,
    outgoingFollowRequests: (pagination?: FeedPagination) =>
        [...socialQueryKeys.followRequests(), 'outgoing', pagination ?? {}] as const,
};
