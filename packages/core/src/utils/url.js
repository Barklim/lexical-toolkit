"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateUrl = exports.sanitizeUrl = void 0;
const SUPPORTED_URL_PROTOCOLS = new Set([
    "http:",
    "https:",
    "mailto:",
    "sms:",
    "tel:",
]);
function sanitizeUrl(url) {
    try {
        const parsedUrl = new URL(url);
        if (!SUPPORTED_URL_PROTOCOLS.has(parsedUrl.protocol)) {
            return "about:blank";
        }
    }
    catch (_a) {
        return url;
    }
    return url;
}
exports.sanitizeUrl = sanitizeUrl;
// Source: https://stackoverflow.com/a/8234912/2013580
const urlRegExp = new RegExp(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=+$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=+$,\w]+@)[A-Za-z0-9.-]+)((?:\/[+~%/.\w-_]*)?\??(?:[-+=&;%@.\w_]*)#?(?:[\w]*))?)/);
function validateUrl(url) {
    return urlRegExp.test(url);
}
exports.validateUrl = validateUrl;
