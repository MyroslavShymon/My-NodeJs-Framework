/**
 * Generates a random string of the given length.
 * @param length The length of the generated string.
 * @returns A random string.
 */
export function randomStringGenerator(length: number = 12): string {
    // Characters from which the string will be formed
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charsetLength = charset.length;

    // Generates random characters for each position in the string
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charsetLength);
        result += charset[randomIndex];
    }

    return result;
}