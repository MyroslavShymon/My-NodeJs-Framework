/**
 * Checks if a value is an object.
 * @param value The value to check.
 * @returns true if the value is an object and not null; otherwise, false.
 */
export function isObject(value: any): boolean {
    return value !== null && typeof value === 'object';
}