/**
 * Shared API Types
 * 
 * Generic types for API responses used across all features.
 */

/**
 * Standard API response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

/**
 * Paginated response for list endpoints
 */
export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    pageSize: number;
    totalPages: number;
    totalCount: number;
}

/**
 * Standard error response from API
 */
export interface ApiError {
    message: string;
    code?: string;
    field?: string;
}

/**
 * Request with pagination params
 */
export interface PaginationParams {
    page?: number;
    pageSize?: number;
}
