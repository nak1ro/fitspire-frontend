'use client';

import { type ReactNode, useEffect } from 'react';
import { cn } from '../lib/cn';
import { useModalTransition } from './useModalTransition';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: ReactNode;
    /** Panel width above the mobile breakpoint, e.g. 'sm:max-w-md' (default), 'sm:max-w-lg', 'sm:max-w-2xl'. */
    maxWidthClassName?: string;
    ariaLabel?: string;
    labelledBy?: string;
    /** Set false while a destructive/pending action shouldn't be dismissed by an accidental backdrop click. */
    closeOnBackdrop?: boolean;
    className?: string;
}

/**
 * Shared modal shell: dimmed backdrop, bottom-sheet on mobile / centered
 * dialog on desktop, Escape-to-close, and a soft fade+slide/scale transition
 * on both open and close (via useModalTransition keeping the panel mounted
 * long enough for the exit animation to play).
 */
export function Modal({
    open, onClose, children, maxWidthClassName = 'sm:max-w-md', ariaLabel, labelledBy, closeOnBackdrop = true, className,
}: ModalProps) {
    const { mounted, visible } = useModalTransition(open);

    useEffect(() => {
        if (!open) return;
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [open, onClose]);

    if (!mounted) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
            <button
                type="button"
                className={cn('absolute inset-0 bg-black/40 transition-opacity duration-200 ease-out', visible ? 'opacity-100' : 'opacity-0')}
                onClick={closeOnBackdrop ? onClose : undefined}
                aria-label="Close"
                tabIndex={closeOnBackdrop ? 0 : -1}
            />
            <div
                role="dialog"
                aria-modal="true"
                aria-label={ariaLabel}
                aria-labelledby={labelledBy}
                className={cn(
                    'relative z-10 w-full bg-surface rounded-t-3xl sm:rounded-2xl overflow-hidden',
                    'transition-all duration-200 ease-out',
                    visible ? 'opacity-100 translate-y-0 sm:scale-100' : 'opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95',
                    maxWidthClassName,
                    className
                )}
                style={{ boxShadow: '0 24px 80px rgba(28,21,16,0.22)' }}
            >
                {children}
            </div>
        </div>
    );
}
