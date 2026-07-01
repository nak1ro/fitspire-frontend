export interface ApiError {
    status: number;
    message: string;
    title?: string;
    detail?: string;
    errors?: Record<string, string | string[]>;
}

export interface PageRequest {
    page: number;
    pageSize: number;
}

export interface PageResponse<T> extends PageRequest {
    items: T[];
    totalCount: number;
}

export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };
