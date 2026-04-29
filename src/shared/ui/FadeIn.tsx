'use client';

import { ReactNode, useEffect, useRef, useState } from 'react';
import { cn } from '../lib/cn';

interface FadeInProps {
    children: ReactNode;
    className?: string;
    delay?: number;
    from?: 'bottom' | 'none';
}

export function FadeIn({ children, className, delay = 0, from = 'bottom' }: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <div
            ref={ref}
            className={cn(
                'transition-all duration-700 ease-out',
                visible
                    ? 'opacity-100 translate-y-0'
                    : from === 'bottom' ? 'opacity-0 translate-y-6' : 'opacity-0',
                className
            )}
            style={delay ? { transitionDelay: `${delay}ms` } : undefined}
        >
            {children}
        </div>
    );
}
