'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../lib/cn';
import { useModalTransition } from './useModalTransition';

interface ImageLightboxProps {
    src: string;
    alt?: string;
    open: boolean;
    onClose: () => void;
}

export function ImageLightbox({ src, alt = '', open, onClose }: ImageLightboxProps) {
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            role="dialog"
            aria-modal="true"
            aria-label={alt || 'Image preview'}
        >
            <button
                type="button"
                className={cn('absolute inset-0 bg-black/80 transition-opacity duration-200 ease-out', visible ? 'opacity-100' : 'opacity-0')}
                onClick={onClose}
                aria-label="Close image preview"
            />
            <button
                type="button"
                onClick={onClose}
                className={cn(
                    'absolute top-4 right-4 z-10 flex items-center justify-center h-9 w-9 rounded-full bg-black/50 text-white hover:bg-black/70 transition-all duration-200 ease-out',
                    visible ? 'opacity-100' : 'opacity-0'
                )}
                aria-label="Close"
            >
                <X className="h-5 w-5" aria-hidden="true" />
            </button>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                src={src}
                alt={alt}
                className={cn(
                    'relative z-0 max-w-full max-h-full object-contain rounded-lg select-none transition-all duration-200 ease-out',
                    visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                )}
                onClick={event => event.stopPropagation()}
            />
        </div>
    );
}
