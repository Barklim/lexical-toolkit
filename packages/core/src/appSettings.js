"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_SETTINGS = exports.DEFAULT_SETTINGS = exports.isDevPlayground = void 0;
const hostName = window.location.hostname;
exports.isDevPlayground = hostName !== 'playground.lexical.dev' && hostName !== 'lexical-playground.vercel.app';
exports.DEFAULT_SETTINGS = {
    disableBeforeInput: false,
    emptyEditor: exports.isDevPlayground,
    isAutocomplete: false,
    isCharLimit: false,
    isCharLimitUtf8: false,
    isCollab: false,
    isMaxLength: false,
    isRichText: true,
    measureTypingPerf: false,
    shouldPreserveNewLinesInMarkdown: false,
    shouldUseLexicalContextMenu: false,
    showNestedEditorTreeView: false,
    showTableOfContents: false,
    showTreeView: true,
    tableCellBackgroundColor: true,
    tableCellMerge: true,
};
// These are mutated in setupEnv
exports.INITIAL_SETTINGS = Object.assign({}, exports.DEFAULT_SETTINGS);
