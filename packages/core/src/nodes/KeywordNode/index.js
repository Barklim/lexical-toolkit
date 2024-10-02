"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isKeywordNode = exports.$createKeywordNode = exports.KeywordNode = void 0;
const lexical_1 = require("lexical");
class KeywordNode extends lexical_1.TextNode {
    static getType() {
        return "keyword";
    }
    static clone(node) {
        return new KeywordNode(node.__text, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createKeywordNode(serializedNode.text);
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: "keyword", version: 1 });
    }
    createDOM(config) {
        var _a;
        const dom = super.createDOM(config);
        let keywordClass = (_a = config.theme) === null || _a === void 0 ? void 0 : _a.keyword;
        if (!keywordClass) {
            keywordClass = "lexical-toolkit-keyword";
            console.warn("Lexical Toolkit. KeywordNode: No keyword class found in theme, used 'lexical-toolkit-keyword' instead.");
        }
        dom.className = keywordClass;
        return dom;
    }
    canInsertTextBefore() {
        return false;
    }
    canInsertTextAfter() {
        return false;
    }
    isTextEntity() {
        return true;
    }
}
exports.KeywordNode = KeywordNode;
function $createKeywordNode(keyword) {
    return new KeywordNode(keyword);
}
exports.$createKeywordNode = $createKeywordNode;
function $isKeywordNode(node) {
    return node instanceof KeywordNode;
}
exports.$isKeywordNode = $isKeywordNode;
