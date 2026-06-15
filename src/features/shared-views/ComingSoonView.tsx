import type { LucideIcon } from 'lucide-react';

interface ComingSoonViewProps {
    icon: LucideIcon;
    title: string;
    subtitle: string;
}

export function ComingSoonView({ icon: Icon, title, subtitle }: ComingSoonViewProps) {
    return (
        <div className="flex flex-col items-center text-center py-24 px-6 space-y-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center bg-primary-50">
                <Icon className="h-7 w-7 text-primary-500" aria-hidden="true" />
            </div>
            <div className="space-y-1">
                <h2 className="text-base font-bold text-foreground">{title}</h2>
                <p className="text-sm text-surface-500 max-w-xs">{subtitle}</p>
            </div>
        </div>
    );
}
