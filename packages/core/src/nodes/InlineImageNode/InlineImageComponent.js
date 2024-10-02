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
exports.UpdateInlineImageDialog = void 0;
const LexicalAutoFocusPlugin_1 = require("@lexical/react/LexicalAutoFocusPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalErrorBoundary_1 = require("@lexical/react/LexicalErrorBoundary");
const LexicalNestedComposer_1 = require("@lexical/react/LexicalNestedComposer");
const LexicalRichTextPlugin_1 = require("@lexical/react/LexicalRichTextPlugin");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const useModal_1 = require("../../hooks/useModal");
const LinkPlugin_1 = require("../../plugins/LinkPlugin");
const Button_1 = require("../../ui/Button");
const ContentEditable_1 = require("../../ui/ContentEditable");
const Dialog_1 = require("../../ui/Dialog");
const Select_1 = require("../../ui/Select");
const TextInput_1 = require("../../ui/TextInput");
// import './InlineImageNode.css';
// eslint-disable-next-line import/no-cycle
const InlineImageNode_1 = require("./InlineImageNode");
const imageCache = new Set();
function useSuspenseImage(src) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
        });
    }
}
function LazyImage({ altText, className, imageRef, src, width, height, position, }) {
    useSuspenseImage(src);
    return (React.createElement("img", { className: className || undefined, src: src, alt: altText, ref: imageRef, "data-position": position, style: {
            display: 'block',
            height,
            width,
        }, draggable: "false" }));
}
function UpdateInlineImageDialog({ activeEditor, nodeKey, onClose, }) {
    const editorState = activeEditor.getEditorState();
    const node = editorState.read(() => (0, lexical_1.$getNodeByKey)(nodeKey));
    const [altText, setAltText] = (0, react_1.useState)(node.getAltText());
    const [showCaption, setShowCaption] = (0, react_1.useState)(node.getShowCaption());
    const [position, setPosition] = (0, react_1.useState)(node.getPosition());
    const handleShowCaptionChange = (e) => {
        setShowCaption(e.target.checked);
    };
    const handlePositionChange = (e) => {
        setPosition(e.target.value);
    };
    const handleOnConfirm = () => {
        const payload = { altText, position, showCaption };
        if (node) {
            activeEditor.update(() => {
                node.update(payload);
            });
        }
        onClose();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { marginBottom: '1em' } },
            React.createElement(TextInput_1.TextInput, { label: "Alt Text", placeholder: "Descriptive alternative text", onChange: setAltText, value: altText, "data-test-id": "image-modal-alt-text-input" })),
        React.createElement(Select_1.Select, { style: { marginBottom: '1em', width: '208px' }, value: position, label: "Position", name: "position", id: "position-select", onChange: handlePositionChange },
            React.createElement("option", { value: "left" }, "Left"),
            React.createElement("option", { value: "right" }, "Right"),
            React.createElement("option", { value: "full" }, "Full Width")),
        React.createElement("div", { className: "Input__wrapper" },
            React.createElement("input", { id: "caption", type: "checkbox", checked: showCaption, onChange: handleShowCaptionChange }),
            React.createElement("label", { htmlFor: "caption" }, "Show Caption")),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-file-upload-btn", onClick: () => handleOnConfirm() }, "Confirm"))));
}
exports.UpdateInlineImageDialog = UpdateInlineImageDialog;
// eslint-disable-next-line import/no-default-export
function InlineImageComponent({ src, altText, nodeKey, width, height, showCaption, caption, position, }) {
    const [modal, showModal] = (0, useModal_1.useModal)();
    const imageRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [selection, setSelection] = (0, react_1.useState)(null);
    const activeEditorRef = (0, react_1.useRef)(null);
    const $onDelete = (0, react_1.useCallback)((payload) => {
        const deleteSelection = (0, lexical_1.$getSelection)();
        if (isSelected && (0, lexical_1.$isNodeSelection)(deleteSelection)) {
            const event = payload;
            event.preventDefault();
            if (isSelected && (0, lexical_1.$isNodeSelection)(deleteSelection)) {
                editor.update(() => {
                    deleteSelection.getNodes().forEach((node) => {
                        if ((0, InlineImageNode_1.$isInlineImageNode)(node)) {
                            node.remove();
                        }
                    });
                });
            }
        }
        return false;
    }, [editor, isSelected]);
    const $onEnter = (0, react_1.useCallback)((event) => {
        const latestSelection = (0, lexical_1.$getSelection)();
        const buttonElem = buttonRef.current;
        if (isSelected && (0, lexical_1.$isNodeSelection)(latestSelection) && latestSelection.getNodes().length === 1) {
            if (showCaption) {
                // Move focus into nested editor
                (0, lexical_1.$setSelection)(null);
                event.preventDefault();
                caption.focus();
                return true;
            }
            else if (buttonElem !== null && buttonElem !== document.activeElement) {
                event.preventDefault();
                buttonElem.focus();
                return true;
            }
        }
        return false;
    }, [caption, isSelected, showCaption]);
    const $onEscape = (0, react_1.useCallback)((event) => {
        if (activeEditorRef.current === caption || buttonRef.current === event.target) {
            (0, lexical_1.$setSelection)(null);
            editor.update(() => {
                setSelected(true);
                const parentRootElement = editor.getRootElement();
                if (parentRootElement !== null) {
                    parentRootElement.focus();
                }
            });
            return true;
        }
        return false;
    }, [caption, editor, setSelected]);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const unregister = (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            if (isMounted) {
                setSelection(editorState.read(() => (0, lexical_1.$getSelection)()));
            }
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
            activeEditorRef.current = activeEditor;
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
            const event = payload;
            if (event.target === imageRef.current) {
                if (event.shiftKey) {
                    setSelected(!isSelected);
                }
                else {
                    clearSelection();
                    setSelected(true);
                }
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => {
            if (event.target === imageRef.current) {
                // TODO This is just a temporary workaround for FF to behave like other browsers.
                // Ideally, this handles drag & drop too (and all browsers).
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ENTER_COMMAND, $onEnter, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, $onEscape, lexical_1.COMMAND_PRIORITY_LOW));
        return () => {
            isMounted = false;
            unregister();
        };
    }, [clearSelection, editor, isSelected, nodeKey, $onDelete, $onEnter, $onEscape, setSelected]);
    const draggable = isSelected && (0, lexical_1.$isNodeSelection)(selection);
    const isFocused = isSelected;
    return (React.createElement(react_1.Suspense, { fallback: null },
        React.createElement(React.Fragment, null,
            React.createElement("span", { draggable: draggable },
                React.createElement("button", { type: "button", className: "image-edit-button", ref: buttonRef, onClick: () => {
                        showModal('Update Inline Image', (onClose) => (React.createElement(UpdateInlineImageDialog, { activeEditor: editor, nodeKey: nodeKey, onClose: onClose })));
                    } }, "Edit"),
                React.createElement(LazyImage, { className: isFocused ? `focused ${(0, lexical_1.$isNodeSelection)(selection) ? 'draggable' : ''}` : null, src: src, altText: altText, imageRef: imageRef, width: width, height: height, position: position })),
            showCaption && (React.createElement("span", { className: "image-caption-container" },
                React.createElement(LexicalNestedComposer_1.LexicalNestedComposer, { initialEditor: caption },
                    React.createElement(LexicalAutoFocusPlugin_1.AutoFocusPlugin, null),
                    React.createElement(LinkPlugin_1.LinkPlugin, null),
                    React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement(ContentEditable_1.LexicalContentEditable, { placeholder: "Enter a caption...", placeholderClassName: "InlineImageNode__placeholder", className: "InlineImageNode__contentEditable" }), ErrorBoundary: LexicalErrorBoundary_1.LexicalErrorBoundary }))))),
        modal));
}
exports.default = InlineImageComponent;
