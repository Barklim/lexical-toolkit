"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isCollapsibleContentNode = exports.$createCollapsibleContentNode = exports.CollapsibleContentNode = exports.$convertCollapsibleContentElement = void 0;
const lexical_1 = require("lexical");
const environment_1 = require("../../shared/environment");
const invariant_1 = require("../../shared/invariant");
const CollapsibleContainerNode_1 = require("./CollapsibleContainerNode");
const CollapsibleUtils_1 = require("./CollapsibleUtils");
function $convertCollapsibleContentElement(domNode) {
    const node = $createCollapsibleContentNode();
    return {
        node,
    };
}
exports.$convertCollapsibleContentElement = $convertCollapsibleContentElement;
class CollapsibleContentNode extends lexical_1.ElementNode {
    static getType() {
        return 'collapsible-content';
    }
    static clone(node) {
        return new CollapsibleContentNode(node.__key);
    }
    createDOM(config, editor) {
        const dom = document.createElement('div');
        dom.classList.add('Collapsible__content');
        if (environment_1.IS_CHROME) {
            editor.getEditorState().read(() => {
                const containerNode = this.getParentOrThrow();
                (0, invariant_1.invariant)((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(containerNode), 'Expected parent node to be a CollapsibleContainerNode');
                if (!containerNode.__open) {
                    (0, CollapsibleUtils_1.setDomHiddenUntilFound)(dom);
                }
            });
            (0, CollapsibleUtils_1.domOnBeforeMatch)(dom, () => {
                editor.update(() => {
                    const containerNode = this.getParentOrThrow().getLatest();
                    (0, invariant_1.invariant)((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(containerNode), 'Expected parent node to be a CollapsibleContainerNode');
                    if (!containerNode.__open) {
                        containerNode.toggleOpen();
                    }
                });
            });
        }
        return dom;
    }
    updateDOM(prevNode, dom) {
        return false;
    }
    static importDOM() {
        return {
            div: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-collapsible-content')) {
                    return null;
                }
                return {
                    conversion: $convertCollapsibleContentElement,
                    priority: 2,
                };
            },
        };
    }
    exportDOM() {
        const element = document.createElement('div');
        element.classList.add('Collapsible__content');
        element.setAttribute('data-lexical-collapsible-content', 'true');
        return { element };
    }
    static importJSON(serializedNode) {
        return $createCollapsibleContentNode();
    }
    isShadowRoot() {
        return true;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'collapsible-content', version: 1 });
    }
}
exports.CollapsibleContentNode = CollapsibleContentNode;
function $createCollapsibleContentNode() {
    return new CollapsibleContentNode();
}
exports.$createCollapsibleContentNode = $createCollapsibleContentNode;
function $isCollapsibleContentNode(node) {
    return node instanceof CollapsibleContentNode;
}
exports.$isCollapsibleContentNode = $isCollapsibleContentNode;
