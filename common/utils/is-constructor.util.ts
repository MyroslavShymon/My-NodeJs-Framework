export function isConstructor(fn: any): boolean {
    try {
        // Using new with a proxy object to check if fn is a constructor
        new (new Proxy(fn, {
            construct() {
                return {};
            }
        }));
        return true;
    } catch (err) {
        return false;
    }
}