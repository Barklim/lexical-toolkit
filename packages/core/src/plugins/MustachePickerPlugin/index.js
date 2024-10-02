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
exports.MustachePickerPlugin = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalTypeaheadMenuPlugin_1 = require("@lexical/react/LexicalTypeaheadMenuPlugin");
const react_1 = require("react");
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
const MustacheNode_1 = require("../../nodes/MustacheNode");
const PUNCTUATION = '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = `\\b[A-Z][^\\s${PUNCTUATION}]`;
const DocumentMustachesRegex = {
    NAME,
    PUNCTUATION,
};
const PUNC = DocumentMustachesRegex.PUNCTUATION;
const VALID_CHARS = `[^${PUNC}\\s]`;
const VALID_JOINS = `(?:\\.[ |$]| |[${PUNC}]|)`;
const LENGTH_LIMIT = 75;
const AtSignMustachesRegex = new RegExp(`(^|\\s|\\()(\\{\\{\\s*((?:${VALID_CHARS}${VALID_JOINS}){0,${LENGTH_LIMIT}}))$`);
const ALIAS_LENGTH_LIMIT = 50;
const AtSignMustachesRegexAliasRegex = new RegExp(`(^|\\s|\\()(\\{\\{\\s*((?:${VALID_CHARS}){0,${ALIAS_LENGTH_LIMIT}}))$`);
const SUGGESTION_LIST_LENGTH_LIMIT = 5;
const mustachesCache = new Map();
function useMustacheLookupService(mustacheString, tags) {
    const [results, setResults] = (0, react_1.useState)([]);
    (0, react_1.useEffect)(() => {
        const cachedResults = mustachesCache.get(mustacheString);
        if (mustacheString == null) {
            setResults([]);
            return;
        }
        if (cachedResults === null) {
            return;
        }
        else if (cachedResults !== undefined) {
            setResults(cachedResults);
            return;
        }
        mustachesCache.set(mustacheString, null);
        const tagCodes = tags.map((tag) => tag.name);
        const filteredResults = tagCodes.filter((mustache) => mustache.toLowerCase().includes(mustacheString.toLowerCase()));
        mustachesCache.set(mustacheString, filteredResults);
        setResults(filteredResults);
    }, [mustacheString, tags]);
    return results;
}
function checkForAtSignMustaches(text) {
    let match = AtSignMustachesRegex.exec(text);
    if (match === null) {
        match = AtSignMustachesRegexAliasRegex.exec(text);
    }
    if (match !== null) {
        const maybeLeadingWhitespace = match[1];
        const matchingString = match[3];
        return {
            leadOffset: match.index + maybeLeadingWhitespace.length,
            matchingString,
            replaceableString: match[2],
        };
    }
    return null;
}
function getPossibleQueryMatch(text) {
    return checkForAtSignMustaches(text);
}
class MustacheTypeaheadOption extends LexicalTypeaheadMenuPlugin_1.MenuOption {
    constructor(name) {
        super(name);
        this.name = name;
    }
}
function MustachesTypeaheadMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (React.createElement("li", { key: option.key, tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: `typeahead-item-${index}`, onMouseEnter: onMouseEnter, onClick: onClick },
        React.createElement("span", { className: "text" }, option.name)));
}
const MustachePickerPlugin = ({ tags }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [queryString, setQueryString] = (0, react_1.useState)(null);
    const results = useMustacheLookupService(queryString, tags);
    const checkForSlashTriggerMatch = (0, LexicalTypeaheadMenuPlugin_1.useBasicTypeaheadTriggerMatch)('/', {
        minLength: 0,
    });
    const options = (0, react_1.useMemo)(() => results.map((result) => new MustacheTypeaheadOption(result)).slice(0, SUGGESTION_LIST_LENGTH_LIMIT), [results]);
    const onSelectOption = (0, react_1.useCallback)((selectedOption, nodeToReplace, closeMenu) => {
        if (nodeToReplace) {
            editor.update(() => {
                const mustacheNode = (0, MustacheNode_1.createMustacheNode)(selectedOption.name);
                nodeToReplace.replace(mustacheNode);
                mustacheNode.select();
                closeMenu();
            });
        }
    }, [editor]);
    const checkForMustacheMatch = (0, react_1.useCallback)((text) => {
        const slashMatch = checkForSlashTriggerMatch(text, editor);
        if (slashMatch !== null) {
            return null;
        }
        return getPossibleQueryMatch(text);
    }, [checkForSlashTriggerMatch, editor]);
    return (React.createElement(LexicalTypeaheadMenuPlugin_1.LexicalTypeaheadMenuPlugin, { onQueryChange: setQueryString, onSelectOption: onSelectOption, triggerFn: checkForMustacheMatch, options: options, menuRenderFn: (anchorElementRef, { selectedIndex, selectOptionAndCleanUp, setHighlightedIndex }) => anchorElementRef.current && results.length
            ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover mentions-menu" },
                React.createElement("ul", null, options.map((option, i) => (React.createElement(MustachesTypeaheadMenuItem, { index: i, isSelected: selectedIndex === i, onClick: () => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                    }, onMouseEnter: () => {
                        setHighlightedIndex(i);
                    }, key: option.key, option: option }))))), anchorElementRef.current)
            : null }));
};
exports.MustachePickerPlugin = MustachePickerPlugin;
