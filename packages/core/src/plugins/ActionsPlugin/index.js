"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActionsPlugin = void 0;
const code_1 = require("@lexical/code");
const file_1 = require("@lexical/file");
const markdown_1 = require("@lexical/markdown");
const LexicalCollaborationContext_1 = require("@lexical/react/LexicalCollaborationContext");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const appSettings_1 = require("../../appSettings");
const useFlashMessage_1 = require("../../hooks/useFlashMessage");
const useModal_1 = require("../../hooks/useModal");
const Button_1 = require("../../ui/Button");
const MarkdownTransformers_1 = require("../MarkdownTransformers");
const SpeechToTextPlugin_1 = require("../SpeechToTextPlugin");
const react_2 = __importDefault(require("react"));
function sendEditorState(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        const stringifiedEditorState = JSON.stringify(editor.getEditorState());
        try {
            yield fetch('http://localhost:1235/setEditorState', {
                body: stringifiedEditorState,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                method: 'POST',
            });
        }
        catch (_a) {
            // NO-OP
        }
    });
}
function validateEditorState(editor) {
    return __awaiter(this, void 0, void 0, function* () {
        const stringifiedEditorState = JSON.stringify(editor.getEditorState());
        let response = null;
        try {
            response = yield fetch('http://localhost:1235/validateEditorState', {
                body: stringifiedEditorState,
                headers: {
                    Accept: 'application/json',
                    'Content-type': 'application/json',
                },
                method: 'POST',
            });
        }
        catch (_a) {
            // NO-OP
        }
        if (response !== null && response.status === 403) {
            throw new Error('Editor state validation failed! Server did not accept changes.');
        }
    });
}
function shareDoc(doc) {
    return __awaiter(this, void 0, void 0, function* () {
        const url = new URL(window.location.toString());
        const newUrl = url.toString();
        window.history.replaceState({}, '', newUrl);
        yield window.navigator.clipboard.writeText(newUrl);
    });
}
const ActionsPlugin = ({ isRichText, shouldPreserveNewLinesInMarkdown, }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    const [isSpeechToText, setIsSpeechToText] = (0, react_1.useState)(false);
    const [isEditorEmpty, setIsEditorEmpty] = (0, react_1.useState)(true);
    const [modal, showModal] = (0, useModal_1.useModal)();
    const showFlashMessage = (0, useFlashMessage_1.useFlashMessage)();
    const { isCollabActive } = (0, LexicalCollaborationContext_1.useCollaborationContext)();
    (0, react_1.useEffect)(() => {
        if (appSettings_1.INITIAL_SETTINGS.isCollab) {
            return;
        }
    }, [editor]);
    (0, react_1.useEffect)(() => (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
        setIsEditable(editable);
    })), [editor]);
    (0, react_1.useEffect)(() => editor.registerUpdateListener(({ dirtyElements, prevEditorState, tags }) => {
        // If we are in read only mode, send the editor state
        // to server and ask for validation if possible.
        if (!isEditable && dirtyElements.size > 0 && !tags.has('historic') && !tags.has('collaboration')) {
            validateEditorState(editor);
        }
        editor.getEditorState().read(() => {
            const root = (0, lexical_1.$getRoot)();
            const children = root.getChildren();
            if (children.length > 1) {
                setIsEditorEmpty(false);
            }
            else {
                if ((0, lexical_1.$isParagraphNode)(children[0])) {
                    const paragraphChildren = children[0].getChildren();
                    setIsEditorEmpty(paragraphChildren.length === 0);
                }
                else {
                    setIsEditorEmpty(false);
                }
            }
        });
    }), [editor, isEditable]);
    const handleMarkdownToggle = (0, react_1.useCallback)(() => {
        editor.update(() => {
            const root = (0, lexical_1.$getRoot)();
            const firstChild = root.getFirstChild();
            if ((0, code_1.$isCodeNode)(firstChild) && firstChild.getLanguage() === 'markdown') {
                (0, markdown_1.$convertFromMarkdownString)(firstChild.getTextContent(), MarkdownTransformers_1.PLAYGROUND_TRANSFORMERS, undefined, // node
                shouldPreserveNewLinesInMarkdown);
            }
            else {
                const markdown = (0, markdown_1.$convertToMarkdownString)(MarkdownTransformers_1.PLAYGROUND_TRANSFORMERS, undefined, // node
                shouldPreserveNewLinesInMarkdown);
                root.clear().append((0, code_1.$createCodeNode)('markdown').append((0, lexical_1.$createTextNode)(markdown)));
            }
        });
    }, [editor, shouldPreserveNewLinesInMarkdown]);
    return (react_2.default.createElement("div", { className: "actions" },
        SpeechToTextPlugin_1.SUPPORT_SPEECH_RECOGNITION && (react_2.default.createElement("button", { type: "button", onClick: () => {
                editor.dispatchCommand(SpeechToTextPlugin_1.SPEECH_TO_TEXT_COMMAND, !isSpeechToText);
                setIsSpeechToText(!isSpeechToText);
            }, className: `action-button action-button-mic ${isSpeechToText ? 'active' : ''}`, title: "Speech To Text", "aria-label": `${isSpeechToText ? 'Enable' : 'Disable'} speech to text` },
            react_2.default.createElement("i", { className: "mic" }))),
        react_2.default.createElement("button", { type: "button", className: "action-button import", onClick: () => (0, file_1.importFile)(editor), title: "Import", "aria-label": "Import editor state from JSON" },
            react_2.default.createElement("i", { className: "import" })),
        react_2.default.createElement("button", { type: "button", className: "action-button export", onClick: () => (0, file_1.exportFile)(editor, {
                fileName: `Playground ${new Date().toISOString()}`,
                source: 'Playground',
            }), title: "Export", "aria-label": "Export editor state to JSON" },
            react_2.default.createElement("i", { className: "export" })),
        react_2.default.createElement("button", { type: "button", className: "action-button share", disabled: isCollabActive || appSettings_1.INITIAL_SETTINGS.isCollab, onClick: () => shareDoc((0, file_1.serializedDocumentFromEditorState)(editor.getEditorState(), {
                source: 'Playground',
            })).then(() => showFlashMessage('URL copied to clipboard'), () => showFlashMessage('URL could not be copied to clipboard')), title: "Share", "aria-label": "Share Playground link to current editor state" },
            react_2.default.createElement("i", { className: "share" })),
        react_2.default.createElement("button", { type: "button", className: "action-button clear", disabled: isEditorEmpty, onClick: () => {
                showModal('Clear editor', (onClose) => react_2.default.createElement(ShowClearDialog, { editor: editor, onClose: onClose }));
            }, title: "Clear", "aria-label": "Clear editor contents" },
            react_2.default.createElement("i", { className: "clear" })),
        react_2.default.createElement("button", { type: "button", className: `action-button ${!isEditable ? 'unlock' : 'lock'}`, onClick: () => {
                // Send latest editor state to commenting validation server
                if (isEditable) {
                    sendEditorState(editor);
                }
                editor.setEditable(!editor.isEditable());
            }, title: "Read-Only Mode", "aria-label": `${!isEditable ? 'Unlock' : 'Lock'} read-only mode` },
            react_2.default.createElement("i", { className: !isEditable ? 'unlock' : 'lock' })),
        react_2.default.createElement("button", { type: "button", className: "action-button", onClick: handleMarkdownToggle, title: "Convert From Markdown", "aria-label": "Convert from markdown" },
            react_2.default.createElement("i", { className: "markdown" })),
        isCollabActive && react_2.default.createElement("div", null, "123"),
        modal));
};
exports.ActionsPlugin = ActionsPlugin;
function ShowClearDialog({ editor, onClose }) {
    return (react_2.default.createElement(react_2.default.Fragment, null,
        "Are you sure you want to clear the editor?",
        react_2.default.createElement("div", { className: "Modal__content" },
            react_2.default.createElement(Button_1.Button, { onClick: () => {
                    editor.dispatchCommand(lexical_1.CLEAR_EDITOR_COMMAND, undefined);
                    editor.focus();
                    onClose();
                } }, "Clear"),
            ' ',
            react_2.default.createElement(Button_1.Button, { onClick: () => {
                    editor.focus();
                    onClose();
                } }, "Cancel"))));
}
