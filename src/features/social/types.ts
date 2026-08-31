import { Media } from '@/features/media/types';
import type { FavoriteSport, FitnessLevel } from '@/features/user/types';

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

export interface GoalSummary {
    id: string;
    goalTypeName: string;
    targetValue: number;
    unit: string;
    completedAt: string;
}

export interface PersonalRecordSummary {
    id: string;
    workoutType: string;
    metric: string;
    unit: string;
    value: number;
    exerciseName?: string | null;
    achievedAt: string;
}

export interface CommentPreview {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    userAvatar?: Media | null;
    content: string;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    createdAt: string;
}

export interface FeedItem {
    id: string;
    userId: string;
    userName: string;
    userAvatarUrl?: string | null;
    userAvatar?: Media | null;
    media: Media[];
    type: string;
    content?: string | null;
    referenceEntityId?: string | null;
    workoutSummary?: WorkoutSummary | null;
    goalSummary?: GoalSummary | null;
    personalRecordSummary?: PersonalRecordSummary | null;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    isSavedByCurrentUser: boolean;
    commentsCount: number;
    recentComments: CommentPreview[];
    createdAt: string;
}

export interface CreatePostRequest {
    content?: string | null;
    mediaAssetIds?: string[] | null;
}

export interface UpdatePostRequest {
    content?: string | null;
    mediaAssetIds?: string[] | null;
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
    userAvatar?: Media | null;
    content: string;
    rootCommentId?: string | null;
    replyToCommentId?: string | null;
    likesCount: number;
    isLikedByCurrentUser: boolean;
    repliesCount: number;
    createdAt: string;
    updatedAt?: string | null;
    replyToUser?: SocialUserSummary | null;
}

export interface LikeResponse {
    isLiked: boolean;
}

export interface SaveResponse {
    isSaved: boolean;
}

export interface FollowResponse {
    isFollowing: boolean;
    isRequestPending: boolean;
}

export interface ShareWorkoutRequest {
    workoutId: string;
    caption?: string | null;
    mediaAssetIds?: string[] | null;
}

export interface ShareGoalRequest {
    goalId: string;
    caption?: string | null;
    mediaAssetIds?: string[] | null;
}

export interface SharePersonalRecordRequest {
    personalRecordId: string;
    caption?: string | null;
    mediaAssetIds?: string[] | null;
}

export interface SocialUserSummary {
    id: string;
    userName: string;
    displayName: string;
    profilePictureUrl?: string | null;
    profilePicture?: Media | null;
}

export interface DiscoverableSocialUser extends SocialUserSummary {
    reason?: string | null;
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
    profilePicture?: Media | null;
    isPrivate: boolean;
    followersCount: number;
    followingCount: number;
    relationship: SocialRelationship;
    favoriteSport?: FavoriteSport | null;
    fitnessLevel?: FitnessLevel | null;
}

export interface PublicPersonalRecord {
    id: string;
    workoutType: string;
    metric: string;
    unit: string;
    value: number;
    exerciseName?: string | null;
    achievedAt: string;
}

export interface FollowRequestResponse {
    id: string;
    userId: string;
    userName: string;
    displayName: string;
    profilePictureUrl?: string | null;
    profilePicture?: Media | null;
    requestedAt: string;
}

export interface PublicGoal {
    id: string;
    templateName: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    status: string;
    isRecurring: boolean;
    createdAt: string;
}

export interface PublicGoalPeriod {
    goalId: string;
    templateName: string;
    startAt: string;
    endAt: string;
    targetValue: number;
    progressValue: number;
    completedAt: string;
}

export interface PublicBadgeEvidence {
    criterionCode?: string | null;
    threshold?: number | null;
    achievedValue?: number | null;
    canonicalUnit?: string | null;
    summary?: string | null;
}

export interface PublicBadge {
    badgeId: string;
    code: string;
    name: string;
    description?: string | null;
    iconUrl?: string | null;
    category: string;
    seriesCode?: string | null;
    tier: string;
    awardedAt: string;
    featuredOrder?: number | null;
    evidence: PublicBadgeEvidence;
}

export interface PublicChallengeResult {
    challengeId: string;
    challengeTitle: string;
    mode: string;
    score: number;
    rank: number;
    isFinisher: boolean;
    isWinner: boolean;
    finalizedAt: string;
}
