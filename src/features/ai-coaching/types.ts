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
