import { ForgotPasswordForm } from '@/features/auth/forms/ForgotPasswordForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Forgot Password | Fitspire',
    description: 'Reset your password',
};

export default function ForgotPasswordPage() {
    return <ForgotPasswordForm />;
}
