"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HyperlinkPlugin = void 0;
const react_1 = __importDefault(require("react"));
const LexicalLinkPlugin_1 = require("@lexical/react/LexicalLinkPlugin");
const LexicalAutoLinkPlugin_1 = require("@lexical/react/LexicalAutoLinkPlugin");
const AutoLinkMatchers_1 = require("./AutoLinkMatchers");
function HyperlinkPlugin(props) {
    const { validateUrl, shouldAutoLink = true } = props;
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(LexicalLinkPlugin_1.LinkPlugin, { validateUrl: validateUrl }),
        shouldAutoLink ? react_1.default.createElement(LexicalAutoLinkPlugin_1.AutoLinkPlugin, { matchers: AutoLinkMatchers_1.AUTOLINK_MATCHERS }) : react_1.default.createElement(react_1.default.Fragment, null)));
}
exports.HyperlinkPlugin = HyperlinkPlugin;
