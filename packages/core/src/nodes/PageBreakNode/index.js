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
exports.$isPageBreakNode = exports.$createPageBreakNode = exports.PageBreakNode = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
function PageBreakComponent({ nodeKey }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const $onDelete = (0, react_1.useCallback)((event) => {
        event.preventDefault();
        const deleteSelection = (0, lexical_1.$getSelection)();
        if (isSelected && (0, lexical_1.$isNodeSelection)(deleteSelection)) {
            editor.update(() => {
                deleteSelection.getNodes().forEach((node) => {
                    if ($isPageBreakNode(node)) {
                        node.remove();
                    }
                });
            });
        }
        return false;
    }, [editor, isSelected]);
    (0, react_1.useEffect)(() => (0, utils_1.mergeRegister)(editor.registerCommand(lexical_1.CLICK_COMMAND, (event) => {
        const pbElem = editor.getElementByKey(nodeKey);
        if (event.target === pbElem) {
            if (!event.shiftKey) {
                clearSelection();
            }
            setSelected(!isSelected);
            return true;
        }
        return false;
    }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW)), [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected]);
    (0, react_1.useEffect)(() => {
        const pbElem = editor.getElementByKey(nodeKey);
        if (pbElem !== null) {
            pbElem.className = isSelected ? 'selected' : '';
        }
    }, [editor, isSelected, nodeKey]);
    return null;
}
class PageBreakNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'page-break';
    }
    static clone(node) {
        return new PageBreakNode(node.__key);
    }
    static importJSON(serializedNode) {
        return $createPageBreakNode();
    }
    static importDOM() {
        return {
            figure: (domNode) => {
                const tp = domNode.getAttribute('type');
                if (tp !== this.getType()) {
                    return null;
                }
                return {
                    conversion: $convertPageBreakElement,
                    priority: lexical_1.COMMAND_PRIORITY_HIGH,
                };
            },
        };
    }
    exportJSON() {
        return {
            type: this.getType(),
            version: 1,
        };
    }
    createDOM() {
        const el = document.createElement('figure');
        el.style.pageBreakAfter = 'always';
        el.setAttribute('type', this.getType());
        return el;
    }
    getTextContent() {
        return '\n';
    }
    isInline() {
        return false;
    }
    updateDOM() {
        return false;
    }
    decorate() {
        return React.createElement(PageBreakComponent, { nodeKey: this.__key });
    }
}
exports.PageBreakNode = PageBreakNode;
function $convertPageBreakElement() {
    return { node: $createPageBreakNode() };
}
function $createPageBreakNode() {
    return new PageBreakNode();
}
exports.$createPageBreakNode = $createPageBreakNode;
function $isPageBreakNode(node) {
    return node instanceof PageBreakNode;
}
exports.$isPageBreakNode = $isPageBreakNode;
