"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StickyPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const StickyNode_1 = require("../../nodes/StickyNode");
const StickyPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([StickyNode_1.StickyNode])) {
            throw new Error('StickyPlugin: StickyNode not registered on editor');
        }
    }, [editor]);
    return null;
};
exports.StickyPlugin = StickyPlugin;
