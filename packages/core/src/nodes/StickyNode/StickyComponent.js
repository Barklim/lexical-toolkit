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
const LexicalCollaborationContext_1 = require("@lexical/react/LexicalCollaborationContext");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalErrorBoundary_1 = require("@lexical/react/LexicalErrorBoundary");
const LexicalHistoryPlugin_1 = require("@lexical/react/LexicalHistoryPlugin");
const LexicalNestedComposer_1 = require("@lexical/react/LexicalNestedComposer");
const LexicalPlainTextPlugin_1 = require("@lexical/react/LexicalPlainTextPlugin");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const useLayoutEffect_1 = require("../../shared/useLayoutEffect");
const SharedHistoryContext_1 = require("../../context/SharedHistoryContext");
const StickyEditorTheme_1 = require("../../themes/StickyEditorTheme");
const ContentEditable_1 = require("../../ui/ContentEditable");
// eslint-disable-next-line import/no-cycle
const index_1 = require("./index");
function positionSticky(stickyElem, positioning) {
    const style = stickyElem.style;
    const rootElementRect = positioning.rootElementRect;
    const rectLeft = rootElementRect !== null ? rootElementRect.left : 0;
    const rectTop = rootElementRect !== null ? rootElementRect.top : 0;
    style.top = `${rectTop + positioning.y}px`;
    style.left = `${rectLeft + positioning.x}px`;
}
// eslint-disable-next-line import/no-default-export
function StickyComponent({ x, y, nodeKey, color, caption, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const stickyContainerRef = (0, react_1.useRef)(null);
    const positioningRef = (0, react_1.useRef)({
        isDragging: false,
        offsetX: 0,
        offsetY: 0,
        rootElementRect: null,
        x: 0,
        y: 0,
    });
    const { isCollabActive } = (0, LexicalCollaborationContext_1.useCollaborationContext)();
    (0, react_1.useEffect)(() => {
        const position = positioningRef.current;
        position.x = x;
        position.y = y;
        const stickyContainer = stickyContainerRef.current;
        if (stickyContainer !== null) {
            positionSticky(stickyContainer, position);
        }
    }, [x, y]);
    (0, useLayoutEffect_1.useLayoutEffectImpl)(() => {
        const position = positioningRef.current;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                const { target } = entry;
                position.rootElementRect = target.getBoundingClientRect();
                const stickyContainer = stickyContainerRef.current;
                if (stickyContainer !== null) {
                    positionSticky(stickyContainer, position);
                }
            }
        });
        const removeRootListener = editor.registerRootListener((nextRootElem, prevRootElem) => {
            if (prevRootElem !== null) {
                resizeObserver.unobserve(prevRootElem);
            }
            if (nextRootElem !== null) {
                resizeObserver.observe(nextRootElem);
            }
        });
        const handleWindowResize = () => {
            const rootElement = editor.getRootElement();
            const stickyContainer = stickyContainerRef.current;
            if (rootElement !== null && stickyContainer !== null) {
                position.rootElementRect = rootElement.getBoundingClientRect();
                positionSticky(stickyContainer, position);
            }
        };
        window.addEventListener('resize', handleWindowResize);
        return () => {
            window.removeEventListener('resize', handleWindowResize);
            removeRootListener();
        };
    }, [editor]);
    (0, react_1.useEffect)(() => {
        const stickyContainer = stickyContainerRef.current;
        if (stickyContainer !== null) {
            // Delay adding transition so we don't trigger the
            // transition on load of the sticky.
            setTimeout(() => {
                stickyContainer.style.setProperty('transition', 'top 0.3s ease 0s, left 0.3s ease 0s');
            }, 500);
        }
    }, []);
    const handlePointerMove = (event) => {
        const stickyContainer = stickyContainerRef.current;
        const positioning = positioningRef.current;
        const rootElementRect = positioning.rootElementRect;
        const zoom = (0, utils_1.calculateZoomLevel)(stickyContainer);
        if (stickyContainer !== null && positioning.isDragging && rootElementRect !== null) {
            positioning.x = event.pageX / zoom - positioning.offsetX - rootElementRect.left;
            positioning.y = event.pageY / zoom - positioning.offsetY - rootElementRect.top;
            positionSticky(stickyContainer, positioning);
        }
    };
    const handlePointerUp = (event) => {
        const stickyContainer = stickyContainerRef.current;
        const positioning = positioningRef.current;
        if (stickyContainer !== null) {
            positioning.isDragging = false;
            stickyContainer.classList.remove('dragging');
            editor.update(() => {
                const node = (0, lexical_1.$getNodeByKey)(nodeKey);
                if ((0, index_1.$isStickyNode)(node)) {
                    node.setPosition(positioning.x, positioning.y);
                }
            });
        }
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
    };
    const handleDelete = () => {
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, index_1.$isStickyNode)(node)) {
                node.remove();
            }
        });
    };
    const handleColorChange = () => {
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, index_1.$isStickyNode)(node)) {
                node.toggleColor();
            }
        });
    };
    const { historyState } = (0, SharedHistoryContext_1.useSharedHistoryContext)();
    return (React.createElement("div", { ref: stickyContainerRef, className: "sticky-note-container" },
        React.createElement("div", { className: `sticky-note ${color}`, onPointerDown: (event) => {
                const stickyContainer = stickyContainerRef.current;
                if (stickyContainer == null || event.button === 2 || event.target !== stickyContainer.firstChild) {
                    // Right click or click on editor should not work
                    return;
                }
                const stickContainer = stickyContainer;
                const positioning = positioningRef.current;
                if (stickContainer !== null) {
                    const { top, left } = stickContainer.getBoundingClientRect();
                    const zoom = (0, utils_1.calculateZoomLevel)(stickContainer);
                    positioning.offsetX = event.clientX / zoom - left;
                    positioning.offsetY = event.clientY / zoom - top;
                    positioning.isDragging = true;
                    stickContainer.classList.add('dragging');
                    document.addEventListener('pointermove', handlePointerMove);
                    document.addEventListener('pointerup', handlePointerUp);
                    event.preventDefault();
                }
            } },
            React.createElement("button", { type: "button", onClick: handleDelete, className: "delete", "aria-label": "Delete sticky note", title: "Delete" }, "X"),
            React.createElement("button", { type: "button", onClick: handleColorChange, className: "color", "aria-label": "Change sticky note color", title: "Color" },
                React.createElement("i", { className: "bucket" })),
            React.createElement(LexicalNestedComposer_1.LexicalNestedComposer, { initialEditor: caption, initialTheme: StickyEditorTheme_1.theme },
                isCollabActive ? React.createElement("div", null, "123") : React.createElement(LexicalHistoryPlugin_1.HistoryPlugin, { externalHistoryState: historyState }),
                React.createElement(LexicalPlainTextPlugin_1.PlainTextPlugin, { contentEditable: React.createElement(ContentEditable_1.LexicalContentEditable, { placeholder: "What's up?", placeholderClassName: "StickyNode__placeholder", className: "StickyNode__contentEditable" }), ErrorBoundary: LexicalErrorBoundary_1.LexicalErrorBoundary })))));
}
exports.default = StickyComponent;
