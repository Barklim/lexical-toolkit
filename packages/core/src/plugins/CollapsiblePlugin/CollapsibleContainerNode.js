"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.$isCollapsibleContainerNode = exports.$createCollapsibleContainerNode = exports.CollapsibleContainerNode = exports.$convertDetailsElement = void 0;
const lexical_1 = require("lexical");
const environment_1 = require("../../shared/environment");
const invariant_1 = require("../../shared/invariant");
const CollapsibleUtils_1 = require("./CollapsibleUtils");
function $convertDetailsElement(domNode) {
    const isOpen = domNode.open !== undefined ? domNode.open : true;
    const node = $createCollapsibleContainerNode(isOpen);
    return {
        node,
    };
}
exports.$convertDetailsElement = $convertDetailsElement;
class CollapsibleContainerNode extends lexical_1.ElementNode {
    constructor(open, key) {
        super(key);
        this.__open = open;
    }
    static getType() {
        return 'collapsible-container';
    }
    static clone(node) {
        return new CollapsibleContainerNode(node.__open, node.__key);
    }
    createDOM(config, editor) {
        // details is not well supported in Chrome #5582
        let dom;
        if (environment_1.IS_CHROME) {
            dom = document.createElement('div');
            dom.setAttribute('open', '');
        }
        else {
            const detailsDom = document.createElement('details');
            detailsDom.open = this.__open;
            detailsDom.addEventListener('toggle', () => {
                const open = editor.getEditorState().read(() => this.getOpen());
                if (open !== detailsDom.open) {
                    editor.update(() => this.toggleOpen());
                }
            });
            dom = detailsDom;
        }
        dom.classList.add('Collapsible__container');
        return dom;
    }
    updateDOM(prevNode, dom) {
        const currentOpen = this.__open;
        if (prevNode.__open !== currentOpen) {
            // details is not well supported in Chrome #5582
            if (environment_1.IS_CHROME) {
                const contentDom = dom.children[1];
                (0, invariant_1.invariant)((0, lexical_1.isHTMLElement)(contentDom), 'Expected contentDom to be an HTMLElement');
                if (currentOpen) {
                    dom.setAttribute('open', '');
                    contentDom.hidden = false;
                }
                else {
                    dom.removeAttribute('open');
                    (0, CollapsibleUtils_1.setDomHiddenUntilFound)(contentDom);
                }
            }
            else {
                dom.open = this.__open;
            }
        }
        return false;
    }
    static importDOM() {
        return {
            details: (domNode) => ({
                conversion: $convertDetailsElement,
                priority: 1,
            }),
        };
    }
    static importJSON(serializedNode) {
        const node = $createCollapsibleContainerNode(serializedNode.open);
        return node;
    }
    exportDOM() {
        const element = document.createElement('details');
        element.classList.add('Collapsible__container');
        element.setAttribute('open', this.__open.toString());
        return { element };
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { open: this.__open, type: 'collapsible-container', version: 1 });
    }
    setOpen(open) {
        const writable = this.getWritable();
        writable.__open = open;
    }
    getOpen() {
        return this.getLatest().__open;
    }
    toggleOpen() {
        this.setOpen(!this.getOpen());
    }
}
exports.CollapsibleContainerNode = CollapsibleContainerNode;
function $createCollapsibleContainerNode(isOpen) {
    return new CollapsibleContainerNode(isOpen);
}
exports.$createCollapsibleContainerNode = $createCollapsibleContainerNode;
function $isCollapsibleContainerNode(node) {
    return node instanceof CollapsibleContainerNode;
}
exports.$isCollapsibleContainerNode = $isCollapsibleContainerNode;
