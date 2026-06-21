import type { ReactNode } from 'react';

interface FormSectionProps {
    title?: string;
    children: ReactNode;
}

export function FormSection({ title, children }: FormSectionProps) {
    return (
        <div className="space-y-3">
            {title && (
                <p className="text-xs font-bold uppercase tracking-widest text-surface-400 px-1">
                    {title}
                </p>
            )}
            <div className="rounded-2xl border border-surface-200 bg-background p-4 space-y-4">
                {children}
            </div>
        </div>
    );
}
