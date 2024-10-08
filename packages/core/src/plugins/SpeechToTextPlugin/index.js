"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORT_SPEECH_RECOGNITION = exports.SPEECH_TO_TEXT_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const lexical_1 = require("lexical");
const react_1 = require("react");
const useReport_1 = require("../../hooks/useReport");
exports.SPEECH_TO_TEXT_COMMAND = (0, lexical_1.createCommand)('SPEECH_TO_TEXT_COMMAND');
const VOICE_COMMANDS = {
    '\n': ({ selection }) => {
        selection.insertParagraph();
    },
    redo: ({ editor }) => {
        editor.dispatchCommand(lexical_1.REDO_COMMAND, undefined);
    },
    undo: ({ editor }) => {
        editor.dispatchCommand(lexical_1.UNDO_COMMAND, undefined);
    },
};
exports.SUPPORT_SPEECH_RECOGNITION = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
function SpeechToTextPlugin() {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isEnabled, setIsEnabled] = (0, react_1.useState)(false);
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = (0, react_1.useRef)(null);
    const report = (0, useReport_1.useReport)();
    (0, react_1.useEffect)(() => {
        if (isEnabled && recognition.current === null) {
            recognition.current = new SpeechRecognition();
            recognition.current.continuous = true;
            recognition.current.interimResults = true;
            recognition.current.addEventListener('result', (event) => {
                const resultItem = event.results.item(event.resultIndex);
                const { transcript } = resultItem.item(0);
                report(transcript);
                if (!resultItem.isFinal) {
                    return;
                }
                editor.update(() => {
                    const selection = (0, lexical_1.$getSelection)();
                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                        const command = VOICE_COMMANDS[transcript.toLowerCase().trim()];
                        if (command) {
                            command({
                                editor,
                                selection,
                            });
                        }
                        else if (transcript.match(/\s*\n\s*/)) {
                            selection.insertParagraph();
                        }
                        else {
                            selection.insertText(transcript);
                        }
                    }
                });
            });
        }
        if (recognition.current) {
            if (isEnabled) {
                recognition.current.start();
            }
            else {
                recognition.current.stop();
            }
        }
        return () => {
            if (recognition.current !== null) {
                recognition.current.stop();
            }
        };
    }, [SpeechRecognition, editor, isEnabled, report]);
    (0, react_1.useEffect)(() => editor.registerCommand(exports.SPEECH_TO_TEXT_COMMAND, (_isEnabled) => {
        setIsEnabled(_isEnabled);
        return true;
    }, lexical_1.COMMAND_PRIORITY_EDITOR), [editor]);
    return null;
}
// eslint-disable-next-line import/no-default-export
exports.default = (exports.SUPPORT_SPEECH_RECOGNITION ? SpeechToTextPlugin : () => null);
