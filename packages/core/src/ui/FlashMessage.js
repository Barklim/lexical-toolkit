"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashMessage = void 0;
const react_dom_1 = require("react-dom");
// import './FlashMessage.css';
const react_1 = __importDefault(require("react"));
const FlashMessage = ({ children }) => (0, react_dom_1.createPortal)(react_1.default.createElement("div", { className: "FlashMessage__overlay", role: "dialog" },
    react_1.default.createElement("p", { className: "FlashMessage__alert", role: "alert" }, children)), document.body);
exports.FlashMessage = FlashMessage;
