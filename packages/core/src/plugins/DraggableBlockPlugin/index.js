"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DraggableBlockPlugin = void 0;
const LexicalDraggableBlockPlugin_1 = require("@lexical/react/LexicalDraggableBlockPlugin");
const react_1 = require("react");
// import './index.css';
const react_2 = __importDefault(require("react"));
const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';
function isOnMenu(element) {
    return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}
const DraggableBlockPlugin = ({ anchorElem = document.body }) => {
    const menuRef = (0, react_1.useRef)(null);
    const targetLineRef = (0, react_1.useRef)(null);
    return (react_2.default.createElement(LexicalDraggableBlockPlugin_1.DraggableBlockPlugin_EXPERIMENTAL, { anchorElem: anchorElem, menuRef: menuRef, targetLineRef: targetLineRef, menuComponent: react_2.default.createElement("div", { ref: menuRef, className: "icon draggable-block-menu" },
            react_2.default.createElement("div", { className: "icon" })), targetLineComponent: react_2.default.createElement("div", { ref: targetLineRef, className: "draggable-block-target-line" }), isOnMenu: isOnMenu }));
};
exports.DraggableBlockPlugin = DraggableBlockPlugin;
