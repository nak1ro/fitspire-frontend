'use client';

import { useEffect, useRef, useState } from 'react';
import { Flag, MoreVertical, Pencil, Trash2 } from 'lucide-react';

interface Props {
    isOwner: boolean;
    canEdit: boolean;
    onEdit: () => void;
    onDelete: () => void;
    onReport: () => void;
}

/** Post-level kebab menu shared by the feed card and the post detail view — Edit/Delete for the owner, Report for everyone else. */
export function PostMenu({ isOwner, canEdit, onEdit, onDelete, onReport }: Props) {
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

    return (
        <div ref={ref} className="relative shrink-0">
            <button
                onClick={() => setOpen(v => !v)}
                className="p-1.5 rounded-lg text-surface-400 hover:text-foreground hover:bg-surface-100 transition-all cursor-pointer"
                aria-label="Post options"
                aria-expanded={open}
            >
                <MoreVertical className="h-4 w-4" aria-hidden="true" />
            </button>
            {open && (
                <div
                    role="menu"
                    className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-surface-200 bg-background p-1.5 z-20"
                    style={{ boxShadow: 'var(--shadow-panel)' }}
                >
                    {isOwner && canEdit && (
                        <button
                            role="menuitem"
                            onClick={() => { setOpen(false); onEdit(); }}
                            className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-foreground transition-colors text-left cursor-pointer"
                        >
                            <Pencil className="h-4 w-4 shrink-0" aria-hidden="true" />
                            Edit
                        </button>
                    )}
                    {isOwner ? <button
                        role="menuitem"
                        onClick={() => { setOpen(false); onDelete(); }}
                        className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-error hover:bg-error/10 transition-colors text-left cursor-pointer"
                    >
                        <Trash2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Delete
                    </button> : <button
                        role="menuitem"
                        onClick={() => { setOpen(false); onReport(); }}
                        className="w-full flex items-center gap-2.5 h-9 px-2.5 rounded-lg text-sm font-medium text-surface-600 hover:bg-surface-100 hover:text-error transition-colors text-left cursor-pointer"
                    >
                        <Flag className="h-4 w-4 shrink-0" aria-hidden="true" />
                        Report
                    </button>}
                </div>
            )}
        </div>
    );
}
