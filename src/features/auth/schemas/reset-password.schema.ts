import { z } from 'zod';
import { strongPasswordSchema } from '@/shared/lib/strongPassword';

export const resetPasswordSchema = z.object({
    newPassword: strongPasswordSchema,
    confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;
