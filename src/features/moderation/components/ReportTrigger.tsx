'use client';

import { useState } from 'react';
import { Flag } from 'lucide-react';
import { ReportContentDialog, type ReportTarget } from './ReportContentDialog';

interface Props {
    target: ReportTarget;
    label?: string;
    compact?: boolean;
}

export function ReportTrigger({ target, label = 'Report', compact = false }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button onClick={() => setOpen(true)} className={compact
                ? 'rounded-lg p-1.5 text-surface-400 transition-colors hover:bg-surface-100 hover:text-error cursor-pointer'
                : 'inline-flex items-center gap-1.5 text-[11px] font-semibold text-surface-500 transition-colors hover:text-error cursor-pointer'} aria-label={`Report ${target.label}`}>
                <Flag className={compact ? 'h-4 w-4' : 'h-3.5 w-3.5'} aria-hidden="true" />
                {!compact && label}
            </button>
            <ReportContentDialog target={target} open={open} onClose={() => setOpen(false)} />
        </>
    );
}
