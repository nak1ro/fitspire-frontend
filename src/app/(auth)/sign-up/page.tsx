import { SignUpForm } from '@/features/auth/forms/SignUpForm';
import { Metadata } from 'next';
import { AuthLayout } from '@/features/auth/components/AuthLayout';

export const metadata: Metadata = {
    title: 'Create Account | Fitspire',
    description: 'Create a new account',
};

export default function SignUpPage() {
    return (
        <AuthLayout
            title="Create an account"
            subtitle="Enter your details below to create your account"
        >
            <SignUpForm />
        </AuthLayout>
    );
}
