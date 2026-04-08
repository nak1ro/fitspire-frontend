export const SOCIAL_ROUTES = {
    feed: '/api/social/feed',
    userPosts: (targetUserId: string) => `/api/social/users/${targetUserId}/posts`,
    posts: '/api/social/posts',
    post: (postId: string) => `/api/social/posts/${postId}`,
    like: (postId: string) => `/api/social/posts/${postId}/like`,
    comments: (postId: string) => `/api/social/posts/${postId}/comments`,
    comment: (postId: string, commentId: string) => `/api/social/posts/${postId}/comments/${commentId}`,
    follow: (targetUserId: string) => `/api/social/follow/${targetUserId}`,
} as const;
