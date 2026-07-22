import { Target, Trophy, Users } from 'lucide-react';
import { Badge, Card, IconChip } from '@/shared/ui';
import { getMetricConfig } from '../metricConfig';
import type { ChallengeResponse, ChallengeStatus } from '../types';

export const STATUS_VARIANT: Record<ChallengeStatus, 'default' | 'primary' | 'success' | 'warning' | 'error'> = {
    Upcoming: 'default',
    Active: 'primary',
    Finalizing: 'warning',
    Completed: 'success',
    Cancelled: 'error',
};

function formatDateRange(startDate: string, endDate: string): string {
    const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const start = new Date(startDate).toLocaleDateString('en-US', opts);
    const end = new Date(endDate).toLocaleDateString('en-US', opts);
    return `${start} – ${end}`;
}

export function ChallengeCard({ challenge, onClick }: { challenge: ChallengeResponse; onClick: () => void }) {
    const metric = getMetricConfig(challenge.metricCode);
    const ModeIcon = challenge.mode === 'Target' ? Target : Trophy;

    return (
        <Card padding="sm" interactive onClick={onClick} className="space-y-3">
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5 min-w-0">
                    <IconChip icon={metric.Icon} size="sm" color={metric.color} bg={metric.bg} />
                    <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground leading-tight truncate">{challenge.title}</p>
                        <p className="text-xs text-surface-400 leading-tight mt-0.5">{formatDateRange(challenge.startDate, challenge.endDate)}</p>
                    </div>
                </div>
                <Badge variant={STATUS_VARIANT[challenge.status]} size="sm">{challenge.status}</Badge>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-surface-500">
                    <ModeIcon className="h-3.5 w-3.5" aria-hidden="true" />
                    {challenge.mode === 'Target' ? `Target: ${challenge.targetValue} ${metric.unit}` : 'Leaderboard'}
                </div>
                <div className="flex items-center gap-3">
                    {challenge.visibility === 'FollowersOnly' && (
                        <Badge variant="outline" size="sm">Followers only</Badge>
                    )}
                    {challenge.visibility === 'InviteOnly' && (
                        <Badge variant="outline" size="sm">Invite only</Badge>
                    )}
                    <span className="flex items-center gap-1 text-xs text-surface-400">
                        <Users className="h-3.5 w-3.5" aria-hidden="true" />
                        {challenge.participantsCount}/{challenge.participantLimit}
                    </span>
                </div>
            </div>
        </Card>
    );
}
