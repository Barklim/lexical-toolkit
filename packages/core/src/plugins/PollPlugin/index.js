"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PollPlugin = exports.InsertPollDialog = exports.INSERT_POLL_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const PollNode_1 = require("../../nodes/PollNode");
const Button_1 = require("../../ui/Button");
const Dialog_1 = require("../../ui/Dialog");
const TextInput_1 = require("../../ui/TextInput");
exports.INSERT_POLL_COMMAND = (0, lexical_1.createCommand)('INSERT_POLL_COMMAND');
function InsertPollDialog({ activeEditor, onClose, }) {
    const [question, setQuestion] = (0, react_1.useState)('');
    const onClick = () => {
        activeEditor.dispatchCommand(exports.INSERT_POLL_COMMAND, question);
        onClose();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(TextInput_1.TextInput, { label: "Question", onChange: setQuestion, value: question }),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.Button, { disabled: question.trim() === '', onClick: onClick }, "Confirm"))));
}
exports.InsertPollDialog = InsertPollDialog;
const PollPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([PollNode_1.PollNode])) {
            throw new Error('PollPlugin: PollNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_POLL_COMMAND, (payload) => {
            const pollNode = (0, PollNode_1.$createPollNode)(payload, [(0, PollNode_1.createPollOption)(), (0, PollNode_1.createPollOption)()]);
            (0, lexical_1.$insertNodes)([pollNode]);
            if ((0, lexical_1.$isRootOrShadowRoot)(pollNode.getParentOrThrow())) {
                (0, utils_1.$wrapNodeInElement)(pollNode, lexical_1.$createParagraphNode).selectEnd();
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
};
exports.PollPlugin = PollPlugin;
