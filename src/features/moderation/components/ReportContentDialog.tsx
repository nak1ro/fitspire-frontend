'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { X } from 'lucide-react';
import { Alert, Button, Modal } from '@/shared/ui';
import { getErrorMessage } from '@/shared/lib/getErrorMessage';
import { useReportContent } from '../hooks/useReportContent';
import type { CreateModerationReportRequest, ModerationReportReason } from '../types';

const REPORT_REASONS: { value: ModerationReportReason; label: string }[] = [
    { value: 'Spam', label: 'Spam' },
    { value: 'Harassment', label: 'Harassment' },
    { value: 'InappropriateContent', label: 'Inappropriate content' },
    { value: 'Impersonation', label: 'Impersonation' },
    { value: 'Other', label: 'Other' },
];

export interface ReportTarget {
    targetType: CreateModerationReportRequest['targetType'];
    targetId: string;
    label: string;
}

interface Props {
    target: ReportTarget;
    open: boolean;
    onClose: () => void;
}

export function ReportContentDialog({ target, open, onClose }: Props) {
    const [reason, setReason] = useState<ModerationReportReason>('InappropriateContent');
    const [details, setDetails] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const reasonInputRef = useRef<HTMLSelectElement>(null);
    const { mutate: reportContent, isPending } = useReportContent();

    const handleClose = useCallback(() => {
        setReason('InappropriateContent');
        setDetails('');
        setError(null);
        setSuccessMessage(null);
        onClose();
    }, [onClose]);

    useEffect(() => {
        if (open) reasonInputRef.current?.focus();
    }, [open]);

    // Guards backdrop click, the X button, and Modal's own Escape handler alike —
    // none of them should be able to dismiss the dialog mid-submit.
    const guardedClose = useCallback(() => {
        if (!isPending) handleClose();
    }, [handleClose, isPending]);

    const handleSubmit = () => {
        setError(null);
        reportContent(
            { targetType: target.targetType, targetId: target.targetId, reason, details: details.trim() || null },
            {
                onSuccess: (response) => {
                    setSuccessMessage(response.alreadyReported
                        ? 'You have already reported this content. Our team can review it.'
                        : 'Thanks for your report. Our team can review it.');
                },
                onError: (submissionError) => setError(getErrorMessage(submissionError, 'Could not submit your report.')),
            }
        );
    };

    return (
        <Modal open={open} onClose={guardedClose} maxWidthClassName="sm:max-w-lg" closeOnBackdrop={!isPending} labelledBy="report-content-title">
                <div className="flex items-center gap-3 px-5 pb-2 pt-5">
                    <div className="min-w-0 flex-1">
                        <h2 id="report-content-title" className="text-base font-bold text-foreground">Report {target.label}</h2>
                        <p className="mt-0.5 text-xs text-surface-500">Tell us what is wrong. The report is private.</p>
                    </div>
                    <button onClick={guardedClose} disabled={isPending} className="rounded-xl p-1.5 text-surface-500 transition-colors hover:bg-surface-100 hover:text-foreground disabled:opacity-50" aria-label="Close">
                        <X className="h-5 w-5" aria-hidden="true" />
                    </button>
                </div>

                <div className="space-y-4 px-5 pb-5 pt-3">
                    {successMessage ? (
                        <>
                            <Alert variant="success">{successMessage}</Alert>
                            <Button fullWidth onClick={handleClose}>Done</Button>
                        </>
                    ) : (
                        <>
                            <label className="block space-y-1.5 text-sm font-semibold text-foreground">
                                Reason
                                <select ref={reasonInputRef} value={reason} onChange={(event) => setReason(event.target.value as ModerationReportReason)} className="w-full rounded-xl border border-surface-200 bg-background px-3 py-2.5 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary-500">
                                    {REPORT_REASONS.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}
                                </select>
                            </label>
                            <label className="block space-y-1.5 text-sm font-semibold text-foreground">
                                Details <span className="font-normal text-surface-400">(optional)</span>
                                <textarea value={details} onChange={(event) => setDetails(event.target.value)} maxLength={1000} rows={4} className="w-full resize-none rounded-xl border border-surface-200 bg-background px-3 py-2.5 text-sm font-normal text-foreground outline-none transition-colors focus:border-primary-500" />
                                <span className="block text-right text-xs font-normal text-surface-400">{details.length}/1000</span>
                            </label>
                            {error && <Alert variant="error">{error}</Alert>}
                            <div className="flex gap-3">
                                <Button variant="secondary" fullWidth disabled={isPending} onClick={handleClose}>Cancel</Button>
                                <Button fullWidth loading={isPending} onClick={handleSubmit}>Submit report</Button>
                            </div>
                        </>
                    )}
                </div>
        </Modal>
    );
}
