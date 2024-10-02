"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListMaxIndentLevelPlugin = void 0;
const list_1 = require("@lexical/list");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
function getElementNodesInSelection(selection) {
    const nodesInSelection = selection.getNodes();
    if (nodesInSelection.length === 0) {
        return new Set([selection.anchor.getNode().getParentOrThrow(), selection.focus.getNode().getParentOrThrow()]);
    }
    return new Set(nodesInSelection.map((n) => ((0, lexical_1.$isElementNode)(n) ? n : n.getParentOrThrow())));
}
function $shouldPreventIndent(maxDepth) {
    const selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isRangeSelection)(selection)) {
        return false;
    }
    const elementNodesInSelection = getElementNodesInSelection(selection);
    let totalDepth = 0;
    for (const elementNode of elementNodesInSelection) {
        if ((0, list_1.$isListNode)(elementNode)) {
            totalDepth = Math.max((0, list_1.$getListDepth)(elementNode) + 1, totalDepth);
        }
        else if ((0, list_1.$isListItemNode)(elementNode)) {
            const parent = elementNode.getParent();
            if (!(0, list_1.$isListNode)(parent)) {
                throw new Error('ListMaxIndentLevelPlugin: A ListItemNode must have a ListNode for a parent.');
            }
            totalDepth = Math.max((0, list_1.$getListDepth)(parent) + 1, totalDepth);
        }
    }
    return totalDepth > maxDepth;
}
const ListMaxIndentLevelPlugin = ({ maxDepth = 7 }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => editor.registerCommand(lexical_1.INDENT_CONTENT_COMMAND, () => $shouldPreventIndent(maxDepth), lexical_1.COMMAND_PRIORITY_CRITICAL), [editor, maxDepth]);
    return null;
};
exports.ListMaxIndentLevelPlugin = ListMaxIndentLevelPlugin;
