import { z } from 'zod';

export const STRONG_PASSWORD_HINT = 'At least 6 characters, with a digit.';

export const strongPasswordSchema = z
    .string()
    .min(6, STRONG_PASSWORD_HINT)
    .regex(/[0-9]/, STRONG_PASSWORD_HINT);
