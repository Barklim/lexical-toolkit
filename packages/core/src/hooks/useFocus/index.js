"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFocus = void 0;
const react_1 = require("react");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const useFocus = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [hasFocus, setHasFocus] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        const unregisterBlur = editor.registerCommand(lexical_1.BLUR_COMMAND, () => {
            setHasFocus(false);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW);
        const unregisterFocus = editor.registerCommand(lexical_1.FOCUS_COMMAND, () => {
            setHasFocus(true);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW);
        return () => {
            unregisterBlur();
            unregisterFocus();
        };
    }, [editor]);
    return { hasFocus };
};
exports.useFocus = useFocus;
