"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isLayoutItemNode = exports.$createLayoutItemNode = exports.LayoutItemNode = void 0;
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
class LayoutItemNode extends lexical_1.ElementNode {
    static getType() {
        return 'layout-item';
    }
    static clone(node) {
        return new LayoutItemNode(node.__key);
    }
    createDOM(config) {
        const dom = document.createElement('div');
        if (typeof config.theme.layoutItem === 'string') {
            (0, utils_1.addClassNamesToElement)(dom, config.theme.layoutItem);
        }
        return dom;
    }
    updateDOM() {
        return false;
    }
    static importDOM() {
        return {};
    }
    static importJSON() {
        return $createLayoutItemNode();
    }
    isShadowRoot() {
        return true;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'layout-item', version: 1 });
    }
}
exports.LayoutItemNode = LayoutItemNode;
function $createLayoutItemNode() {
    return new LayoutItemNode();
}
exports.$createLayoutItemNode = $createLayoutItemNode;
function $isLayoutItemNode(node) {
    return node instanceof LayoutItemNode;
}
exports.$isLayoutItemNode = $isLayoutItemNode;
