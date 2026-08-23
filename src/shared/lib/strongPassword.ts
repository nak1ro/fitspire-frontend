import { z } from 'zod';

export const STRONG_PASSWORD_HINT =
    'At least 8 characters, with an uppercase letter, a lowercase letter, a digit, and a special character.';

export const strongPasswordSchema = z
    .string()
    .min(8, STRONG_PASSWORD_HINT)
    .regex(/[A-Z]/, STRONG_PASSWORD_HINT)
    .regex(/[a-z]/, STRONG_PASSWORD_HINT)
    .regex(/[0-9]/, STRONG_PASSWORD_HINT)
    .regex(/[^a-zA-Z0-9]/, STRONG_PASSWORD_HINT);
