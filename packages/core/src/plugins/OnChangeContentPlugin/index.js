"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnChangeContentPlugin = void 0;
const react_1 = __importDefault(require("react"));
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalOnChangePlugin_1 = require("@lexical/react/LexicalOnChangePlugin");
const html_1 = require("@lexical/html");
let PREV_HTML;
let PREV_TEXT;
function OnChangeContentPlugin(props) {
    const { onHtmlChange, onTextChange } = props;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return (react_1.default.createElement(LexicalOnChangePlugin_1.OnChangePlugin, { onChange: (editorState) => {
            editorState.read(() => {
                var _a;
                let html = (0, html_1.$generateHtmlFromNodes)(editor);
                const text = ((_a = editor.getRootElement()) === null || _a === void 0 ? void 0 : _a.textContent) || "";
                if (html !== PREV_HTML) {
                    onHtmlChange && onHtmlChange(html, text, editorState);
                    PREV_HTML = html;
                }
                if (text !== PREV_TEXT) {
                    onTextChange && onTextChange(text, text, editorState);
                    PREV_TEXT = text;
                }
            });
        } }));
}
exports.OnChangeContentPlugin = OnChangeContentPlugin;
