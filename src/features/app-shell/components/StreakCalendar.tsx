import { cn } from '@/shared/lib/cn';
import type { StreakCalendarDay } from '@/shared/lib/streak';

interface StreakCalendarProps {
    days: StreakCalendarDay[];
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

export function StreakCalendar({ days }: StreakCalendarProps) {
    return (
        <div aria-label="Workout activity calendar">
            <div className="grid grid-cols-7 mb-2">
                {WEEKDAYS.map((day, index) => (
                    <span key={`${day}-${index}`} className="text-center text-[11px] font-bold text-surface-400">
                        {day}
                    </span>
                ))}
            </div>
            <div className="grid grid-cols-7 gap-y-1">
                {days.map(({ date, hasActivity, isCurrentMonth, isToday }) => (
                    <div key={date.toISOString()} className="flex justify-center py-1">
                        <span
                            className={cn(
                                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                                !isCurrentMonth && 'text-surface-300',
                                isCurrentMonth && !hasActivity && 'text-surface-600',
                                hasActivity && 'bg-primary-500 text-white',
                                isToday && !hasActivity && 'border border-primary-400 text-primary-600',
                                isToday && hasActivity && 'ring-2 ring-primary-200 ring-offset-2 ring-offset-surface'
                            )}
                            aria-label={`${date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}${hasActivity ? ', workout logged' : ''}${isToday ? ', today' : ''}`}
                        >
                            {date.getDate()}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
