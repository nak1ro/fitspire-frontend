'use client';

import type { AdminModerationReportFilter, ModerationReportReason, ModerationReportStatus, ModerationReportTargetType } from '../../types';

interface Props {
    filter: AdminModerationReportFilter;
    onChange: (filter: AdminModerationReportFilter) => void;
}

function optionValue<T extends string>(value: string): T | null {
    return value === '' ? null : value as T;
}

export function ModerationQueueFilters({ filter, onChange }: Props) {
    return (
        <div className="grid gap-3 sm:grid-cols-3">
            <select aria-label="Report status" value={filter.status ?? ''} onChange={(event) => onChange({ ...filter, status: optionValue<ModerationReportStatus>(event.target.value), page: 1 })} className="rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500">
                <option value="">All statuses</option>
                <option value="Open">Open</option>
                <option value="Resolved">Resolved</option>
            </select>
            <select aria-label="Report target type" value={filter.targetType ?? ''} onChange={(event) => onChange({ ...filter, targetType: optionValue<ModerationReportTargetType>(event.target.value), page: 1 })} className="rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500">
                <option value="">All targets</option>
                <option value="Profile">Profile</option>
                <option value="Post">Post</option>
                <option value="Comment">Comment</option>
                <option value="Media">Image</option>
            </select>
            <select aria-label="Report reason" value={filter.reason ?? ''} onChange={(event) => onChange({ ...filter, reason: optionValue<ModerationReportReason>(event.target.value), page: 1 })} className="rounded-xl border border-surface-200 bg-surface px-3 py-2.5 text-sm text-foreground outline-none focus:border-primary-500">
                <option value="">All reasons</option>
                <option value="Spam">Spam</option>
                <option value="Harassment">Harassment</option>
                <option value="InappropriateContent">Inappropriate content</option>
                <option value="Impersonation">Impersonation</option>
                <option value="Other">Other</option>
            </select>
        </div>
    );
}
