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
exports.MentionHint = void 0;
/* eslint-disable import/no-extraneous-dependencies */
const react_1 = __importStar(require("react"));
const lexical_1 = require("lexical");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
// import { noop } from 'shared/functions';
const MustacheNode_1 = require("../../nodes/MustacheNode");
const useFocus_1 = require("../../hooks/useFocus");
const ModalTagsSelector_1 = require("./ModalTagsSelector");
const hintStart = "Enter {{ and start writing a parameter";
const MentionHint = ({ limitTagCodes, tags }) => {
    const modalTagSelector = (0, react_1.useRef)(null);
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const { hasFocus } = (0, useFocus_1.useFocus)();
    (0, react_1.useEffect)(() => {
        var _a;
        if (hasFocus) {
            // modalTagSelector.current?.open().then((tag: any) => {}, noop);
            (_a = modalTagSelector.current) === null || _a === void 0 ? void 0 : _a.open().then((tag) => { }, {});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleSelect = (tag, external) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (selection) {
                const textNode = new MustacheNode_1.MustacheNode(tag.name);
                selection.insertNodes([textNode]);
                (0, lexical_1.$setSelection)(selection);
            }
        });
    };
    return (react_1.default.createElement("div", { className: "small text-muted" },
        react_1.default.createElement(ModalTagsSelector_1.ModalTagSelector, { ref: modalTagSelector, tags: tags, limitTagCodes: limitTagCodes }),
        hintStart,
        hasFocus ? (react_1.default.createElement(react_1.default.Fragment, null,
            ", or\u00A0",
            react_1.default.createElement("a", { onMouseDown: () => {
                    var _a;
                    (_a = modalTagSelector.current) === null || _a === void 0 ? void 0 : _a.open().then((tag, external) => {
                        handleSelect(tag, external);
                        // }, noop);
                    }, {});
                } }, "select a parameter from the library"))) : null));
};
exports.MentionHint = MentionHint;
