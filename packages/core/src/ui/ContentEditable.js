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
exports.LexicalContentEditable = void 0;
const LexicalContentEditable_1 = require("@lexical/react/LexicalContentEditable");
const React = __importStar(require("react"));
const LexicalContentEditable = ({ className = '', placeholder, placeholderClassName = 'ContentEditable__placeholder', inputMode, }) => {
    const rootClass = `ContentEditable__root ${inputMode ? 'ContentEditable__root_inputMode' : 'ContentEditable__root_rte'} ${className}`.trim();
    const placeholderClass = `${inputMode ? 'ContentEditable__placeholder_inputMode' : 'ContentEditable__placeholder_rte'} ${placeholderClassName}`.trim();
    return (React.createElement(LexicalContentEditable_1.ContentEditable, { className: rootClass, "aria-placeholder": placeholder, placeholder: React.createElement("div", { className: placeholderClass }, placeholder) }));
};
exports.LexicalContentEditable = LexicalContentEditable;
