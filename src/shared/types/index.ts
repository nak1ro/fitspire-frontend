export interface ApiError {
    status: number;
    message: string;
    title?: string;
    detail?: string;
    errors?: Record<string, string | string[]>;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };
