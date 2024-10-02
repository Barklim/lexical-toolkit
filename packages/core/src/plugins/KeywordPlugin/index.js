"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeywordPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const useLexicalTextEntity_1 = require("@lexical/react/useLexicalTextEntity");
const react_1 = require("react");
const KeywordNode_1 = require("../../nodes/KeywordNode");
function createRegexForPhrases(phrases) {
    const regexPattern = phrases.join("|");
    return new RegExp(`(\\b|^|$)(${regexPattern})(\\b|^|$)`, "igu");
}
function KeywordPlugin(props) {
    const { regex, phrases } = props;
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([KeywordNode_1.KeywordNode])) {
            throw new Error("KeywordsPlugin: KeywordNode not registered on editor");
        }
    }, [editor]);
    const createKeywordNode = (0, react_1.useCallback)((textNode) => {
        return (0, KeywordNode_1.$createKeywordNode)(textNode.getTextContent());
    }, []);
    const getKeywordMatch = (0, react_1.useCallback)((text) => {
        const matchText = (regExp) => {
            const matchArr = regExp.exec(text);
            if (matchArr === null) {
                return null;
            }
            const keywordLength = matchArr[2].length;
            const startOffset = matchArr.index + matchArr[1].length;
            const endOffset = startOffset + keywordLength;
            return {
                end: endOffset,
                start: startOffset,
            };
        };
        if (regex) {
            return matchText(regex);
        }
        if (phrases) {
            const dynamicRegex = createRegexForPhrases(phrases);
            return matchText(dynamicRegex);
        }
        return null;
    }, [regex, phrases]);
    (0, useLexicalTextEntity_1.useLexicalTextEntity)(getKeywordMatch, KeywordNode_1.KeywordNode, createKeywordNode);
    return null;
}
exports.KeywordPlugin = KeywordPlugin;
