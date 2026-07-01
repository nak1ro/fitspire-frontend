export const SOCIAL_ROUTES = {
    followingFeed: '/api/social/feed',
    discoverFeed: '/api/social/discover',
    feed: '/api/social/feed',
    userPosts: (targetUserId: string) => `/api/social/users/${targetUserId}/posts`,
    posts: '/api/social/posts',
    post: (postId: string) => `/api/social/posts/${postId}`,
    postLikes: (postId: string) => `/api/social/posts/${postId}/likes`,
    like: (postId: string) => `/api/social/posts/${postId}/like`,
    comments: (postId: string) => `/api/social/posts/${postId}/comments`,
    comment: (postId: string, commentId: string) => `/api/social/posts/${postId}/comments/${commentId}`,
    commentReplies: (postId: string, commentId: string) =>
        `/api/social/posts/${postId}/comments/${commentId}/replies`,
    commentLikes: (postId: string, commentId: string) =>
        `/api/social/posts/${postId}/comments/${commentId}/likes`,
    commentLike: (postId: string, commentId: string) =>
        `/api/social/posts/${postId}/comments/${commentId}/like`,
    socialUserSearch: '/api/social/users/search',
    socialUser: (userId: string) => `/api/social/users/${userId}`,
    followers: (userId: string) => `/api/social/users/${userId}/followers`,
    following: (userId: string) => `/api/social/users/${userId}/following`,
    followUser: (userId: string) => `/api/social/users/${userId}/follow`,
    follow: (targetUserId: string) => `/api/social/follow/${targetUserId}`,
    followRequestsIncoming: '/api/social/follow-requests/incoming',
    followRequestsOutgoing: '/api/social/follow-requests/outgoing',
    followRequest: (requestId: string) => `/api/social/follow-requests/${requestId}`,
    workoutShares: '/api/social/workout-shares',
} as const;
