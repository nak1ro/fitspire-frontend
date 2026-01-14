/**
 * Auth Feature - Form Validation Schemas
 */

import { z } from 'zod';
import { AUTH_CONSTANTS } from '../constants';

// Login Schema
export const loginSchema = z.object({
    login: z
        .string()
        .min(1, 'Email or username is required')
        .max(AUTH_CONSTANTS.MAX_EMAIL_LENGTH, 'Too long'),
    password: z
        .string()
        .min(1, 'Password is required'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const registerSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address')
        .max(AUTH_CONSTANTS.MAX_EMAIL_LENGTH, 'Email too long'),
    userName: z
        .string()
        .min(3, 'Username must be at least 3 characters')
        .max(AUTH_CONSTANTS.MAX_USERNAME_LENGTH, 'Username too long')
        .regex(/^[a-zA-Z0-9_]+$/, 'Only letters, numbers, and underscores'),
    password: z
        .string()
        .min(AUTH_CONSTANTS.MIN_PASSWORD_LENGTH, `Password must be at least ${AUTH_CONSTANTS.MIN_PASSWORD_LENGTH} characters`),
    confirmPassword: z
        .string()
        .min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot Password Schema
export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'Email is required')
        .email('Invalid email address'),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
