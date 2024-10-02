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
exports.FloatingLinkEditorPlugin = void 0;
const link_1 = require("@lexical/link");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const react_dom_1 = require("react-dom");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const setFloatingElemPositionForLinkEditor_1 = require("../../utils/setFloatingElemPositionForLinkEditor");
const url_1 = require("../../utils/url");
// import './index.css';
function FloatingLinkEditor({ editor, isLink, setIsLink, anchorElem, isLinkEditMode, setIsLinkEditMode, }) {
    const editorRef = (0, react_1.useRef)(null);
    const inputRef = (0, react_1.useRef)(null);
    const [linkUrl, setLinkUrl] = (0, react_1.useState)('');
    const [editedLinkUrl, setEditedLinkUrl] = (0, react_1.useState)('https://');
    const [lastSelection, setLastSelection] = (0, react_1.useState)(null);
    const $updateLinkEditor = (0, react_1.useCallback)(() => {
        var _a, _b;
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const linkParent = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
            if (linkParent) {
                setLinkUrl(linkParent.getURL());
            }
            else if ((0, link_1.$isLinkNode)(node)) {
                setLinkUrl(node.getURL());
            }
            else {
                setLinkUrl('');
            }
            if (isLinkEditMode) {
                setEditedLinkUrl(linkUrl);
            }
        }
        const editorElem = editorRef.current;
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;
        if (editorElem === null) {
            return;
        }
        const rootElement = editor.getRootElement();
        if (selection !== null &&
            nativeSelection !== null &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode) &&
            editor.isEditable()) {
            const domRect = (_b = (_a = nativeSelection.focusNode) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
            if (domRect) {
                domRect.y += 40;
                (0, setFloatingElemPositionForLinkEditor_1.setFloatingElemPositionForLinkEditor)(domRect, editorElem, anchorElem);
            }
            setLastSelection(selection);
        }
        else if (!activeElement || activeElement.className !== 'link-input') {
            if (rootElement !== null) {
                (0, setFloatingElemPositionForLinkEditor_1.setFloatingElemPositionForLinkEditor)(null, editorElem, anchorElem);
            }
            setLastSelection(null);
            setIsLinkEditMode(false);
            setLinkUrl('');
        }
        return true;
    }, [anchorElem, editor, setIsLinkEditMode, isLinkEditMode, linkUrl]);
    (0, react_1.useEffect)(() => {
        const scrollerElem = anchorElem.parentElement;
        const update = () => {
            editor.getEditorState().read(() => {
                $updateLinkEditor();
            });
        };
        window.addEventListener('resize', update);
        if (scrollerElem) {
            scrollerElem.addEventListener('scroll', update);
        }
        return () => {
            window.removeEventListener('resize', update);
            if (scrollerElem) {
                scrollerElem.removeEventListener('scroll', update);
            }
        };
    }, [anchorElem.parentElement, editor, $updateLinkEditor]);
    (0, react_1.useEffect)(() => (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
            $updateLinkEditor();
        });
    }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, () => {
        $updateLinkEditor();
        return true;
    }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, () => {
        if (isLink) {
            setIsLink(false);
            return true;
        }
        return false;
    }, lexical_1.COMMAND_PRIORITY_HIGH)), [editor, $updateLinkEditor, setIsLink, isLink]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            $updateLinkEditor();
        });
    }, [editor, $updateLinkEditor]);
    (0, react_1.useEffect)(() => {
        if (isLinkEditMode && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isLinkEditMode, isLink]);
    const monitorInputInteraction = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            handleLinkSubmission();
        }
        else if (event.key === 'Escape') {
            event.preventDefault();
            setIsLinkEditMode(false);
        }
    };
    const handleLinkSubmission = () => {
        if (lastSelection !== null) {
            if (linkUrl !== '') {
                editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, (0, url_1.sanitizeUrl)(editedLinkUrl));
                editor.update(() => {
                    const selection = (0, lexical_1.$getSelection)();
                    if ((0, lexical_1.$isRangeSelection)(selection)) {
                        const parent = (0, getSelectedNode_1.getSelectedNode)(selection).getParent();
                        if ((0, link_1.$isAutoLinkNode)(parent)) {
                            const linkNode = (0, link_1.$createLinkNode)(parent.getURL(), {
                                rel: parent.__rel,
                                target: parent.__target,
                                title: parent.__title,
                            });
                            parent.replace(linkNode, true);
                        }
                    }
                });
            }
            setEditedLinkUrl('https://');
            setIsLinkEditMode(false);
        }
    };
    return (React.createElement("div", { ref: editorRef, className: "link-editor" }, !isLink ? null : isLinkEditMode ? (React.createElement(React.Fragment, null,
        React.createElement("input", { ref: inputRef, className: "link-input", value: editedLinkUrl, onChange: (event) => {
                setEditedLinkUrl(event.target.value);
            }, onKeyDown: (event) => {
                monitorInputInteraction(event);
            } }),
        React.createElement("div", null,
            React.createElement("div", { className: "link-cancel", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                    setIsLinkEditMode(false);
                } }),
            React.createElement("div", { className: "link-confirm", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: handleLinkSubmission })))) : (React.createElement("div", { className: "link-view" },
        React.createElement("a", { href: (0, url_1.sanitizeUrl)(linkUrl), target: "_blank", rel: "noopener noreferrer" }, linkUrl),
        React.createElement("div", { className: "link-edit", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                setEditedLinkUrl(linkUrl);
                setIsLinkEditMode(true);
            } }),
        React.createElement("div", { className: "link-trash", role: "button", tabIndex: 0, onMouseDown: (event) => event.preventDefault(), onClick: () => {
                editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, null);
            } })))));
}
function useFloatingLinkEditorToolbar(editor, anchorElem, isLinkEditMode, setIsLinkEditMode) {
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        function $updateToolbar() {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const focusNode = (0, getSelectedNode_1.getSelectedNode)(selection);
                const focusLinkNode = (0, utils_1.$findMatchingParent)(focusNode, link_1.$isLinkNode);
                const focusAutoLinkNode = (0, utils_1.$findMatchingParent)(focusNode, link_1.$isAutoLinkNode);
                if (!(focusLinkNode || focusAutoLinkNode)) {
                    setIsLink(false);
                    return;
                }
                const badNode = selection
                    .getNodes()
                    .filter((node) => !(0, lexical_1.$isLineBreakNode)(node))
                    .find((node) => {
                    const linkNode = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
                    const autoLinkNode = (0, utils_1.$findMatchingParent)(node, link_1.$isAutoLinkNode);
                    return ((focusLinkNode && !focusLinkNode.is(linkNode)) ||
                        (linkNode && !linkNode.is(focusLinkNode)) ||
                        (focusAutoLinkNode && !focusAutoLinkNode.is(autoLinkNode)) ||
                        (autoLinkNode && (!autoLinkNode.is(focusAutoLinkNode) || autoLinkNode.getIsUnlinked())));
                });
                if (!badNode) {
                    setIsLink(true);
                }
                else {
                    setIsLink(false);
                }
            }
        }
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            $updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL), editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const node = (0, getSelectedNode_1.getSelectedNode)(selection);
                const linkNode = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
                if ((0, link_1.$isLinkNode)(linkNode) && (payload.metaKey || payload.ctrlKey)) {
                    window.open(linkNode.getURL(), '_blank');
                    return true;
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor]);
    return (0, react_dom_1.createPortal)(React.createElement(FloatingLinkEditor, { editor: activeEditor, isLink: isLink, anchorElem: anchorElem, setIsLink: setIsLink, isLinkEditMode: isLinkEditMode, setIsLinkEditMode: setIsLinkEditMode }), anchorElem);
}
const FloatingLinkEditorPlugin = ({ anchorElem = document.body, isLinkEditMode, setIsLinkEditMode, }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    return useFloatingLinkEditorToolbar(editor, anchorElem, isLinkEditMode, setIsLinkEditMode);
};
exports.FloatingLinkEditorPlugin = FloatingLinkEditorPlugin;
