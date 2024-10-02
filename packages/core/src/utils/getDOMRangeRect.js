"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDOMRangeRect = void 0;
function getDOMRangeRect(nativeSelection, rootElement) {
    if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
            inner = inner.firstElementChild;
        }
        return inner.getBoundingClientRect();
    }
    const domRange = nativeSelection.getRangeAt(0);
    return domRange.getBoundingClientRect();
}
exports.getDOMRangeRect = getDOMRangeRect;
