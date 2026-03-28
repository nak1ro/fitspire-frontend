import { ApiError } from '../types';

function isApiError(error: unknown): error is ApiError {
    return (
        typeof error === 'object' &&
        error !== null &&
        'status' in error &&
        'message' in error
    );
}

export function getErrorMessage(error: unknown, fallback: string) {
    if (error instanceof Error) {
        return error.message || fallback;
    }

    if (isApiError(error)) {
        return error.message || error.detail || error.title || fallback;
    }

    if (typeof error === 'string') {
        return error;
    }

    return fallback;
}
