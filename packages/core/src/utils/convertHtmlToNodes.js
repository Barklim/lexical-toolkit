"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertHtmlToNodes = void 0;
const html_1 = require("@lexical/html");
function convertHtmlToNodes(html, editor) {
    // Use the native DOMParser API to parse the HTML string
    const parser = new DOMParser();
    const newDOM = parser.parseFromString(html, "text/html");
    // Generate LexicalNodes based on the DOM instance
    return (0, html_1.$generateNodesFromDOM)(editor, newDOM);
}
exports.convertHtmlToNodes = convertHtmlToNodes;
