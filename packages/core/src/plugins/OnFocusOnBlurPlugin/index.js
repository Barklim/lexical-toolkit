"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnFocusOnBlurPlugin = void 0;
const react_1 = require("react");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const utils_1 = require("@lexical/utils");
function OnFocusOnBlurPlugin(props) {
    const { onFocus, onBlur } = props;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerCommand(lexical_1.BLUR_COMMAND, () => {
            onBlur && onBlur();
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.FOCUS_COMMAND, () => {
            onFocus && onFocus();
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor]);
    return null;
}
exports.OnFocusOnBlurPlugin = OnFocusOnBlurPlugin;
