'use client';

import { useState } from 'react';
import { Alert, Button, Input } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useChangePassword } from '@/features/auth/hooks/useChangePassword';

const STRONG_PASSWORD_HINT = 'At least 8 characters, with an uppercase letter, a lowercase letter, a digit, and a special character.';

function validateNewPassword(password: string): string | null {
    if (password.length < 8) return STRONG_PASSWORD_HINT;
    if (!/[A-Z]/.test(password)) return STRONG_PASSWORD_HINT;
    if (!/[a-z]/.test(password)) return STRONG_PASSWORD_HINT;
    if (!/[0-9]/.test(password)) return STRONG_PASSWORD_HINT;
    if (!/[^a-zA-Z0-9]/.test(password)) return STRONG_PASSWORD_HINT;
    return null;
}

export function ChangePasswordForm() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [validationError, setValidationError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const { mutate, isPending, error, reset } = useChangePassword();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccess(false);
        reset();

        if (newPassword !== confirmPassword) {
            setValidationError("New passwords don't match.");
            return;
        }
        const strengthError = validateNewPassword(newPassword);
        if (strengthError) {
            setValidationError(strengthError);
            return;
        }

        setValidationError(null);
        mutate(
            { currentPassword, newPassword },
            {
                onSuccess: () => {
                    setSuccess(true);
                    setCurrentPassword('');
                    setNewPassword('');
                    setConfirmPassword('');
                },
            }
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 px-4 py-3.5 bg-surface rounded-2xl border border-surface-200">
            <Input
                label="Current password"
                type="password"
                autoComplete="current-password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                required
            />
            <Input
                label="New password"
                type="password"
                autoComplete="new-password"
                hint={STRONG_PASSWORD_HINT}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
            />
            <Input
                label="Confirm new password"
                type="password"
                autoComplete="new-password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
            />

            {validationError && <Alert variant="error">{validationError}</Alert>}
            {error && <Alert variant="error">{getErrorMessage(error, 'Failed to change password.')}</Alert>}
            {success && <Alert variant="success">Password updated.</Alert>}

            <Button type="submit" loading={isPending} disabled={!currentPassword || !newPassword || !confirmPassword}>
                Update password
            </Button>
        </form>
    );
}
