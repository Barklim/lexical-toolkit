"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.caretFromPoint = void 0;
const caretFromPoint = (x, y) => {
    if (typeof document.caretRangeFromPoint !== 'undefined') {
        const range = document.caretRangeFromPoint(x, y);
        if (range === null) {
            return null;
        }
        return {
            node: range.startContainer,
            offset: range.startOffset,
        };
    }
    else if (document.caretPositionFromPoint !== 'undefined') {
        const range = document.caretPositionFromPoint(x, y);
        if (range === null) {
            return null;
        }
        return {
            node: range.offsetNode,
            offset: range.offset,
        };
    }
    // Gracefully handle IE
    return null;
};
exports.caretFromPoint = caretFromPoint;
