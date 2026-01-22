export interface ApiError {
    status: number;
    message: string;
}

export interface Pagination {
    page: number;
    pageSize: number;
    total: number;
}

export type Result<T> =
    | { success: true; data: T }
    | { success: false; error: string };
