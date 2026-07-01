import type { Media } from '@/features/media/types';
import type { PageRequest } from '@/shared/types';

export type ChallengeMode = 'Target' | 'Leaderboard';
export type ChallengeVisibility = 'Public' | 'FollowersOnly' | 'InviteOnly';
export type ChallengeJoinClosing = 'AtStart' | 'AtEnd';
export type ChallengeStatus = 'Upcoming' | 'Active' | 'Finalizing' | 'Completed' | 'Cancelled';
export type ChallengeRole = 'Created' | 'Joined';
export type ChallengeMembershipStatus = 'Invited' | 'Joined' | 'Left' | 'Removed';
export type ChallengeWorkoutType = 'gym' | 'running' | 'cycling' | 'swimming' | 'yoga';

export interface ChallengeRequest {
    title: string;
    description?: string | null;
    metricCode: string;
    workoutType?: ChallengeWorkoutType | null;
    mode: ChallengeMode;
    targetValue?: number | null;
    visibility: ChallengeVisibility;
    startDate: string;
    endDate: string;
    joinClosing: ChallengeJoinClosing;
    participantLimit: number;
}

export type CreateChallengeRequest = ChallengeRequest;
export type UpdateChallengeRequest = ChallengeRequest;

export interface UpdateActiveChallengeCopyRequest {
    title: string;
    description?: string | null;
}

export interface ChallengeListFilter extends Partial<PageRequest> {
    role?: ChallengeRole;
    status?: ChallengeStatus;
    metricCode?: string;
}

export interface ChallengeResponse {
    id: string;
    title: string;
    description?: string | null;
    metricCode: string;
    workoutType?: ChallengeWorkoutType | null;
    mode: ChallengeMode;
    targetValue?: number | null;
    visibility: ChallengeVisibility;
    startDate: string;
    endDate: string;
    joinClosing: ChallengeJoinClosing;
    participantLimit: number;
    status: ChallengeStatus;
    participantsCount: number;
    isJoined: boolean;
}

export interface ChallengeCreator {
    userId: string;
    userName: string;
    displayName: string;
    profilePictureUrl?: string | null;
    profilePicture?: Media | null;
}

export interface ChallengeViewerState {
    isCreator: boolean;
    membershipStatus?: ChallengeMembershipStatus | null;
    score?: number | null;
    progressPercent?: number | null;
    canJoin: boolean;
    canManage: boolean;
}

export interface ChallengeDetail extends Omit<ChallengeResponse, 'isJoined'> {
    creator: ChallengeCreator;
    viewer: ChallengeViewerState;
}

export interface ChallengeLeaderboardEntry {
    userId: string;
    displayName: string;
    profilePictureUrl?: string | null;
    profilePicture?: Media | null;
    score: number;
    rank: number;
    progressPercent?: number | null;
}

export interface ChallengeInvitation {
    id: string;
    challengeId: string;
    challengeTitle: string;
    invitedByUserId: string;
    invitedByDisplayName: string;
    startDate: string;
    endDate: string;
    status: string;
    createdAt: string;
}

export interface InviteChallengeUserRequest {
    userId: string;
}
