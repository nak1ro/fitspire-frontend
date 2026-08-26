interface LogoProps {
    className?: string;
}

/** The ring mark: a near-closed progress ring with a leading-edge marker. Uses currentColor, sized like a lucide icon. */
export function Logo({ className }: LogoProps) {
    return (
        <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
            <path d="M32,12 A20,20 0 1 1 14.68,22" stroke="currentColor" strokeWidth="8" strokeLinecap="round" />
            <circle cx="14.68" cy="22" r="5.2" fill="currentColor" />
        </svg>
    );
}
