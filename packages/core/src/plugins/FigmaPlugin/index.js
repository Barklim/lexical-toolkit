"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FigmaPlugin = exports.INSERT_FIGMA_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const FigmaNode_1 = require("../../nodes/FigmaNode");
exports.INSERT_FIGMA_COMMAND = (0, lexical_1.createCommand)('INSERT_FIGMA_COMMAND');
const FigmaPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([FigmaNode_1.FigmaNode])) {
            throw new Error('FigmaPlugin: FigmaNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_FIGMA_COMMAND, (payload) => {
            const figmaNode = (0, FigmaNode_1.$createFigmaNode)(payload);
            (0, utils_1.$insertNodeToNearestRoot)(figmaNode);
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
};
exports.FigmaPlugin = FigmaPlugin;
