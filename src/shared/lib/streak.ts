interface DatedItem {
    date: string;
}

export interface StreakCalendarDay {
    date: Date;
    isCurrentMonth: boolean;
    isToday: boolean;
    hasActivity: boolean;
}

function isSameLocalDay(left: Date, right: Date): boolean {
    return left.getFullYear() === right.getFullYear()
        && left.getMonth() === right.getMonth()
        && left.getDate() === right.getDate();
}

export function getCurrentStreak(items: DatedItem[]): number {
    if (items.length === 0) return 0;

    const hasItemOn = (d: Date): boolean => {
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        return items.some(item => {
            const itemDate = new Date(item.date);
            return `${itemDate.getFullYear()}-${itemDate.getMonth()}-${itemDate.getDate()}` === key;
        });
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    const startDate = hasItemOn(today) ? today
        : hasItemOn(yesterday) ? yesterday
        : null;

    if (!startDate) return 0;

    let streak = 0;
    const cursor = new Date(startDate);
    while (hasItemOn(cursor)) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
    }
    return streak;
}

/** Returns Monday-first calendar cells for the supplied month, marked by workout days. */
export function getStreakCalendar(items: DatedItem[], month = new Date()): StreakCalendarDay[] {
    const firstDay = new Date(month.getFullYear(), month.getMonth(), 1);
    const lastDay = new Date(month.getFullYear(), month.getMonth() + 1, 0);
    const leadingDays = (firstDay.getDay() + 6) % 7;
    const trailingDays = (7 - ((leadingDays + lastDay.getDate()) % 7)) % 7;
    const start = new Date(month.getFullYear(), month.getMonth(), 1 - leadingDays);
    const totalDays = leadingDays + lastDay.getDate() + trailingDays;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const activityDays = new Set(items.map(item => {
        const date = new Date(item.date);
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }));

    return Array.from({ length: totalDays }, (_, index) => {
        const date = new Date(start);
        date.setDate(start.getDate() + index);
        const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        return {
            date,
            isCurrentMonth: date.getMonth() === month.getMonth(),
            isToday: isSameLocalDay(date, today),
            hasActivity: activityDays.has(key),
        };
    });
}
