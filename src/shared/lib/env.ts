import { z } from 'zod';

const envSchema = z.object({
    NEXT_PUBLIC_API_URL: z.string().url().default('http://localhost:5000'),
    // Server-only variables
    AUTH_SECRET: z.string().min(1).optional(),
    NEXTAUTH_SECRET: z.string().min(1).optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
});

// Use safeParse to allow client-side build without server secrets
// In a real app, you might distinguish client/server validation
const _env = envSchema.safeParse(process.env);

if (!_env.success) {
    console.error('❌ Invalid environment variables:', _env.error.format());
    throw new Error('Invalid environment variables');
}

export const env = _env.data;
