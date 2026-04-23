import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';
import { SignUpForm } from '@/features/auth/forms/SignUpForm';

export const metadata: Metadata = {
    title: 'Create Account | Fitspire',
    description: 'Join Fitspire and start your fitness journey',
};

export default function SignUpPage() {
    return (
        <AuthLayout
            eyebrow="Get started"
            title="Create your account"
            subtitle="Join thousands tracking their fitness journey."
        >
            <SignUpForm />
        </AuthLayout>
    );
}
