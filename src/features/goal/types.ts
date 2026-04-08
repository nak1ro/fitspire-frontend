export type GoalStatus = string;
export type GoalRecurrencePattern = 'daily' | 'weekly' | 'monthly';

export interface Goal {
    id: string;
    goalTypeId: string;
    goalTypeName: string;
    targetValue: number;
    currentValue: number;
    unit: string;
    startDate: string;
    deadline?: string | null;
    isRecurring: boolean;
    recurrencePattern?: GoalRecurrencePattern | string | null;
    status: GoalStatus;
    isPublic: boolean;
    currentStreak: number;
    milestonePercent: number;
    createdAt: string;
}

export interface GoalType {
    id: string;
    name: string;
    description?: string | null;
    defaultUnit: string;
    category: string;
    measurementType: string;
    iconUrl?: string | null;
    relatedWorkoutType?: string | null;
    relatedMetric?: string | null;
}

export interface CreateGoalRequest {
    goalTypeId: string;
    targetValue: number;
    unit: string;
    deadline?: string | null;
    isRecurring?: boolean;
    recurrencePattern?: GoalRecurrencePattern | null;
    isPublic?: boolean;
}

export interface UpdateGoalProgressRequest {
    delta: number;
    source?: string | null;
    sourceEntityId?: string | null;
}
