import { env } from './env';
import { ApiError } from '../types';

export async function http<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${env.NEXT_PUBLIC_API_URL}${endpoint}`;
    const headers = {
        'Content-Type': 'application/json',
        ...options?.headers,
    };

    const response = await fetch(url, {
        ...options,
        headers,
    });

    if (!response.ok) {
        let errorMessage = response.statusText;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch {
            // Ignore JSON parse error on error response
        }

        // You might want to throw a custom ApiError object here
        const error: ApiError = {
            status: response.status,
            message: errorMessage
        };
        throw error;
    }

    // Handle 204 No Content
    if (response.status === 204) {
        return {} as T;
    }

    return response.json();
}
