/**
 * [Feature] API - Mutations
 * 
 * React Query hooks for creating/updating/deleting data.
 */

import { useMutation, useQueryClient, UseMutationOptions } from '@tanstack/react-query';
import { apiClient } from '@/services';
import { ApiResponse } from '@/common/types';
import { endpoints } from './endpoints';
import { featureKeys } from './queries';
import { FeatureItem, CreateFeatureRequest, UpdateFeatureRequest } from '../types';

// API Functions
const createItem = async (request: CreateFeatureRequest): Promise<FeatureItem> => {
    const { data } = await apiClient.post<ApiResponse<FeatureItem>>(endpoints.create, request);
    return data.data;
};

const updateItem = async ({ id, ...request }: UpdateFeatureRequest & { id: string }): Promise<FeatureItem> => {
    const { data } = await apiClient.put<ApiResponse<FeatureItem>>(endpoints.update(id), request);
    return data.data;
};

const deleteItem = async (id: string): Promise<void> => {
    await apiClient.delete(endpoints.delete(id));
};

// Mutation Hooks
export function useCreateFeature(
    options?: Omit<UseMutationOptions<FeatureItem, Error, CreateFeatureRequest>, 'mutationFn'>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: featureKeys.all });
        },
        ...options,
    });
}

export function useUpdateFeature(
    options?: Omit<UseMutationOptions<FeatureItem, Error, UpdateFeatureRequest & { id: string }>, 'mutationFn'>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: updateItem,
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: featureKeys.detail(variables.id) });
            queryClient.invalidateQueries({ queryKey: featureKeys.lists() });
        },
        ...options,
    });
}

export function useDeleteFeature(
    options?: Omit<UseMutationOptions<void, Error, string>, 'mutationFn'>
) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteItem,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: featureKeys.all });
        },
        ...options,
    });
}
