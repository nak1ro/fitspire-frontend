import { env } from './env';
import { ApiError } from '../types';

export type QueryValue = string | number | boolean | null | undefined;
export type QueryParams = Record<string, QueryValue | QueryValue[]>;

export interface HttpOptions extends Omit<RequestInit, 'body'> {
    accessToken?: string | null;
    formData?: FormData;
    json?: unknown;
    query?: QueryParams;
}

function buildUrl(endpoint: string, query?: QueryParams) {
    const url = endpoint.startsWith('http')
        ? new URL(endpoint)
        : new URL(`${env.NEXT_PUBLIC_API_URL}${endpoint}`);

    if (!query) {
        return url.toString();
    }

    Object.entries(query).forEach(([key, value]) => {
        const values = Array.isArray(value) ? value : [value];

        values.forEach((item) => {
            if (item !== null && item !== undefined) {
                url.searchParams.append(key, String(item));
            }
        });
    });

    return url.toString();
}

async function parseBody(response: Response): Promise<unknown> {
    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    try {
        return JSON.parse(text);
    } catch {
        return text;
    }
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getString(value: unknown) {
    return typeof value === 'string' ? value : undefined;
}

function parseErrors(value: unknown): ApiError['errors'] {
    if (!isRecord(value)) {
        return undefined;
    }

    const errors: Record<string, string | string[]> = {};

    Object.entries(value).forEach(([key, item]) => {
        if (typeof item === 'string') {
            errors[key] = item;
            return;
        }

        if (Array.isArray(item)) {
            const messages = item.filter((message): message is string => typeof message === 'string');

            if (messages.length > 0) {
                errors[key] = messages;
            }
        }
    });

    return Object.keys(errors).length > 0 ? errors : undefined;
}

async function parseApiError(response: Response): Promise<ApiError> {
    const data = await parseBody(response);

    if (isRecord(data)) {
        const title = getString(data.title);
        const detail = getString(data.detail);
        const message = getString(data.message) ?? detail ?? title ?? response.statusText;

        return {
            status: response.status,
            message,
            title,
            detail,
            errors: parseErrors(data.errors),
        };
    }

    const message = typeof data === 'string' ? data : response.statusText;

    return {
        status: response.status,
        message: message || `Request failed with status ${response.status}`,
    };
}

export async function http<T>(endpoint: string, options: HttpOptions = {}): Promise<T> {
    const { accessToken, formData, headers: requestHeaders, json, query, ...fetchOptions } = options;
    const headers = new Headers(requestHeaders);
    let body: BodyInit | undefined;

    if (formData && json !== undefined) {
        throw new Error('Use either formData or json for a request body, not both');
    }

    if (accessToken) {
        headers.set('Authorization', `Bearer ${accessToken}`);
    }

    if (formData) {
        body = formData;
    } else if (json !== undefined) {
        headers.set('Content-Type', headers.get('Content-Type') ?? 'application/json');
        body = JSON.stringify(json);
    }

    const response = await fetch(buildUrl(endpoint, query), {
        ...fetchOptions,
        headers,
        body,
    });

    if (!response.ok) {
        throw await parseApiError(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return (await parseBody(response)) as T;
}
