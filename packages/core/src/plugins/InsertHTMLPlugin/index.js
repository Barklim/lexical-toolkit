"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsertHTMLPlugin = void 0;
const lexical_1 = require("lexical");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const react_1 = require("react");
const html_1 = require("@lexical/html");
const InsertHTMLPlugin = ({ initialValues, isPlainText, html }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!initialValues)
            return;
        const preparedHTML = isPlainText ? `<div>${initialValues.subject}</div>` : html || '';
        const dom = new DOMParser().parseFromString(preparedHTML, 'text/html');
        editor.update(() => {
            const root = (0, lexical_1.$getRoot)();
            root.clear();
            root.append(...(0, html_1.$generateNodesFromDOM)(editor, dom));
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValues, isPlainText, editor]);
    return null;
};
exports.InsertHTMLPlugin = InsertHTMLPlugin;
