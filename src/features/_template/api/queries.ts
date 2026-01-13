/**
 * [Feature] API - Queries
 * 
 * React Query hooks for fetching data.
 */

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { apiClient } from '@/services';
import { ApiResponse } from '@/common/types';
import { endpoints } from './endpoints';
import { FeatureItem } from '../types';

// Query Keys
export const featureKeys = {
    all: ['feature'] as const,
    lists: () => [...featureKeys.all, 'list'] as const,
    list: (filters: Record<string, unknown>) => [...featureKeys.lists(), filters] as const,
    details: () => [...featureKeys.all, 'detail'] as const,
    detail: (id: string) => [...featureKeys.details(), id] as const,
};

// API Functions
const fetchList = async (): Promise<FeatureItem[]> => {
    const { data } = await apiClient.get<ApiResponse<FeatureItem[]>>(endpoints.list);
    return data.data;
};

const fetchById = async (id: string): Promise<FeatureItem> => {
    const { data } = await apiClient.get<ApiResponse<FeatureItem>>(endpoints.detail(id));
    return data.data;
};

// Query Hooks
export function useFeatureList(
    options?: Omit<UseQueryOptions<FeatureItem[]>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: featureKeys.all,
        queryFn: fetchList,
        ...options,
    });
}

export function useFeatureDetail(
    id: string,
    options?: Omit<UseQueryOptions<FeatureItem>, 'queryKey' | 'queryFn'>
) {
    return useQuery({
        queryKey: featureKeys.detail(id),
        queryFn: () => fetchById(id),
        enabled: !!id,
        ...options,
    });
}
