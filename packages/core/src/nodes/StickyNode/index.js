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
exports.$createStickyNode = exports.$isStickyNode = exports.StickyNode = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const react_dom_1 = require("react-dom");
// eslint-disable-next-line import/no-cycle
const StickyComponent = React.lazy(() => Promise.resolve().then(() => __importStar(require('./StickyComponent'))));
class StickyNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'sticky';
    }
    static clone(node) {
        return new StickyNode(node.__x, node.__y, node.__color, node.__caption, node.__key);
    }
    static importJSON(serializedNode) {
        const stickyNode = new StickyNode(serializedNode.xOffset, serializedNode.yOffset, serializedNode.color);
        const caption = serializedNode.caption;
        const nestedEditor = stickyNode.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return stickyNode;
    }
    constructor(x, y, color, caption, key) {
        super(key);
        this.__x = x;
        this.__y = y;
        this.__caption = caption || (0, lexical_1.createEditor)();
        this.__color = color;
    }
    exportJSON() {
        return {
            caption: this.__caption.toJSON(),
            color: this.__color,
            type: 'sticky',
            version: 1,
            xOffset: this.__x,
            yOffset: this.__y,
        };
    }
    createDOM(config) {
        const div = document.createElement('div');
        div.style.display = 'contents';
        return div;
    }
    updateDOM() {
        return false;
    }
    setPosition(x, y) {
        const writable = this.getWritable();
        writable.__x = x;
        writable.__y = y;
        (0, lexical_1.$setSelection)(null);
    }
    toggleColor() {
        const writable = this.getWritable();
        writable.__color = writable.__color === 'pink' ? 'yellow' : 'pink';
    }
    decorate(editor, config) {
        return (0, react_dom_1.createPortal)(React.createElement(react_1.Suspense, { fallback: null },
            React.createElement(StickyComponent, { color: this.__color, x: this.__x, y: this.__y, nodeKey: this.getKey(), caption: this.__caption })), document.body);
    }
    isIsolated() {
        return true;
    }
}
exports.StickyNode = StickyNode;
function $isStickyNode(node) {
    return node instanceof StickyNode;
}
exports.$isStickyNode = $isStickyNode;
function $createStickyNode(xOffset, yOffset) {
    return new StickyNode(xOffset, yOffset, 'yellow');
}
exports.$createStickyNode = $createStickyNode;
