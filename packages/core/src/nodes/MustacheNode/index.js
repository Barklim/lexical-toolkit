"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMustacheNode = exports.createMustacheNode = exports.MustacheNode = void 0;
const lexical_1 = require("lexical");
const convertMustacheElement = (domNode) => {
    const textContent = domNode.textContent;
    if (textContent !== null) {
        const node = (0, exports.createMustacheNode)(textContent);
        return {
            node,
        };
    }
    return null;
};
const mustacheStyle = 'background-color: rgb(204, 255, 204)';
class MustacheNode extends lexical_1.TextNode {
    static getType() {
        return 'mustache';
    }
    static clone(node) {
        return new MustacheNode(node.__mustache, node.__text, node.__key);
    }
    static importJSON(serializedNode) {
        const node = (0, exports.createMustacheNode)(serializedNode.mustacheName);
        node.setTextContent(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    constructor(mustacheName, text, key) {
        super(text !== null && text !== void 0 ? text : mustacheName, key);
        this.__mustache = mustacheName;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { mustacheName: this.__mustache, type: 'mustache', version: 1 });
    }
    createDOM(config) {
        const dom = super.createDOM(config);
        dom.style.cssText = mustacheStyle;
        dom.className = 'mustache';
        return dom;
    }
    exportDOM() {
        const element = document.createElement('span');
        element.setAttribute('data-lexical-mustache', 'true');
        element.textContent = this.__text;
        return { element };
    }
    static importDOM() {
        return {
            span: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-mustache')) {
                    return null;
                }
                return {
                    conversion: convertMustacheElement,
                    priority: 1,
                };
            },
        };
    }
    isTextEntity() {
        return true;
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
}
exports.MustacheNode = MustacheNode;
const createMustacheNode = (mustacheName) => {
    const mustacheNode = new MustacheNode(mustacheName);
    mustacheNode.setMode('segmented').toggleDirectionless();
    return (0, lexical_1.$applyNodeReplacement)(mustacheNode);
};
exports.createMustacheNode = createMustacheNode;
const isMustacheNode = (node) => node instanceof MustacheNode;
exports.isMustacheNode = isMustacheNode;
