export interface FeedPagination {
    page?: number;
    pageSize?: number;
}

export interface WorkoutSummary {
    id: string;
    workoutType: string;
    date: string;
    durationMinutes?: number | null;
    distanceKm?: number | null;
    caloriesBurned?: number | null;
    totalVolumeKg?: number | null;
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
}

export interface LikeResponse {
    isLiked: boolean;
}

export interface FollowResponse {
    isFollowing: boolean;
}
