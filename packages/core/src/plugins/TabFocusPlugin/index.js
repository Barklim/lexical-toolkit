"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TabFocusPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const COMMAND_PRIORITY_LOW = 1;
const TAB_TO_FOCUS_INTERVAL = 100;
let lastTabKeyDownTimestamp = 0;
let hasRegisteredKeyDownListener = false;
function registerKeyTimeStampTracker() {
    window.addEventListener('keydown', (event) => {
        // Tab
        if (event.key === 'Tab') {
            lastTabKeyDownTimestamp = event.timeStamp;
        }
    }, true);
}
const TabFocusPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!hasRegisteredKeyDownListener) {
            registerKeyTimeStampTracker();
            hasRegisteredKeyDownListener = true;
        }
        return editor.registerCommand(lexical_1.FOCUS_COMMAND, (event) => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                if (lastTabKeyDownTimestamp + TAB_TO_FOCUS_INTERVAL > event.timeStamp) {
                    (0, lexical_1.$setSelection)(selection.clone());
                }
            }
            return false;
        }, COMMAND_PRIORITY_LOW);
    }, [editor]);
    return null;
};
exports.TabFocusPlugin = TabFocusPlugin;
