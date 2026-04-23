import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { ForgotPasswordForm } from '@/features/auth/forms/ForgotPasswordForm';

export const metadata: Metadata = {
    title: 'Reset Password | Fitspire',
    description: 'Reset your Fitspire password',
};

export default function ForgotPasswordPage() {
    return (
        <AuthLayout
            eyebrow="Account recovery"
            title="Forgot your password?"
            subtitle="Enter your email and we'll send you a reset link."
        >
            <ForgotPasswordForm />
        </AuthLayout>
    );
}
