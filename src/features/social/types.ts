export interface FeedPagination {
    page?: number;
    pageSize?: number;
}

export type SocialPagination = FeedPagination;

export interface WorkoutSummary {
    id: string;
    workoutType: string;
    date: string;
    durationMinutes?: number | null;
    distanceKm?: number | null;
    caloriesBurned?: number | null;
    totalVolumeKg?: number | null;
    exerciseCount?: number | null;
    completedAt?: string | null;
}

export interface CommentPreview {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    content: string;
    createdAt: string;
}

export interface FeedItem {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    type: string;
    content?: string | null;
    referenceEntityId?: string | null;
    workoutSummary?: WorkoutSummary | null;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    commentsCount: number;
    recentComments: CommentPreview[];
    createdAt: string;
}

export interface CreatePostRequest {
    content: string;
    imageUrl?: string | null;
}

export interface UpdatePostRequest {
    content: string;
    imageUrl?: string | null;
}

export interface CommentRequest {
    content: string;
    replyToCommentId?: string | null;
}

export interface UpdateCommentRequest {
    content: string;
}

export interface CommentResponse {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    content: string;
    rootCommentId?: string | null;
    replyToCommentId?: string | null;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    repliesCount: number;
    createdAt: string;
    updatedAt?: string | null;
}

export interface LikeResponse {
    isLiked: boolean;
}

export interface FollowResponse {
    isFollowing: boolean;
    isRequestPending: boolean;
}

export interface ShareWorkoutRequest {
    workoutId: string;
    caption?: string | null;
}

export interface SocialUserSummary {
    id: string;
    userName: string;
    displayName: string;
    profilePictureUrl?: string | null;
}

export type SocialRelationship =
    | 'self'
    | 'following'
    | 'outgoing-request-pending'
    | 'not-following'
    | string;

export interface SocialProfileResponse {
    id: string;
    userName: string;
    displayName: string;
    bio?: string | null;
    profilePictureUrl?: string | null;
    isPrivate: boolean;
    followersCount: number;
    followingCount: number;
    relationship: SocialRelationship;
}

export interface FollowRequestResponse {
    id: string;
    userId: string;
    userName: string;
    displayName: string;
    profilePictureUrl?: string | null;
    requestedAt: string;
}
