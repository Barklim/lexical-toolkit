"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.domOnBeforeMatch = exports.setDomHiddenUntilFound = void 0;
function setDomHiddenUntilFound(dom) {
    dom.hidden = true; // 'until-found
}
exports.setDomHiddenUntilFound = setDomHiddenUntilFound;
function domOnBeforeMatch(dom, callback) {
    dom.onbeforematch = callback;
}
exports.domOnBeforeMatch = domOnBeforeMatch;
