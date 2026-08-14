import type { PageRequest } from '@/shared/types';
export type WeeklyCoachReportStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';
export interface GenerateWeeklyCoachReportRequest { periodStart?: string | null; }
export interface WeeklyCoachSectionCoverage { state: string; recordCount: number; }
export interface WeeklyCoachCoverage { workouts: WeeklyCoachSectionCoverage; goals: WeeklyCoachSectionCoverage; challenges: WeeklyCoachSectionCoverage; body: WeeklyCoachSectionCoverage; nutrition: WeeklyCoachSectionCoverage; }
export interface WeeklyCoachObservation { title: string; explanation: string; category: string; evidenceKeys: string[]; }
export interface WeeklyCoachReportContent { headline: string; overview: string; wins: WeeklyCoachObservation[]; patterns: WeeklyCoachObservation[]; nextWeekActions: WeeklyCoachObservation[]; dataLimitations: string[]; }
export interface WeeklyCoachReportListItem { id: string; periodStart: string; periodEnd: string; status: WeeklyCoachReportStatus; hasReportContent: boolean; canRetry: boolean; generationCount: number; requestedAt: string; completedAt?: string | null; failedAt?: string | null; }
export interface WeeklyCoachReport extends WeeklyCoachReportListItem { processingStartedAt?: string | null; failureMessage?: string | null; coverage: WeeklyCoachCoverage; content?: WeeklyCoachReportContent | null; wellnessDisclaimer: string; }
export type WeeklyCoachHistoryFilter = Partial<PageRequest>;

export type CoachGenerationStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed';
export type CoachMessageRole = 'User' | 'Assistant';
export type DailyCoachFocus = 'Train' | 'Recover' | 'StayConsistent' | 'Plan' | 'Nutrition' | 'Wellbeing' | 'InsufficientData';

export interface CreateCoachThreadRequest { title?: string | null; }
export interface UpdateCoachThreadRequest { title: string; }
export type CoachThreadHistoryFilter = Partial<PageRequest>;
export interface SendCoachMessageRequest { clientRequestId: string; content: string; }
export interface SendCoachMessageInput { content: string; clientRequestId?: string; }
export interface CoachMessageHistoryFilter { beforeSequence?: number; pageSize?: number; }

export interface CoachThreadListItem {
    id: string;
    title: string;
    messageCount: number;
    createdAt: string;
    lastActivityAt: string;
}

export type CoachThread = CoachThreadListItem;

export interface CoachSuggestedAction {
    title: string;
    description: string;
    category: string;
}

export interface CoachAnswerContent {
    answerMarkdown: string;
    suggestedActions: CoachSuggestedAction[];
    dataLimitations: string[];
    safetyCategory: string;
    wellnessDisclaimer: string;
}

export interface CoachMessage {
    id: string;
    sequenceNumber: number;
    role: CoachMessageRole;
    status: CoachGenerationStatus;
    content?: string | null;
    answer?: CoachAnswerContent | null;
    requestedAt: string;
    processingStartedAt?: string | null;
    completedAt?: string | null;
    failedAt?: string | null;
    failureMessage?: string | null;
    canRetry: boolean;
}

export interface CoachQueuedExchange {
    userMessage: CoachMessage;
    assistantMessage: CoachMessage;
    accepted: boolean;
}

export interface CoachMessageHistory {
    items: CoachMessage[];
    nextBeforeSequence?: number | null;
}

export interface DailyCoachBriefingContent {
    headline: string;
    focus: string;
    summaryMarkdown: string;
    nextAction: CoachSuggestedAction;
    insightMarkdown: string;
    dataLimitations: string[];
}

export interface DailyCoachBriefing {
    id: string;
    localDate: string;
    status: CoachGenerationStatus;
    requestedAt: string;
    processingStartedAt?: string | null;
    completedAt?: string | null;
    failedAt?: string | null;
    failureMessage?: string | null;
    canRetry: boolean;
    content?: DailyCoachBriefingContent | null;
    wellnessDisclaimer: string;
}
