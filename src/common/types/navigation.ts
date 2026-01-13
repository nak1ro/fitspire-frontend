/**
 * Navigation Types
 * 
 * Shared navigation param types for all stacks.
 */

/**
 * Auth Stack params
 */
export type AuthStackParamList = {
    Login: undefined;
    Register: undefined;
};

/**
 * Main Stack params
 */
export type MainStackParamList = {
    Home: undefined;
    Profile: undefined;
    OtherUserProfile: {
        displayName: string;
        userName: string;
        bio: string;
        imageUrl?: string | null;
        workouts: WorkoutSummary[];
    };
    Workout: { id: string };
};

/**
 * Tab Navigator params
 */
export type TabParamList = {
    HomeTab: undefined;
    ExploreTab: undefined;
    ProfileTab: undefined;
};

/**
 * Workout summary for navigation
 */
export interface WorkoutSummary {
    id: string;
    title: string;
    durationMinutes: number;
    subtitle?: string;
    badgeLabel?: string;
    kcal?: number;
    avgBpm?: number;
}
