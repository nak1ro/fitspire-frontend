import { z } from 'zod';

export const signUpSchema = z.object({
    displayName: z
        .string()
        .min(2, 'Display name must be at least 2 characters')
        .max(50, 'Display name is too long')
        .optional()
        .or(z.literal('')),
    userName: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(30, 'Username is too long'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type SignUpData = z.infer<typeof signUpSchema>;
