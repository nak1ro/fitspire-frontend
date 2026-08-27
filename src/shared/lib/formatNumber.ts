/** Rounds to 2 decimal places and drops trailing zeros — fixes floating-point noise
 *  like 20.900000000000002 from accumulated progress math (e.g. summed goal contributions). */
export function formatNumber(value: number): string {
    return Number(value.toFixed(2)).toString();
}
