import { QueryClient } from '@tanstack/react-query';
import { workoutQueryKeys } from './queryKeys';

export async function invalidateWorkoutDerivedQueries(queryClient: QueryClient, workoutId?: string) {
    await Promise.all([
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.lists() }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.histories() }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.summaries() }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.personalRecords() }),
        queryClient.invalidateQueries({ queryKey: workoutQueryKeys.activeSession() }),
        ...(workoutId ? [queryClient.invalidateQueries({ queryKey: workoutQueryKeys.detail(workoutId) })] : []),
    ]);
}
