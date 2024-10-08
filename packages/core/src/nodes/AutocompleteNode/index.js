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
exports.$createAutocompleteNode = exports.AutocompleteNode = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const SharedAutocompleteContext_1 = require("../../context/SharedAutocompleteContext");
// eslint-disable-next-line import/no-cycle
const AutocompletePlugin_1 = require("../../plugins/AutocompletePlugin");
class AutocompleteNode extends lexical_1.DecoratorNode {
    static clone(node) {
        return new AutocompleteNode(node.__uuid, node.__key);
    }
    static getType() {
        return 'autocomplete';
    }
    static importJSON(serializedNode) {
        const node = $createAutocompleteNode(serializedNode.uuid);
        return node;
    }
    exportJSON() {
        return Object.assign(Object.assign({}, super.exportJSON()), { type: 'autocomplete', uuid: this.__uuid, version: 1 });
    }
    constructor(uuid, key) {
        super(key);
        this.__uuid = uuid;
    }
    updateDOM(prevNode, dom, config) {
        return false;
    }
    createDOM(config) {
        return document.createElement('span');
    }
    decorate(editor, config) {
        if (this.__uuid !== AutocompletePlugin_1.uuid) {
            return null;
        }
        return React.createElement(AutocompleteComponent, { className: config.theme.autocomplete });
    }
}
exports.AutocompleteNode = AutocompleteNode;
function $createAutocompleteNode(uuid) {
    return new AutocompleteNode(uuid);
}
exports.$createAutocompleteNode = $createAutocompleteNode;
function AutocompleteComponent({ className }) {
    const [suggestion] = (0, SharedAutocompleteContext_1.useSharedAutocompleteContext)();
    const userAgentData = window.navigator.userAgentData;
    const isMobile = userAgentData !== undefined ? userAgentData.mobile : window.innerWidth <= 800 && window.innerHeight <= 600;
    return (React.createElement("span", { className: className, spellCheck: "false" },
        suggestion,
        " ",
        isMobile ? '(SWIPE \u2B95)' : '(TAB)'));
}
