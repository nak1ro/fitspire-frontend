import { ReactNode } from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from '../lib/cn';

type AlertVariant = 'error' | 'success' | 'warning' | 'info';

interface AlertProps {
    variant?: AlertVariant;
    title?: string;
    children: ReactNode;
    className?: string;
}

const config: Record<AlertVariant, {
    bg: string;
    border: string;
    Icon: typeof AlertCircle;
    color: string;
    titleColor: string;
}> = {
    error: {
        bg:         'rgba(179,64,64,0.06)',
        border:     'rgba(179,64,64,0.20)',
        Icon:       AlertCircle,
        color:      '#B34040',
        titleColor: '#8A2E2E',
    },
    success: {
        bg:         'rgba(74,124,95,0.06)',
        border:     'rgba(74,124,95,0.20)',
        Icon:       CheckCircle,
        color:      '#4A7C5F',
        titleColor: '#345A44',
    },
    warning: {
        bg:         'rgba(184,134,11,0.06)',
        border:     'rgba(184,134,11,0.20)',
        Icon:       AlertTriangle,
        color:      '#B8860B',
        titleColor: '#8A6408',
    },
    info: {
        bg:         'rgba(194,109,56,0.06)',
        border:     'rgba(194,109,56,0.20)',
        Icon:       Info,
        color:      '#A85A28',
        titleColor: '#7A3F18',
    },
};

export function Alert({ variant = 'error', title, children, className }: AlertProps) {
    const { bg, border, Icon, color, titleColor } = config[variant];

    return (
        <div
            role="alert"
            className={cn('flex gap-3 rounded-xl p-4', className)}
            style={{ backgroundColor: bg, border: `1px solid ${border}` }}
        >
            <Icon
                className="h-4 w-4 mt-0.5 shrink-0"
                style={{ color }}
                aria-hidden="true"
            />
            <div className="space-y-0.5 min-w-0">
                {title && (
                    <p className="text-sm font-semibold leading-snug" style={{ color: titleColor }}>
                        {title}
                    </p>
                )}
                <p className="text-sm leading-relaxed" style={{ color }}>{children}</p>
            </div>
        </div>
    );
}
