import type { Media } from '@/features/media/types';
import type { PageResponse } from '@/shared/types';

export type ModerationReportTargetType = 'Profile' | 'Post' | 'Comment' | 'Media';
export type ModerationMediaContext = 'ProfilePicture' | 'PostImage';
export type ModerationReportReason = 'Spam' | 'Harassment' | 'InappropriateContent' | 'Impersonation' | 'Other';
export type ModerationReportStatus = 'Open' | 'Resolved';
export type ModerationResolutionOutcome = 'Dismissed' | 'ActionTaken';
export type ModerationActionType = 'ReportDismissed' | 'ContentRemoved' | 'ContentRestored' | 'UserSuspended' | 'UserUnsuspended';
export type AdminModerationResolutionAction = 'Dismiss' | 'RemoveTarget' | 'SuspendUser' | 'RemoveTargetAndSuspendUser';

export interface CreateModerationReportRequest {
    targetType: ModerationReportTargetType;
    targetId: string;
    reason: ModerationReportReason;
    details?: string | null;
}

export interface ModerationReportSubmissionResponse {
    id: string;
    status: ModerationReportStatus;
    createdAt: string;
    alreadyReported: boolean;
}

export interface AdminModerationReportFilter {
    status?: ModerationReportStatus | null;
    targetType?: ModerationReportTargetType | null;
    reason?: ModerationReportReason | null;
    page?: number;
    pageSize?: number;
}

export function normalizeAdminModerationReportFilter(filter?: AdminModerationReportFilter) {
    return {
        status: filter?.status === undefined ? 'Open' as ModerationReportStatus : filter.status,
        targetType: filter?.targetType ?? null,
        reason: filter?.reason ?? null,
        page: filter?.page ?? 1,
        pageSize: filter?.pageSize ?? 20,
    };
}

export interface AdminModerationUser {
    id: string;
    userName: string;
    displayName: string;
}

export interface AdminModerationReportListItem {
    id: string;
    status: ModerationReportStatus;
    targetType: ModerationReportTargetType;
    reason: ModerationReportReason;
    createdAt: string;
    reporter: AdminModerationUser;
    subject: AdminModerationUser;
    isTargetCurrentlyRemoved: boolean;
}

export type AdminModerationReportPage = PageResponse<AdminModerationReportListItem>;

export interface AdminModerationQueueSummary {
    openReports: number;
    resolvedReports: number;
}

export interface AdminModerationTarget {
    exists: boolean;
    isRemoved: boolean;
    content?: string | null;
    postId?: string | null;
    profile?: AdminModerationUser | null;
    media?: Media | null;
}

export interface AdminModerationAction {
    id: string;
    actionType: ModerationActionType;
    occurredAt: string;
    note?: string | null;
    suspensionEndsAt?: string | null;
    moderator: AdminModerationUser;
}

export interface AdminModerationReportDetail {
    id: string;
    status: ModerationReportStatus;
    resolutionOutcome?: ModerationResolutionOutcome | null;
    targetType: ModerationReportTargetType;
    targetId: string;
    mediaContext?: ModerationMediaContext | null;
    reason: ModerationReportReason;
    details?: string | null;
    createdAt: string;
    reporter: AdminModerationUser;
    subject: AdminModerationUser;
    targetSnapshotJson: string;
    currentTarget: AdminModerationTarget;
    subjectSuspendedUntil?: string | null;
    actions: AdminModerationAction[];
}

export interface ResolveModerationReportRequest {
    action: AdminModerationResolutionAction;
    moderatorNote?: string | null;
    suspensionDurationDays?: number | null;
}

export interface AdminAccessResponse {
    isAdmin: true;
}

export type DemoDataSeedState = 'NotStarted' | 'Running' | 'Completed' | 'Failed';

export interface DemoDataStatusResponse {
    state: DemoDataSeedState;
    errorMessage: string | null;
}
