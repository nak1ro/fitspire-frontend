import type { PageRequest } from '@/shared/types';

export type GoalStatus = 'Active' | 'Completed' | 'Archived' | 'Failed';
export type GoalSchedule = 'one-off' | 'daily' | 'weekly' | 'monthly';
export type GoalScope = 'active' | 'history' | 'all';
export type GoalWorkoutType = 'gym' | 'running' | 'cycling' | 'swimming' | 'yoga';

export interface Goal {
    id: string; goalTypeId: string; goalTypeName: string; targetValue: number; currentValue: number; unit: string;
    startDate: string; deadline?: string | null; isRecurring: boolean; recurrencePattern?: GoalSchedule | null;
    status: GoalStatus; isPublic: boolean; currentStreak: number; milestonePercent: number; createdAt: string;
}

export interface GoalType {
    id: string; name: string; description?: string | null; defaultUnit: string; category: string; measurementType: string;
    iconUrl?: string | null; relatedWorkoutType?: GoalWorkoutType | null; relatedMetric?: string | null;
    code: string; metricCode?: string | null; parameterKind: string; allowedSchedules: GoalSchedule[];
}

export interface GoalListFilter extends Partial<PageRequest> { scope?: GoalScope; status?: GoalStatus; }

export interface CreateGoalRequest {
    goalTypeId: string; targetValue: number; schedule: GoalSchedule; deadline?: string | null; isPublic?: boolean;
    selectedWorkoutType?: GoalWorkoutType | null; selectedExerciseId?: string | null; startDate?: string | null;
}

export interface UpdateGoalRequest { targetValue: number; isPublic: boolean; deadline?: string | null; }

export interface GoalPeriod {
    id: string; startAt: string; endAt: string; targetValue: number; progressValue: number; status: string;
    completedAt?: string | null; failedAt?: string | null;
}

export interface GoalDetail { goal: Goal; currentPeriod?: GoalPeriod | null; canEdit: boolean; canArchive: boolean; }
export interface GoalProgressEntry { id: string; previousValue: number; newValue: number; delta: number; recordedAt: string; source?: string | null; }
export interface GoalTargetChange { id: string; previousTargetValue: number; newTargetValue: number; changedAt: string; }
