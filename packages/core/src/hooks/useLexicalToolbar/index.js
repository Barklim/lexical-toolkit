"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLexicalToolbar = void 0;
const code_1 = require("@lexical/code");
const link_1 = require("@lexical/link");
const list_1 = require("@lexical/list");
const LexicalDecoratorBlockNode_1 = require("@lexical/react/LexicalDecoratorBlockNode");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const rich_text_1 = require("@lexical/rich-text");
const selection_1 = require("@lexical/selection");
const table_1 = require("@lexical/table");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const useFontFormatOptions_1 = require("./useFontFormatOptions");
const useElementFormat_1 = require("./useElementFormat");
const useBlockFormat_1 = require("./useBlockFormat");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const blockTypeToBlockName = {
    bullet: "Bulleted List",
    check: "Check List",
    code: "Code Block",
    h1: "Heading 1",
    h2: "Heading 2",
    h3: "Heading 3",
    h4: "Heading 4",
    h5: "Heading 5",
    h6: "Heading 6",
    number: "Numbered List",
    paragraph: "Normal",
    quote: "Quote",
};
const rootTypeToRootName = {
    root: "Root",
    table: "Table",
};
function getCodeLanguageOptions() {
    const options = [];
    for (const [lang, friendlyName] of Object.entries(code_1.CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
        options.push([lang, friendlyName]);
    }
    return options;
}
const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();
function useLexicalToolbar(params) {
    const { editor, urlInitialValue = "" } = params;
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [blockType, setBlockType] = (0, react_1.useState)("paragraph");
    const [rootType, setRootType] = (0, react_1.useState)("root");
    const [selectedElementKey, setSelectedElementKey] = (0, react_1.useState)(null);
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    const [canUndo, setCanUndo] = (0, react_1.useState)(false);
    const [canRedo, setCanRedo] = (0, react_1.useState)(false);
    const [isRTL, setIsRTL] = (0, react_1.useState)(false);
    const [fontFamily, setFontFamily] = (0, react_1.useState)("Arial");
    const [fontSize, setFontSize] = (0, react_1.useState)("15px");
    const [fontColor, setFontColor] = (0, react_1.useState)("var(--n700)");
    const [bgColor, setBgColor] = (0, react_1.useState)("var(--n000)");
    const [elementFormat, setElementFormat] = (0, react_1.useState)("left");
    const [isBold, setIsBold] = (0, react_1.useState)(false);
    const [isItalic, setIsItalic] = (0, react_1.useState)(false);
    const [isUnderline, setIsUnderline] = (0, react_1.useState)(false);
    const [isStrikethrough, setIsStrikethrough] = (0, react_1.useState)(false);
    const [isSubscript, setIsSubscript] = (0, react_1.useState)(false);
    const [isSuperscript, setIsSuperscript] = (0, react_1.useState)(false);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const [isCode, setIsCode] = (0, react_1.useState)(false);
    const [codeLanguage, setCodeLanguage] = (0, react_1.useState)("");
    const $updateToolbar = (0, react_1.useCallback)(() => {
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getKey() === "root"
                ? anchorNode
                : (0, utils_1.$findMatchingParent)(anchorNode, (e) => {
                    const parent = e.getParent();
                    return parent !== null && (0, lexical_1.$isRootOrShadowRoot)(parent);
                });
            if (element === null) {
                element = anchorNode.getTopLevelElementOrThrow();
            }
            const elementKey = element.getKey();
            const elementDOM = activeEditor.getElementByKey(elementKey);
            // Update text format
            setIsBold(selection.hasFormat("bold"));
            setIsItalic(selection.hasFormat("italic"));
            setIsUnderline(selection.hasFormat("underline"));
            setIsStrikethrough(selection.hasFormat("strikethrough"));
            setIsSubscript(selection.hasFormat("subscript"));
            setIsSuperscript(selection.hasFormat("superscript"));
            setIsCode(selection.hasFormat("code"));
            setIsRTL((0, selection_1.$isParentElementRTL)(selection));
            // Update links
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const parent = node.getParent();
            if ((0, link_1.$isLinkNode)(parent) || (0, link_1.$isLinkNode)(node)) {
                setIsLink(true);
            }
            else {
                setIsLink(false);
            }
            const tableNode = (0, utils_1.$findMatchingParent)(node, table_1.$isTableNode);
            if ((0, table_1.$isTableNode)(tableNode)) {
                setRootType("table");
            }
            else {
                setRootType("root");
            }
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ((0, list_1.$isListNode)(element)) {
                    const parentList = (0, utils_1.$getNearestNodeOfType)(anchorNode, list_1.ListNode);
                    const type = parentList
                        ? parentList.getListType()
                        : element.getListType();
                    setBlockType(type);
                }
                else {
                    const type = (0, rich_text_1.$isHeadingNode)(element)
                        ? element.getTag()
                        : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                    if ((0, code_1.$isCodeNode)(element)) {
                        const language = element.getLanguage();
                        setCodeLanguage(language ? code_1.CODE_LANGUAGE_MAP[language] || language : "");
                        return;
                    }
                }
            }
            // Handle buttons
            setFontSize((0, selection_1.$getSelectionStyleValueForProperty)(selection, "font-size", "15px"));
            setFontColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, "color", "var(--n700)"));
            setBgColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, "background-color", "var(--n000)"));
            setFontFamily((0, selection_1.$getSelectionStyleValueForProperty)(selection, "font-family", "Arial"));
            setElementFormat(((0, lexical_1.$isElementNode)(node)
                ? node.getFormatType()
                : parent === null || parent === void 0 ? void 0 : parent.getFormatType()) || "left");
        }
    }, [activeEditor]);
    (0, react_1.useEffect)(() => {
        return editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            $updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL);
    }, [editor, $updateToolbar]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
            setIsEditable(editable);
        }), activeEditor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                $updateToolbar();
            });
        }), activeEditor.registerCommand(lexical_1.CAN_UNDO_COMMAND, (payload) => {
            setCanUndo(payload);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL), activeEditor.registerCommand(lexical_1.CAN_REDO_COMMAND, (payload) => {
            setCanRedo(payload);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL));
    }, [$updateToolbar, activeEditor, editor]);
    (0, react_1.useEffect)(() => {
        return activeEditor.registerCommand(lexical_1.KEY_MODIFIER_COMMAND, (payload) => {
            const event = payload;
            const { code, ctrlKey, metaKey } = event;
            if (code === "KeyK" && (ctrlKey || metaKey)) {
                event.preventDefault();
                return activeEditor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, urlInitialValue);
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_NORMAL);
    }, [activeEditor, isLink]);
    const applyStyleText = (0, react_1.useCallback)((styles) => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (selection !== null) {
                (0, selection_1.$patchStyleText)(selection, styles);
            }
        });
    }, [activeEditor]);
    const clearFormatting = (0, react_1.useCallback)(() => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection) || (0, table_1.$isTableSelection)(selection)) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const nodes = selection.getNodes();
                if (anchor.key === focus.key && anchor.offset === focus.offset) {
                    return;
                }
                nodes.forEach((node, idx) => {
                    // We split the first and last node by the selection
                    // So that we don't format unselected text inside those nodes
                    if ((0, lexical_1.$isTextNode)(node)) {
                        // Use a separate variable to ensure TS does not lose the refinement
                        let textNode = node;
                        if (idx === 0 && anchor.offset !== 0) {
                            textNode = textNode.splitText(anchor.offset)[1] || textNode;
                        }
                        if (idx === nodes.length - 1) {
                            textNode = textNode.splitText(focus.offset)[0] || textNode;
                        }
                        if (textNode.__style !== '') {
                            textNode.setStyle('');
                        }
                        if (textNode.__format !== 0) {
                            textNode.setFormat(0);
                            (0, utils_1.$getNearestBlockElementAncestorOrThrow)(textNode).setFormat('');
                        }
                        node = textNode;
                    }
                    else if ((0, rich_text_1.$isHeadingNode)(node) || (0, rich_text_1.$isQuoteNode)(node)) {
                        node.replace((0, lexical_1.$createParagraphNode)(), true);
                    }
                    else if ((0, LexicalDecoratorBlockNode_1.$isDecoratorBlockNode)(node)) {
                        node.setFormat('');
                    }
                });
            }
        });
    }, [activeEditor]);
    const onFontColorSelect = (0, react_1.useCallback)((value) => {
        applyStyleText({ color: value });
    }, [applyStyleText]);
    const onBgColorSelect = (0, react_1.useCallback)((value) => {
        applyStyleText({ "background-color": value });
    }, [applyStyleText]);
    const insertLink = (0, react_1.useCallback)(() => {
        if (!isLink) {
            editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, urlInitialValue);
        }
        else {
            editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, null);
        }
    }, [editor, isLink]);
    const onCodeLanguageSelect = (0, react_1.useCallback)((value) => {
        activeEditor.update(() => {
            if (selectedElementKey !== null) {
                const node = (0, lexical_1.$getNodeByKey)(selectedElementKey);
                if ((0, code_1.$isCodeNode)(node)) {
                    node.setLanguage(value);
                }
            }
        });
    }, [activeEditor, selectedElementKey]);
    return {
        isRTL: isRTL,
        blockType: blockType,
        isEditable: isEditable,
        undo: {
            dispatch: () => activeEditor.dispatchCommand(lexical_1.UNDO_COMMAND, undefined),
            disabled: !canUndo || !isEditable,
            title: "Undo (Ctrl+Z or ⌘Z)",
        },
        redo: {
            dispatch: () => activeEditor.dispatchCommand(lexical_1.REDO_COMMAND, undefined),
            disabled: !canRedo || !isEditable,
            title: "Redo (Ctrl+Y or ⌘Y)",
        },
        bold: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isBold,
            title: "Bold (Ctrl+B or ⌘B)",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "bold"),
        },
        italic: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isItalic,
            title: "Italic (Ctrl+I or ⌘I)",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "italic"),
        },
        underline: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isUnderline,
            title: "Underline (Ctrl+U or ⌘U)",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "underline"),
        },
        strikethrough: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isStrikethrough,
            title: "Strikethrough",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "strikethrough"),
        },
        subscript: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isSubscript,
            title: "Subscript",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "subscript"),
        },
        superscript: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isSuperscript,
            title: "Superscript",
            dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "superscript"),
        },
        clearFormatting: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Clear formatting",
            dispatch: () => clearFormatting(),
        },
        link: {
            show: blockType !== "code",
            disabled: !isEditable,
            active: isLink,
            title: "Insert link",
            dispatch: () => insertLink(),
        },
        fontFamily: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Font family",
            value: fontFamily,
            options: (0, useFontFormatOptions_1.useFontFormatOptions)({
                editor: activeEditor,
                value: fontFamily,
                style: "font-family",
            }),
        },
        fontSize: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Font size",
            value: fontSize,
            options: (0, useFontFormatOptions_1.useFontFormatOptions)({
                editor: activeEditor,
                value: fontColor,
                style: "size",
            }),
        },
        fontColor: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Text color",
            value: fontColor,
            dispatch: onFontColorSelect,
        },
        backgroundColor: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Background color",
            value: bgColor,
            dispatch: onBgColorSelect,
        },
        hr: {
            show: blockType !== "code",
            disabled: !isEditable,
            title: "Insert horizontal rule",
            dispatch: () => activeEditor.dispatchCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, undefined),
        },
        blockFormatting: Object.assign({ show: blockType in blockTypeToBlockName && activeEditor === editor, disabled: !isEditable, value: blockType }, (0, useBlockFormat_1.useBlockFormat)({
            editor: activeEditor,
            blockType,
            rootType,
        })),
        elementFormatting: Object.assign({ disabled: !isEditable, value: elementFormat }, (0, useElementFormat_1.useElementFormat)({
            editor: activeEditor,
            value: elementFormat,
        })),
        code: {
            disabled: !isEditable,
            active: isCode,
            insert: {
                show: blockType !== "code",
                title: "Insert code block",
                dispatch: () => activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, "code"),
            },
            edit: {
                show: blockType === "code",
                title: "Select language",
                value: codeLanguage,
                label: (0, code_1.getLanguageFriendlyName)(codeLanguage),
                options: CODE_LANGUAGE_OPTIONS.map(([value, name]) => {
                    return {
                        title: name,
                        value: value,
                        active: value === codeLanguage,
                        dispatch: () => onCodeLanguageSelect(value),
                    };
                }),
            },
        },
    };
}
exports.useLexicalToolbar = useLexicalToolbar;
