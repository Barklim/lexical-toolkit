"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFloatingElemPosition = void 0;
const VERTICAL_GAP = 10;
const HORIZONTAL_OFFSET = 5;
function setFloatingElemPosition(targetRect, floatingElem, anchorElem, isLink = false, verticalGap = VERTICAL_GAP, horizontalOffset = HORIZONTAL_OFFSET) {
    const scrollerElem = anchorElem.parentElement;
    if (targetRect === null || !scrollerElem) {
        floatingElem.style.opacity = '0';
        floatingElem.style.transform = 'translate(-10000px, -10000px)';
        return;
    }
    const floatingElemRect = floatingElem.getBoundingClientRect();
    const anchorElementRect = anchorElem.getBoundingClientRect();
    const editorScrollerRect = scrollerElem.getBoundingClientRect();
    let top = targetRect.top - floatingElemRect.height - verticalGap;
    let left = targetRect.left - horizontalOffset;
    if (top < editorScrollerRect.top) {
        // adjusted height for link element if the element is at top
        top += floatingElemRect.height + targetRect.height + verticalGap * (isLink ? 9 : 2);
    }
    if (left + floatingElemRect.width > editorScrollerRect.right) {
        left = editorScrollerRect.right - floatingElemRect.width - horizontalOffset;
    }
    top -= anchorElementRect.top;
    left -= anchorElementRect.left;
    floatingElem.style.opacity = '1';
    floatingElem.style.transform = `translate(${left}px, ${top}px)`;
}
exports.setFloatingElemPosition = setFloatingElemPosition;
