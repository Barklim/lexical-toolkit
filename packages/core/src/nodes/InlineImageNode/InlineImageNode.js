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
exports.$isInlineImageNode = exports.$createInlineImageNode = exports.InlineImageNode = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
// eslint-disable-next-line import/no-cycle
const InlineImageComponent = React.lazy(() => Promise.resolve().then(() => __importStar(require('./InlineImageComponent'))));
function $convertInlineImageElement(domNode) {
    if (domNode instanceof HTMLImageElement) {
        const { alt: altText, src, width, height } = domNode;
        const node = $createInlineImageNode({ altText, height, src, width });
        return { node };
    }
    return null;
}
class InlineImageNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'inline-image';
    }
    static clone(node) {
        return new InlineImageNode(node.__src, node.__altText, node.__position, node.__width, node.__height, node.__showCaption, node.__caption, node.__key);
    }
    static importJSON(serializedNode) {
        const { altText, height, width, caption, src, showCaption, position } = serializedNode;
        const node = $createInlineImageNode({
            altText,
            height,
            position,
            showCaption,
            src,
            width,
        });
        const nestedEditor = node.__caption;
        const editorState = nestedEditor.parseEditorState(caption.editorState);
        if (!editorState.isEmpty()) {
            nestedEditor.setEditorState(editorState);
        }
        return node;
    }
    static importDOM() {
        return {
            img: (node) => ({
                conversion: $convertInlineImageElement,
                priority: 0,
            }),
        };
    }
    constructor(src, altText, position, width, height, showCaption, caption, key) {
        super(key);
        this.__src = src;
        this.__altText = altText;
        this.__width = width || 'inherit';
        this.__height = height || 'inherit';
        this.__showCaption = showCaption || false;
        this.__caption = caption || (0, lexical_1.createEditor)();
        this.__position = position;
    }
    exportDOM() {
        const element = document.createElement('img');
        element.setAttribute('src', this.__src);
        element.setAttribute('alt', this.__altText);
        element.setAttribute('width', this.__width.toString());
        element.setAttribute('height', this.__height.toString());
        return { element };
    }
    exportJSON() {
        return {
            altText: this.getAltText(),
            caption: this.__caption.toJSON(),
            height: this.__height === 'inherit' ? 0 : this.__height,
            position: this.__position,
            showCaption: this.__showCaption,
            src: this.getSrc(),
            type: 'inline-image',
            version: 1,
            width: this.__width === 'inherit' ? 0 : this.__width,
        };
    }
    getSrc() {
        return this.__src;
    }
    getAltText() {
        return this.__altText;
    }
    setAltText(altText) {
        const writable = this.getWritable();
        writable.__altText = altText;
    }
    setWidthAndHeight(width, height) {
        const writable = this.getWritable();
        writable.__width = width;
        writable.__height = height;
    }
    getShowCaption() {
        return this.__showCaption;
    }
    setShowCaption(showCaption) {
        const writable = this.getWritable();
        writable.__showCaption = showCaption;
    }
    getPosition() {
        return this.__position;
    }
    setPosition(position) {
        const writable = this.getWritable();
        writable.__position = position;
    }
    update(payload) {
        const writable = this.getWritable();
        const { altText, showCaption, position } = payload;
        if (altText !== undefined) {
            writable.__altText = altText;
        }
        if (showCaption !== undefined) {
            writable.__showCaption = showCaption;
        }
        if (position !== undefined) {
            writable.__position = position;
        }
    }
    // View
    createDOM(config) {
        const span = document.createElement('span');
        const className = `${config.theme.inlineImage} position-${this.__position}`;
        if (className !== undefined) {
            span.className = className;
        }
        return span;
    }
    updateDOM(prevNode, dom, config) {
        const position = this.__position;
        if (position !== prevNode.__position) {
            const className = `${config.theme.inlineImage} position-${position}`;
            if (className !== undefined) {
                dom.className = className;
            }
        }
        return false;
    }
    decorate() {
        return (React.createElement(react_1.Suspense, { fallback: null },
            React.createElement(InlineImageComponent, { src: this.__src, altText: this.__altText, width: this.__width, height: this.__height, nodeKey: this.getKey(), showCaption: this.__showCaption, caption: this.__caption, position: this.__position })));
    }
}
exports.InlineImageNode = InlineImageNode;
function $createInlineImageNode({ altText, position, height, src, width, showCaption, caption, key, }) {
    return (0, lexical_1.$applyNodeReplacement)(new InlineImageNode(src, altText, position, width, height, showCaption, caption, key));
}
exports.$createInlineImageNode = $createInlineImageNode;
function $isInlineImageNode(node) {
    return node instanceof InlineImageNode;
}
exports.$isInlineImageNode = $isInlineImageNode;
