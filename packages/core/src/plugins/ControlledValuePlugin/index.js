"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlledValuePlugin = void 0;
const react_1 = require("react");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const convertHtmlToNodes_1 = require("../../utils/convertHtmlToNodes");
function ControlledValuePlugin(props) {
    const { value } = props;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        const editorState = editor.getEditorState();
        editorState.read(() => {
            editor.update(() => {
                const newNodes = (0, convertHtmlToNodes_1.convertHtmlToNodes)(value, editor);
                const currentNodes = (0, lexical_1.$getRoot)();
                currentNodes.clear();
                (0, lexical_1.$insertNodes)(newNodes);
            });
        });
    }, [value]);
    return null;
}
exports.ControlledValuePlugin = ControlledValuePlugin;
