import { Smile } from 'lucide-react';
import { Card } from '@/shared/ui';
import type { BodyCheckIn } from '../types';

function formatDate(dateStr: string): string {
    const [y, m, d] = dateStr.split('-').map(Number);
    return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function CheckInCard({ checkIn, onClick }: { checkIn: BodyCheckIn; onClick: () => void }) {
    const photoUrl = checkIn.photo?.thumbnail?.url ?? checkIn.photo?.primary?.url;

    return (
        <Card padding="sm" interactive onClick={onClick} className="flex items-center gap-3">
            {photoUrl ? (
                <img src={photoUrl} alt="" className="w-11 h-11 rounded-xl object-cover shrink-0" />
            ) : (
                <div className="w-11 h-11 rounded-xl bg-surface-100 shrink-0" />
            )}
            <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-foreground leading-tight">{formatDate(checkIn.checkInDate)}</p>
                    {checkIn.weightKg != null && (
                        <span className="text-sm font-bold text-foreground tabular-nums shrink-0">{checkIn.weightKg.toFixed(1)} kg</span>
                    )}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    {checkIn.wellbeingScore != null && (
                        <span className="flex items-center gap-1 text-xs text-surface-400">
                            <Smile className="h-3 w-3" aria-hidden="true" />
                            {checkIn.wellbeingScore}/5
                        </span>
                    )}
                    {checkIn.note && (
                        <p className="text-xs text-surface-400 truncate">{checkIn.note}</p>
                    )}
                </div>
            </div>
        </Card>
    );
}
