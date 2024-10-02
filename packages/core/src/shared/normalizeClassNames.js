"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeClassNames = void 0;
const normalizeClassNames = (...classNames) => {
    const rval = [];
    for (const className of classNames) {
        if (className && typeof className === 'string') {
            for (const [s] of className.matchAll(/\S+/g)) {
                rval.push(s);
            }
        }
    }
    return rval;
};
exports.normalizeClassNames = normalizeClassNames;
