export function formatJson(input) {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed, null, 2);
}

export function minifyJson(input) {
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
}

export function validateJson(input) {
    try {
        JSON.parse(input);
        return { valid: true, error: null };
    } catch (e) {
        return { valid: false, error: e.message };
    }
}
