function pad(n: number) {
    return String(n).padStart(2, '0');
}

/** Today's date as `YYYY-MM-DD` in the browser's local timezone (not UTC — `toISOString()` shifts across the day boundary for any non-UTC timezone). */
export function todayLocalDateInput(): string {
    return toLocalDateInput(new Date());
}

/**
 * Converts a stored UTC timestamp (or any date-parseable string) to a `YYYY-MM-DD` value for a
 * date `<input>`, using the browser's local timezone. A naive `isoString.slice(0, 10)` on a UTC
 * timestamp is wrong whenever local midnight for that date falls on a different UTC calendar day
 * than the stored instant — which is routine for any timezone ahead of UTC, since the backend now
 * correctly stores dates converted through the user's saved timezone rather than the server's.
 */
export function toLocalDateInput(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Converts a date-only workout field into the local datetime expected by the API.
 * Workouts logged for today use the actual submission time so that newly created
 * goals and challenges can include them; historical entries stay at local midnight.
 */
export function toWorkoutOccurrenceInput(date: string, now = new Date()): string {
    if (date !== toLocalDateInput(now)) {
        return `${date}T00:00:00`;
    }

    return `${date}T${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
}
