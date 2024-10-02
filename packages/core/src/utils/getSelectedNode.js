"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSelectedNode = void 0;
const selection_1 = require("@lexical/selection");
function getSelectedNode(selection) {
    const anchor = selection.anchor;
    const focus = selection.focus;
    const anchorNode = selection.anchor.getNode();
    const focusNode = selection.focus.getNode();
    if (anchorNode === focusNode) {
        return anchorNode;
    }
    const isBackward = selection.isBackward();
    if (isBackward) {
        return (0, selection_1.$isAtNodeEnd)(focus) ? anchorNode : focusNode;
    }
    else {
        return (0, selection_1.$isAtNodeEnd)(anchor) ? anchorNode : focusNode;
    }
}
exports.getSelectedNode = getSelectedNode;
