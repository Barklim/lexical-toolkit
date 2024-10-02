"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CodeHighlightPlugin = void 0;
const code_1 = require("@lexical/code");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const CodeHighlightPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => (0, code_1.registerCodeHighlighting)(editor), [editor]);
    return null;
};
exports.CodeHighlightPlugin = CodeHighlightPlugin;
