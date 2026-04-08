import { FeedPagination } from '../types';

export const socialQueryKeys = {
    all: ['social'] as const,
    feeds: () => [...socialQueryKeys.all, 'feed'] as const,
    feed: (pagination?: FeedPagination) => [...socialQueryKeys.feeds(), pagination ?? {}] as const,
    userPostsRoot: () => [...socialQueryKeys.all, 'user-posts'] as const,
    userPosts: (targetUserId: string, pagination?: FeedPagination) =>
        [...socialQueryKeys.userPostsRoot(), targetUserId, pagination ?? {}] as const,
};
