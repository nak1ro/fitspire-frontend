import { useId } from 'react';

interface LogoProps {
    className?: string;
}

/** The app mark: a gradient badge with a white progress-ring glyph — same design as the favicon. */
export function Logo({ className }: LogoProps) {
    const gradientId = useId();

    return (
        <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
            <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                    <stop offset="0" stopColor="#059669" />
                    <stop offset="1" stopColor="#34D399" />
                </linearGradient>
            </defs>
            <rect width="64" height="64" rx="14" fill={`url(#${gradientId})`} />
            <path d="M32,12 A20,20 0 1 1 14.68,22" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" fill="none" />
            <circle cx="14.68" cy="22" r="5.2" fill="#ffffff" />
        </svg>
    );
}
