interface AuthCardHeaderProps {
    eyebrow: string;
    title: string;
    subtitle: string;
}

export function AuthCardHeader({ eyebrow, title, subtitle }: AuthCardHeaderProps) {
    return (
        <div className="mb-6">
            <p className="text-xs font-semibold tracking-widest uppercase text-primary-500 mb-1.5">
                {eyebrow}
            </p>
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>
            <p className="text-sm text-surface-500 mt-1">{subtitle}</p>
        </div>
    );
}
