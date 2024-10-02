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
exports.RIGHT_CLICK_IMAGE_COMMAND = void 0;
const hashtag_1 = require("@lexical/hashtag");
const link_1 = require("@lexical/link");
const LexicalAutoFocusPlugin_1 = require("@lexical/react/LexicalAutoFocusPlugin");
const LexicalCollaborationContext_1 = require("@lexical/react/LexicalCollaborationContext");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalErrorBoundary_1 = require("@lexical/react/LexicalErrorBoundary");
const LexicalHashtagPlugin_1 = require("@lexical/react/LexicalHashtagPlugin");
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const LexicalNestedComposer_1 = require("@lexical/react/LexicalNestedComposer");
const LexicalRichTextPlugin_1 = require("@lexical/react/LexicalRichTextPlugin");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const SettingsContext_1 = require("../context/SettingsContext");
const SharedHistoryContext_1 = require("../context/SharedHistoryContext");
// import brokenImage from '../images/image-broken.svg';
const EmojisPlugin_1 = require("../plugins/EmojisPlugin");
const KeywordsPlugin_1 = require("../plugins/KeywordsPlugin");
const LinkPlugin_1 = require("../plugins/LinkPlugin");
const MentionsPlugin_1 = require("../plugins/MentionsPlugin");
const TreeViewPlugin_1 = require("../plugins/TreeViewPlugin");
const ContentEditable_1 = require("../ui/ContentEditable");
const ImageResizer_1 = require("../ui/ImageResizer");
const EmojiNode_1 = require("./EmojiNode");
// eslint-disable-next-line import/no-cycle
const ImageNode_1 = require("./ImageNode");
const KeywordNode_1 = require("./KeywordNode");
// import './ImageNode.css';
const imageCache = new Set();
exports.RIGHT_CLICK_IMAGE_COMMAND = (0, lexical_1.createCommand)('RIGHT_CLICK_IMAGE_COMMAND');
function useSuspenseImage(src) {
    if (!imageCache.has(src)) {
        throw new Promise((resolve) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                imageCache.add(src);
                resolve(null);
            };
            img.onerror = () => {
                imageCache.add(src);
            };
        });
    }
}
function LazyImage({ altText, className, imageRef, src, width, height, maxWidth, onError, }) {
    useSuspenseImage(src);
    return (React.createElement("img", { className: className || undefined, src: src, alt: altText, ref: imageRef, style: {
            height,
            maxWidth,
            width,
        }, onError: onError, draggable: "false" }));
}
function BrokenImage() {
    return (React.createElement("img", { 
        // src={brokenImage}
        src: '', style: {
            height: 200,
            opacity: 0.2,
            width: 200,
        }, draggable: "false" }));
}
// eslint-disable-next-line import/no-default-export
function ImageComponent({ src, altText, nodeKey, width, height, maxWidth, resizable, showCaption, caption, captionsEnabled, }) {
    const imageRef = (0, react_1.useRef)(null);
    const buttonRef = (0, react_1.useRef)(null);
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const [isResizing, setIsResizing] = (0, react_1.useState)(false);
    const { isCollabActive } = (0, LexicalCollaborationContext_1.useCollaborationContext)();
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [selection, setSelection] = (0, react_1.useState)(null);
    const activeEditorRef = (0, react_1.useRef)(null);
    const [isLoadError, setIsLoadError] = (0, react_1.useState)(false);
    const $onDelete = (0, react_1.useCallback)((payload) => {
        const deleteSelection = (0, lexical_1.$getSelection)();
        if (isSelected && (0, lexical_1.$isNodeSelection)(deleteSelection)) {
            const event = payload;
            event.preventDefault();
            editor.update(() => {
                deleteSelection.getNodes().forEach((node) => {
                    if ((0, ImageNode_1.$isImageNode)(node)) {
                        node.remove();
                    }
                });
            });
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
    const onClick = (0, react_1.useCallback)((payload) => {
        const event = payload;
        if (isResizing) {
            return true;
        }
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
    }, [isResizing, isSelected, setSelected, clearSelection]);
    const onRightClick = (0, react_1.useCallback)((event) => {
        editor.getEditorState().read(() => {
            const latestSelection = (0, lexical_1.$getSelection)();
            const domElement = event.target;
            if (domElement.tagName === 'IMG' &&
                (0, lexical_1.$isRangeSelection)(latestSelection) &&
                latestSelection.getNodes().length === 1) {
                editor.dispatchCommand(exports.RIGHT_CLICK_IMAGE_COMMAND, event);
            }
        });
    }, [editor]);
    (0, react_1.useEffect)(() => {
        let isMounted = true;
        const rootElement = editor.getRootElement();
        const unregister = (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            if (isMounted) {
                setSelection(editorState.read(() => (0, lexical_1.$getSelection)()));
            }
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_, activeEditor) => {
            activeEditorRef.current = activeEditor;
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.CLICK_COMMAND, onClick, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(exports.RIGHT_CLICK_IMAGE_COMMAND, onClick, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => {
            if (event.target === imageRef.current) {
                // TODO This is just a temporary workaround for FF to behave like other browsers.
                // Ideally, this handles drag & drop too (and all browsers).
                event.preventDefault();
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ENTER_COMMAND, $onEnter, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, $onEscape, lexical_1.COMMAND_PRIORITY_LOW));
        rootElement === null || rootElement === void 0 ? void 0 : rootElement.addEventListener('contextmenu', onRightClick);
        return () => {
            isMounted = false;
            unregister();
            rootElement === null || rootElement === void 0 ? void 0 : rootElement.removeEventListener('contextmenu', onRightClick);
        };
    }, [
        clearSelection,
        editor,
        isResizing,
        isSelected,
        nodeKey,
        $onDelete,
        $onEnter,
        $onEscape,
        onClick,
        onRightClick,
        setSelected,
    ]);
    const setShowCaption = () => {
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, ImageNode_1.$isImageNode)(node)) {
                node.setShowCaption(true);
            }
        });
    };
    const onResizeEnd = (nextWidth, nextHeight) => {
        // Delay hiding the resize bars for click case
        setTimeout(() => {
            setIsResizing(false);
        }, 200);
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, ImageNode_1.$isImageNode)(node)) {
                node.setWidthAndHeight(nextWidth, nextHeight);
            }
        });
    };
    const onResizeStart = () => {
        setIsResizing(true);
    };
    const { historyState } = (0, SharedHistoryContext_1.useSharedHistoryContext)();
    const { settings: { showNestedEditorTreeView }, } = (0, SettingsContext_1.useSettings)();
    const draggable = isSelected && (0, lexical_1.$isNodeSelection)(selection) && !isResizing;
    const isFocused = isSelected || isResizing;
    return (React.createElement(react_1.Suspense, { fallback: null },
        React.createElement(React.Fragment, null,
            React.createElement("div", { draggable: draggable }, isLoadError ? (React.createElement(BrokenImage, null)) : (React.createElement(LazyImage, { className: isFocused ? `focused ${(0, lexical_1.$isNodeSelection)(selection) ? 'draggable' : ''}` : null, src: src, altText: altText, imageRef: imageRef, width: width, height: height, maxWidth: maxWidth, onError: () => setIsLoadError(true) }))),
            showCaption && (React.createElement("div", { className: "image-caption-container" },
                React.createElement(LexicalNestedComposer_1.LexicalNestedComposer, { initialEditor: caption, initialNodes: [
                        lexical_1.RootNode,
                        lexical_1.TextNode,
                        lexical_1.LineBreakNode,
                        lexical_1.ParagraphNode,
                        link_1.LinkNode,
                        EmojiNode_1.EmojiNode,
                        hashtag_1.HashtagNode,
                        KeywordNode_1.KeywordNode,
                    ] },
                    React.createElement(LexicalAutoFocusPlugin_1.AutoFocusPlugin, null),
                    React.createElement(MentionsPlugin_1.NewMentionsPlugin, null),
                    React.createElement(LinkPlugin_1.LinkPlugin, null),
                    React.createElement(EmojisPlugin_1.EmojisPlugin, null),
                    React.createElement(LexicalHashtagPlugin_1.HashtagPlugin, null),
                    React.createElement(KeywordsPlugin_1.KeywordsPlugin, null),
                    isCollabActive ? React.createElement("div", null, "123") : React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }),
                    React.createElement(LexicalRichTextPlugin_1.RichTextPlugin, { contentEditable: React.createElement(ContentEditable_1.LexicalContentEditable, { placeholder: "Enter a caption...", placeholderClassName: "ImageNode__placeholder", className: "ImageNode__contentEditable" }), ErrorBoundary: LexicalErrorBoundary_1.LexicalErrorBoundary }),
                    showNestedEditorTreeView === true ? React.createElement(TreeViewPlugin_1.TreeViewPlugin, null) : null))),
            resizable && (0, lexical_1.$isNodeSelection)(selection) && isFocused && (React.createElement(ImageResizer_1.ImageResizer, { showCaption: showCaption, setShowCaption: setShowCaption, editor: editor, buttonRef: buttonRef, imageRef: imageRef, maxWidth: maxWidth, onResizeStart: onResizeStart, onResizeEnd: onResizeEnd, captionsEnabled: !isLoadError && captionsEnabled })))));
}
exports.default = ImageComponent;
