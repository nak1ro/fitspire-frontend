'use client';

import { useEffect, useRef, useState } from 'react';
import { Flag, MoreVertical, Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface Props {
    canEdit: boolean;
    canDelete: boolean;
    canReport: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: () => void;
}

/**
 * Hover-revealed kebab menu shared by every comment row (both the full
 * threaded view and the compact feed-card preview) — Edit/Delete for the
 * author, Report for everyone else, mirroring FeedCard's own PostMenu.
 */
export function CommentMenu({ canEdit, canDelete, canReport, onEdit, onDelete, onReport }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        function handleOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handleOutside);
        return () => document.removeEventListener('mousedown', handleOutside);
    }, [open]);

    if (!canEdit && !canDelete && !canReport) return null;

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen(v => !v)}
                className={cn(
                    'p-1 rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-100 transition-colors cursor-pointer',
                    open ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                )}
                aria-label="Comment options"
                aria-expanded={open}
            >
                <MoreVertical className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-36 rounded-xl border border-surface-200 bg-background p-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow-panel)' }}
                >
                    {canEdit && (
                        <button
                            role="menuitem"
                            onClick={() => { setOpen(false); onEdit(); }}
                            className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors text-left cursor-pointer"
                        >
                            <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Edit
                        </button>
                    )}
                    {canDelete && (
                        <button
                            role="menuitem"
                            onClick={() => { setOpen(false); onDelete(); }}
                            className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors text-left cursor-pointer"
                        >
                            <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Delete
                        </button>
                    )}
                    {canReport && (
                        <button
                            role="menuitem"
                            onClick={() => { setOpen(false); onReport(); }}
                            className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-error transition-colors text-left cursor-pointer"
                        >
                            <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Report
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
