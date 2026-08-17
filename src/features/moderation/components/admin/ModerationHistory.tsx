import { Badge, Card } from '@/shared/ui';
import type { AdminModerationAction } from '../../types';

interface Props {
    actions: AdminModerationAction[];
}

export function ModerationHistory({ actions }: Props) {
    return (
        <Card padding="md" className="space-y-3">
            <h2 className="text-sm font-bold text-foreground">Action history</h2>
            {actions.length === 0 ? <p className="text-sm text-surface-500">No moderator actions yet.</p> : <div className="space-y-3">{actions.map((action) => <div key={action.id} className="border-t border-surface-100 pt-3 first:border-t-0 first:pt-0"><div className="flex items-center justify-between gap-2"><Badge variant="outline">{action.actionType.replace(/([A-Z])/g, ' $1').trim()}</Badge><span className="text-xs text-surface-400">{new Date(action.occurredAt).toLocaleString()}</span></div><p className="mt-1.5 text-xs text-surface-500">By {action.moderator.displayName}{action.suspensionEndsAt ? ` · until ${new Date(action.suspensionEndsAt).toLocaleString()}` : ''}</p>{action.note && <p className="mt-1.5 text-sm text-surface-600">{action.note}</p>}</div>)}</div>}
        </Card>
    );
}
