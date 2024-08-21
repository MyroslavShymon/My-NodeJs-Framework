/**
 * Checks if a value is null or undefined.
 * @param value The value to check.
 * @returns true if the value is null or undefined; otherwise, false.
 */
export function isNil(value: any): boolean {
    return value === null || value === undefined;
}