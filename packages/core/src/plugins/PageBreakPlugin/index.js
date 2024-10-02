"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageBreakPlugin = exports.INSERT_PAGE_BREAK = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const PageBreakNode_1 = require("../../nodes/PageBreakNode");
exports.INSERT_PAGE_BREAK = (0, lexical_1.createCommand)();
const PageBreakPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([PageBreakNode_1.PageBreakNode])) {
            throw new Error('PageBreakPlugin: PageBreakNode is not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(exports.INSERT_PAGE_BREAK, () => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection)) {
                return false;
            }
            const focusNode = selection.focus.getNode();
            if (focusNode !== null) {
                const pgBreak = (0, PageBreakNode_1.$createPageBreakNode)();
                (0, utils_1.$insertNodeToNearestRoot)(pgBreak);
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR));
    }, [editor]);
    return null;
};
exports.PageBreakPlugin = PageBreakPlugin;
