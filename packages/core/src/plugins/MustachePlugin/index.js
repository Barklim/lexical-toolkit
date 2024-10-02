"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MustachePlugin = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const MustacheNode_1 = require("../../nodes/MustacheNode");
function findAndTransformMustache(node, tags) {
    const text = node.getTextContent();
    for (const { code, name } of tags) {
        const index = text.indexOf(code);
        if (index !== -1) {
            let targetNode;
            if (index === 0) {
                [targetNode] = node.splitText(index + code.length);
            }
            else {
                [, targetNode] = node.splitText(index, index + code.length);
            }
            const mustacheNode = (0, MustacheNode_1.createMustacheNode)(name);
            targetNode.replace(mustacheNode);
            return mustacheNode;
        }
    }
    return null;
}
const textNodeTransform = (node, tags) => {
    let targetNode = node;
    while (targetNode !== null) {
        if (!targetNode.isSimpleText()) {
            return;
        }
        targetNode = findAndTransformMustache(targetNode, tags);
    }
};
function useMustaches(editor, tags) {
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([MustacheNode_1.MustacheNode])) {
            throw new Error('MustachePlugin: MustacheNode not registered on editor');
        }
        return editor.registerNodeTransform(lexical_1.TextNode, (node) => textNodeTransform(node, tags));
    }, [editor, tags]);
}
const MustachePlugin = ({ tags }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    useMustaches(editor, tags);
    return null;
};
exports.MustachePlugin = MustachePlugin;
