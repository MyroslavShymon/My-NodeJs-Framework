/**
 * Adds a leading slash to the given path if it does not already have one.
 * @param path The path to which a leading slash should be added.
 * @returns The path with a leading slash.
 */
export function addLeadingSlash(path: string): string {
    return path.startsWith('/') ? path : `/${path}`;
}