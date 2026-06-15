import type { AuthMode } from '../hooks/useAuthMode';
import { AuthTabs } from './AuthTabs';
import { AuthFooter } from './AuthFooter';
import { AuthCardHeader } from './AuthCardHeader';
import { SignInForm } from '../forms/SignInForm';
import { SignUpForm } from '../forms/SignUpForm';
import { ForgotPasswordForm } from '../forms/ForgotPasswordForm';

const COPY: Record<AuthMode, { eyebrow: string; title: string; subtitle: string }> = {
    login: {
        eyebrow: 'Welcome back',
        title: 'Sign in',
        subtitle: 'Good to have you back.',
    },
    signup: {
        eyebrow: 'Get started',
        title: 'Create your account',
        subtitle: 'Join thousands tracking their fitness journey.',
    },
    'forgot-password': {
        eyebrow: 'Account recovery',
        title: 'Forgot your password?',
        subtitle: "Enter your email and we'll send you a reset link.",
    },
};

interface AuthCardProps {
    mode: AuthMode;
}

export function AuthCard({ mode }: AuthCardProps) {
    const { eyebrow, title, subtitle } = COPY[mode];

    return (
        <div className="p-6">
            <AuthCardHeader eyebrow={eyebrow} title={title} subtitle={subtitle} />

            {mode !== 'forgot-password' && (
                <div className="mb-5">
                    <AuthTabs mode={mode} />
                </div>
            )}

            <div role="tabpanel">
                {mode === 'login' && <SignInForm />}
                {mode === 'signup' && <SignUpForm />}
                {mode === 'forgot-password' && <ForgotPasswordForm />}
            </div>

            <AuthFooter mode={mode} />
        </div>
    );
}
