'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Keeps a modal mounted for `exitDurationMs` after `open` goes false, so a
 * CSS exit transition can play instead of the content vanishing instantly.
 * `visible` flips a frame after `mounted` so the initial paint is the
 * "closed" state and the transition to "open" actually animates.
 */
export function useModalTransition(open: boolean, exitDurationMs = 200) {
    const [mounted, setMounted] = useState(open);
    const [visible, setVisible] = useState(open);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        if (open) {
            setMounted(true);
            // A single rAF can fire before the browser paints the just-mounted
            // "closed" state, coalescing both styles into one paint (no
            // animation). Nesting two rAFs guarantees a real paint happens
            // in between, so the transition to "visible" actually animates.
            const raf1 = requestAnimationFrame(() => {
                const raf2 = requestAnimationFrame(() => setVisible(true));
                rafRef.current = raf2;
            });
            rafRef.current = raf1;
            return () => cancelAnimationFrame(rafRef.current);
        }
        setVisible(false);
        const timeout = setTimeout(() => setMounted(false), exitDurationMs);
        return () => clearTimeout(timeout);
    }, [open, exitDurationMs]);

    return { mounted, visible };
}
