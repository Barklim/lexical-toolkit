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
exports.ToolbarPlugin = void 0;
const code_1 = require("@lexical/code");
const link_1 = require("@lexical/link");
const list_1 = require("@lexical/list");
const LexicalAutoEmbedPlugin_1 = require("@lexical/react/LexicalAutoEmbedPlugin");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalDecoratorBlockNode_1 = require("@lexical/react/LexicalDecoratorBlockNode");
const LexicalHorizontalRuleNode_1 = require("@lexical/react/LexicalHorizontalRuleNode");
const rich_text_1 = require("@lexical/rich-text");
const selection_1 = require("@lexical/selection");
const table_1 = require("@lexical/table");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const environment_1 = require("../../shared/environment");
const useModal_1 = require("../../hooks/useModal");
// import catTypingGif from '../../images/cat-typing.gif';
const StickyNode_1 = require("../../nodes/StickyNode");
const DropDown_1 = __importStar(require("../../ui/DropDown"));
const DropdownColorPicker_1 = require("../../ui/DropdownColorPicker");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const url_1 = require("../../utils/url");
const AutoEmbedPlugin_1 = require("../AutoEmbedPlugin");
const CollapsiblePlugin_1 = require("../CollapsiblePlugin");
const EquationsPlugin_1 = require("../EquationsPlugin");
const ImagesPlugin_1 = require("../ImagesPlugin");
const InlineImagePlugin_1 = require("../InlineImagePlugin");
const InsertLayoutDialog_1 = require("../LayoutPlugin/InsertLayoutDialog");
const PageBreakPlugin_1 = require("../PageBreakPlugin");
const PollPlugin_1 = require("../PollPlugin");
const fontSize_1 = require("./fontSize");
const blockTypeToBlockName = {
    bullet: 'Bulleted List',
    check: 'Check List',
    code: 'Code Block',
    h1: 'Heading 1',
    h2: 'Heading 2',
    h3: 'Heading 3',
    h4: 'Heading 4',
    h5: 'Heading 5',
    h6: 'Heading 6',
    number: 'Numbered List',
    paragraph: 'Normal',
    quote: 'Quote',
};
const rootTypeToRootName = {
    root: 'Root',
    table: 'Table',
};
function getCodeLanguageOptions() {
    const options = [];
    for (const [lang, friendlyName] of Object.entries(code_1.CODE_LANGUAGE_FRIENDLY_NAME_MAP)) {
        options.push([lang, friendlyName]);
    }
    return options;
}
const CODE_LANGUAGE_OPTIONS = getCodeLanguageOptions();
const FONT_FAMILY_OPTIONS = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
];
const FONT_SIZE_OPTIONS = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
];
const ELEMENT_FORMAT_OPTIONS = {
    center: {
        icon: 'center-align',
        iconRTL: 'center-align',
        name: 'Center Align',
    },
    end: {
        icon: 'right-align',
        iconRTL: 'left-align',
        name: 'End Align',
    },
    justify: {
        icon: 'justify-align',
        iconRTL: 'justify-align',
        name: 'Justify Align',
    },
    left: {
        icon: 'left-align',
        iconRTL: 'left-align',
        name: 'Left Align',
    },
    right: {
        icon: 'right-align',
        iconRTL: 'right-align',
        name: 'Right Align',
    },
    start: {
        icon: 'left-align',
        iconRTL: 'right-align',
        name: 'Start Align',
    },
};
function dropDownActiveClass(active) {
    if (active) {
        return 'active dropdown-item-active';
    }
    return '';
}
function BlockFormatDropDown({ editor, blockType, rootType, disabled = false, }) {
    const formatParagraph = () => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                (0, selection_1.$setBlocksType)(selection, () => (0, lexical_1.$createParagraphNode)());
            }
        });
    };
    const formatHeading = (headingSize) => {
        if (blockType !== headingSize) {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                (0, selection_1.$setBlocksType)(selection, () => (0, rich_text_1.$createHeadingNode)(headingSize));
            });
        }
    };
    const formatBulletList = () => {
        if (blockType !== 'bullet') {
            editor.dispatchCommand(list_1.INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
        else {
            formatParagraph();
        }
    };
    const formatCheckList = () => {
        if (blockType !== 'check') {
            editor.dispatchCommand(list_1.INSERT_CHECK_LIST_COMMAND, undefined);
        }
        else {
            formatParagraph();
        }
    };
    const formatNumberedList = () => {
        if (blockType !== 'number') {
            editor.dispatchCommand(list_1.INSERT_ORDERED_LIST_COMMAND, undefined);
        }
        else {
            formatParagraph();
        }
    };
    const formatQuote = () => {
        if (blockType !== 'quote') {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                (0, selection_1.$setBlocksType)(selection, () => (0, rich_text_1.$createQuoteNode)());
            });
        }
    };
    const formatCode = () => {
        if (blockType !== 'code') {
            editor.update(() => {
                let selection = (0, lexical_1.$getSelection)();
                if (selection !== null) {
                    if (selection.isCollapsed()) {
                        (0, selection_1.$setBlocksType)(selection, () => (0, code_1.$createCodeNode)());
                    }
                    else {
                        const textContent = selection.getTextContent();
                        const codeNode = (0, code_1.$createCodeNode)();
                        selection.insertNodes([codeNode]);
                        selection = (0, lexical_1.$getSelection)();
                        if ((0, lexical_1.$isRangeSelection)(selection)) {
                            selection.insertRawText(textContent);
                        }
                    }
                }
            });
        }
    };
    return (React.createElement(DropDown_1.default, { disabled: disabled, buttonClassName: "toolbar-item block-controls", buttonIconClassName: `icon block-type ${blockType}`, buttonLabel: blockTypeToBlockName[blockType], buttonAriaLabel: "Formatting options for text style" },
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'paragraph')}`, onClick: formatParagraph },
            React.createElement("i", { className: "icon paragraph" }),
            React.createElement("span", { className: "text" }, "Normal")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h1')}`, onClick: () => formatHeading('h1') },
            React.createElement("i", { className: "icon h1" }),
            React.createElement("span", { className: "text" }, "Heading 1")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h2')}`, onClick: () => formatHeading('h2') },
            React.createElement("i", { className: "icon h2" }),
            React.createElement("span", { className: "text" }, "Heading 2")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'h3')}`, onClick: () => formatHeading('h3') },
            React.createElement("i", { className: "icon h3" }),
            React.createElement("span", { className: "text" }, "Heading 3")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'bullet')}`, onClick: formatBulletList },
            React.createElement("i", { className: "icon bullet-list" }),
            React.createElement("span", { className: "text" }, "Bullet List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'number')}`, onClick: formatNumberedList },
            React.createElement("i", { className: "icon numbered-list" }),
            React.createElement("span", { className: "text" }, "Numbered List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'check')}`, onClick: formatCheckList },
            React.createElement("i", { className: "icon check-list" }),
            React.createElement("span", { className: "text" }, "Check List")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'quote')}`, onClick: formatQuote },
            React.createElement("i", { className: "icon quote" }),
            React.createElement("span", { className: "text" }, "Quote")),
        React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(blockType === 'code')}`, onClick: formatCode },
            React.createElement("i", { className: "icon code" }),
            React.createElement("span", { className: "text" }, "Code Block"))));
}
function Divider() {
    return React.createElement("div", { className: "divider" });
}
function FontDropDown({ editor, value, style, disabled = false, }) {
    const handleClick = (0, react_1.useCallback)((option) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (selection !== null) {
                (0, selection_1.$patchStyleText)(selection, {
                    [style]: option,
                });
            }
        });
    }, [editor, style]);
    const buttonAriaLabel = style === 'font-family' ? 'Formatting options for font family' : 'Formatting options for font size';
    return (React.createElement(DropDown_1.default, { disabled: disabled, buttonClassName: `toolbar-item ${style}`, buttonLabel: value, buttonIconClassName: style === 'font-family' ? 'icon block-type font-family' : '', buttonAriaLabel: buttonAriaLabel }, (style === 'font-family' ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => (React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(value === option)} ${style === 'font-size' ? 'fontsize-item' : ''}`, onClick: () => handleClick(option), key: option },
        React.createElement("span", { className: "text" }, text))))));
}
function ElementFormatDropdown({ editor, value, isRTL, disabled = false, }) {
    const formatOption = ELEMENT_FORMAT_OPTIONS[value || 'left'];
    return (React.createElement(DropDown_1.default, { disabled: disabled, buttonLabel: formatOption.name, buttonIconClassName: `icon ${isRTL ? formatOption.iconRTL : formatOption.icon}`, buttonClassName: "toolbar-item spaced alignment", buttonAriaLabel: "Formatting options for text alignment" },
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'left');
            }, className: "item" },
            React.createElement("i", { className: "icon left-align" }),
            React.createElement("span", { className: "text" }, "Left Align")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'center');
            }, className: "item" },
            React.createElement("i", { className: "icon center-align" }),
            React.createElement("span", { className: "text" }, "Center Align")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'right');
            }, className: "item" },
            React.createElement("i", { className: "icon right-align" }),
            React.createElement("span", { className: "text" }, "Right Align")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'justify');
            }, className: "item" },
            React.createElement("i", { className: "icon justify-align" }),
            React.createElement("span", { className: "text" }, "Justify Align")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'start');
            }, className: "item" },
            React.createElement("i", { className: `icon ${isRTL ? ELEMENT_FORMAT_OPTIONS.start.iconRTL : ELEMENT_FORMAT_OPTIONS.start.icon}` }),
            React.createElement("span", { className: "text" }, "Start Align")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, 'end');
            }, className: "item" },
            React.createElement("i", { className: `icon ${isRTL ? ELEMENT_FORMAT_OPTIONS.end.iconRTL : ELEMENT_FORMAT_OPTIONS.end.icon}` }),
            React.createElement("span", { className: "text" }, "End Align")),
        React.createElement(Divider, null),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.OUTDENT_CONTENT_COMMAND, undefined);
            }, className: "item" },
            React.createElement("i", { className: `icon ${isRTL ? 'indent' : 'outdent'}` }),
            React.createElement("span", { className: "text" }, "Outdent")),
        React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                editor.dispatchCommand(lexical_1.INDENT_CONTENT_COMMAND, undefined);
            }, className: "item" },
            React.createElement("i", { className: `icon ${isRTL ? 'outdent' : 'indent'}` }),
            React.createElement("span", { className: "text" }, "Indent"))));
}
const ToolbarPlugin = ({ setIsLinkEditMode }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [blockType, setBlockType] = (0, react_1.useState)('paragraph');
    const [rootType, setRootType] = (0, react_1.useState)('root');
    const [selectedElementKey, setSelectedElementKey] = (0, react_1.useState)(null);
    const [fontSize, setFontSize] = (0, react_1.useState)('15px');
    const [fontColor, setFontColor] = (0, react_1.useState)('#000');
    const [bgColor, setBgColor] = (0, react_1.useState)('#fff');
    const [fontFamily, setFontFamily] = (0, react_1.useState)('Arial');
    const [elementFormat, setElementFormat] = (0, react_1.useState)('left');
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    const [isBold, setIsBold] = (0, react_1.useState)(false);
    const [isItalic, setIsItalic] = (0, react_1.useState)(false);
    const [isUnderline, setIsUnderline] = (0, react_1.useState)(false);
    const [isStrikethrough, setIsStrikethrough] = (0, react_1.useState)(false);
    const [isSubscript, setIsSubscript] = (0, react_1.useState)(false);
    const [isSuperscript, setIsSuperscript] = (0, react_1.useState)(false);
    const [isCode, setIsCode] = (0, react_1.useState)(false);
    const [canUndo, setCanUndo] = (0, react_1.useState)(false);
    const [canRedo, setCanRedo] = (0, react_1.useState)(false);
    const [modal, showModal] = (0, useModal_1.useModal)();
    const [isRTL, setIsRTL] = (0, react_1.useState)(false);
    const [codeLanguage, setCodeLanguage] = (0, react_1.useState)('');
    const [isEditable, setIsEditable] = (0, react_1.useState)(() => editor.isEditable());
    const [isImageCaption, setIsImageCaption] = (0, react_1.useState)(false);
    const $updateToolbar = (0, react_1.useCallback)(() => {
        var _a;
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            if (activeEditor !== editor && (0, utils_1.$isEditorIsNestedEditor)(activeEditor)) {
                const rootElement = activeEditor.getRootElement();
                setIsImageCaption(!!((_a = rootElement === null || rootElement === void 0 ? void 0 : rootElement.parentElement) === null || _a === void 0 ? void 0 : _a.classList.contains('image-caption-container')));
            }
            else {
                setIsImageCaption(false);
            }
            const anchorNode = selection.anchor.getNode();
            let element = anchorNode.getKey() === 'root'
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
            setIsBold(selection.hasFormat('bold'));
            setIsItalic(selection.hasFormat('italic'));
            setIsUnderline(selection.hasFormat('underline'));
            setIsStrikethrough(selection.hasFormat('strikethrough'));
            setIsSubscript(selection.hasFormat('subscript'));
            setIsSuperscript(selection.hasFormat('superscript'));
            setIsCode(selection.hasFormat('code'));
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
                setRootType('table');
            }
            else {
                setRootType('root');
            }
            if (elementDOM !== null) {
                setSelectedElementKey(elementKey);
                if ((0, list_1.$isListNode)(element)) {
                    const parentList = (0, utils_1.$getNearestNodeOfType)(anchorNode, list_1.ListNode);
                    const type = parentList ? parentList.getListType() : element.getListType();
                    setBlockType(type);
                }
                else {
                    const type = (0, rich_text_1.$isHeadingNode)(element) ? element.getTag() : element.getType();
                    if (type in blockTypeToBlockName) {
                        setBlockType(type);
                    }
                    if ((0, code_1.$isCodeNode)(element)) {
                        const language = element.getLanguage();
                        setCodeLanguage(language ? code_1.CODE_LANGUAGE_MAP[language] || language : '');
                        return;
                    }
                }
            }
            // Handle buttons
            setFontColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'color', '#000'));
            setBgColor((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'background-color', '#fff'));
            setFontFamily((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'font-family', 'Arial'));
            let matchingParent;
            if ((0, link_1.$isLinkNode)(parent)) {
                // If node is a link, we need to fetch the parent paragraph node to set format
                matchingParent = (0, utils_1.$findMatchingParent)(node, (parentNode) => (0, lexical_1.$isElementNode)(parentNode) && !parentNode.isInline());
            }
            // If matchingParent is a valid node, pass it's format type
            setElementFormat((0, lexical_1.$isElementNode)(matchingParent)
                ? matchingParent.getFormatType()
                : (0, lexical_1.$isElementNode)(node)
                    ? node.getFormatType()
                    : (parent === null || parent === void 0 ? void 0 : parent.getFormatType()) || 'left');
        }
        if ((0, lexical_1.$isRangeSelection)(selection) || (0, table_1.$isTableSelection)(selection)) {
            setFontSize((0, selection_1.$getSelectionStyleValueForProperty)(selection, 'font-size', '15px'));
        }
    }, [activeEditor, editor]);
    (0, react_1.useEffect)(() => editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
        setActiveEditor(newEditor);
        $updateToolbar();
        return false;
    }, lexical_1.COMMAND_PRIORITY_CRITICAL), [editor, $updateToolbar]);
    (0, react_1.useEffect)(() => {
        activeEditor.getEditorState().read(() => {
            $updateToolbar();
        });
    }, [activeEditor, $updateToolbar]);
    (0, react_1.useEffect)(() => (0, utils_1.mergeRegister)(editor.registerEditableListener((editable) => {
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
    }, lexical_1.COMMAND_PRIORITY_CRITICAL)), [$updateToolbar, activeEditor, editor]);
    (0, react_1.useEffect)(() => activeEditor.registerCommand(lexical_1.KEY_MODIFIER_COMMAND, (payload) => {
        const event = payload;
        const { code, ctrlKey, metaKey } = event;
        if (code === 'KeyK' && (ctrlKey || metaKey)) {
            event.preventDefault();
            let url;
            if (!isLink) {
                setIsLinkEditMode(true);
                url = (0, url_1.sanitizeUrl)('https://');
            }
            else {
                setIsLinkEditMode(false);
                url = null;
            }
            return activeEditor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, url);
        }
        return false;
    }, lexical_1.COMMAND_PRIORITY_NORMAL), [activeEditor, isLink, setIsLinkEditMode]);
    const applyStyleText = (0, react_1.useCallback)((styles, skipHistoryStack) => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (selection !== null) {
                (0, selection_1.$patchStyleText)(selection, styles);
            }
        }, skipHistoryStack ? { tag: 'historic' } : {});
    }, [activeEditor]);
    const clearFormatting = (0, react_1.useCallback)(() => {
        activeEditor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection) || (0, table_1.$isTableSelection)(selection)) {
                const anchor = selection.anchor;
                const focus = selection.focus;
                const nodes = selection.getNodes();
                const extractedNodes = selection.extract();
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
                        /**
                         * If the selected text has one format applied
                         * selecting a portion of the text, could
                         * clear the format to the wrong portion of the text.
                         *
                         * The cleared text is based on the length of the selected text.
                         */
                        // We need this in case the selected text only has one format
                        const extractedTextNode = extractedNodes[0];
                        if (nodes.length === 1 && (0, lexical_1.$isTextNode)(extractedTextNode)) {
                            textNode = extractedTextNode;
                        }
                        if (textNode.__style !== '') {
                            textNode.setStyle('');
                        }
                        if (textNode.__format !== 0) {
                            textNode.setFormat(0);
                            (0, utils_1.$getNearestBlockElementAncestorOrThrow)(textNode).setFormat('');
                        }
                        // eslint-disable-next-line no-param-reassign
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
    const onFontColorSelect = (0, react_1.useCallback)((value, skipHistoryStack) => {
        applyStyleText({ color: value }, skipHistoryStack);
    }, [applyStyleText]);
    const onBgColorSelect = (0, react_1.useCallback)((value, skipHistoryStack) => {
        applyStyleText({ 'background-color': value }, skipHistoryStack);
    }, [applyStyleText]);
    const insertLink = (0, react_1.useCallback)(() => {
        if (!isLink) {
            setIsLinkEditMode(true);
            activeEditor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, (0, url_1.sanitizeUrl)('https://'));
        }
        else {
            setIsLinkEditMode(false);
            activeEditor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, null);
        }
    }, [activeEditor, isLink, setIsLinkEditMode]);
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
    const insertGifOnClick = (payload) => {
        activeEditor.dispatchCommand(ImagesPlugin_1.INSERT_IMAGE_COMMAND, payload);
    };
    const canViewerSeeInsertDropdown = !isImageCaption;
    const canViewerSeeInsertCodeButton = !isImageCaption;
    return (React.createElement("div", { className: "toolbar" },
        React.createElement("button", { disabled: !canUndo || !isEditable, onClick: () => {
                activeEditor.dispatchCommand(lexical_1.UNDO_COMMAND, undefined);
            }, title: environment_1.IS_APPLE ? 'Undo (⌘Z)' : 'Undo (Ctrl+Z)', type: "button", className: "toolbar-item spaced", "aria-label": "Undo" },
            React.createElement("i", { className: "format undo" })),
        React.createElement("button", { disabled: !canRedo || !isEditable, onClick: () => {
                activeEditor.dispatchCommand(lexical_1.REDO_COMMAND, undefined);
            }, title: environment_1.IS_APPLE ? 'Redo (⇧⌘Z)' : 'Redo (Ctrl+Y)', type: "button", className: "toolbar-item", "aria-label": "Redo" },
            React.createElement("i", { className: "format redo" })),
        React.createElement(Divider, null),
        blockType in blockTypeToBlockName && activeEditor === editor && (React.createElement(React.Fragment, null,
            React.createElement(BlockFormatDropDown, { disabled: !isEditable, blockType: blockType, rootType: rootType, editor: activeEditor }),
            React.createElement(Divider, null))),
        blockType === 'code' ? (React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item code-language", buttonLabel: (0, code_1.getLanguageFriendlyName)(codeLanguage), buttonAriaLabel: "Select language" }, CODE_LANGUAGE_OPTIONS.map(([value, name]) => (React.createElement(DropDown_1.DropDownItem, { className: `item ${dropDownActiveClass(value === codeLanguage)}`, onClick: () => onCodeLanguageSelect(value), key: value },
            React.createElement("span", { className: "text" }, name)))))) : (React.createElement(React.Fragment, null,
            React.createElement(FontDropDown, { disabled: !isEditable, style: 'font-family', value: fontFamily, editor: activeEditor }),
            React.createElement(Divider, null),
            React.createElement(fontSize_1.FontSize, { selectionFontSize: fontSize.slice(0, -2), editor: activeEditor, disabled: !isEditable }),
            React.createElement(Divider, null),
            React.createElement("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'bold');
                }, className: `toolbar-item spaced ${isBold ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Bold (⌘B)' : 'Bold (Ctrl+B)', type: "button", "aria-label": `Format text as bold. Shortcut: ${environment_1.IS_APPLE ? '⌘B' : 'Ctrl+B'}` },
                React.createElement("i", { className: "format bold" })),
            React.createElement("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'italic');
                }, className: `toolbar-item spaced ${isItalic ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Italic (⌘I)' : 'Italic (Ctrl+I)', type: "button", "aria-label": `Format text as italics. Shortcut: ${environment_1.IS_APPLE ? '⌘I' : 'Ctrl+I'}` },
                React.createElement("i", { className: "format italic" })),
            React.createElement("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'underline');
                }, className: `toolbar-item spaced ${isUnderline ? 'active' : ''}`, title: environment_1.IS_APPLE ? 'Underline (⌘U)' : 'Underline (Ctrl+U)', type: "button", "aria-label": `Format text to underlined. Shortcut: ${environment_1.IS_APPLE ? '⌘U' : 'Ctrl+U'}` },
                React.createElement("i", { className: "format underline" })),
            canViewerSeeInsertCodeButton && (React.createElement("button", { disabled: !isEditable, onClick: () => {
                    activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'code');
                }, className: `toolbar-item spaced ${isCode ? 'active' : ''}`, title: "Insert code block", type: "button", "aria-label": "Insert code block" },
                React.createElement("i", { className: "format code" }))),
            React.createElement("button", { disabled: !isEditable, onClick: insertLink, className: `toolbar-item spaced ${isLink ? 'active' : ''}`, "aria-label": "Insert link", title: "Insert link", type: "button" },
                React.createElement("i", { className: "format link" })),
            React.createElement(DropdownColorPicker_1.DropdownColorPicker, { disabled: !isEditable, buttonClassName: "toolbar-item color-picker", buttonAriaLabel: "Formatting text color", buttonIconClassName: "icon font-color", color: fontColor, onChange: onFontColorSelect, title: "text color" }),
            React.createElement(DropdownColorPicker_1.DropdownColorPicker, { disabled: !isEditable, buttonClassName: "toolbar-item color-picker", buttonAriaLabel: "Formatting background color", buttonIconClassName: "icon bg-color", color: bgColor, onChange: onBgColorSelect, title: "bg color" }),
            React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item spaced", buttonLabel: "", buttonAriaLabel: "Formatting options for additional text styles", buttonIconClassName: "icon dropdown-more" },
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'strikethrough');
                    }, className: `item ${dropDownActiveClass(isStrikethrough)}`, title: "Strikethrough", "aria-label": "Format text with a strikethrough" },
                    React.createElement("i", { className: "icon strikethrough" }),
                    React.createElement("span", { className: "text" }, "Strikethrough")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'subscript');
                    }, className: `item ${dropDownActiveClass(isSubscript)}`, title: "Subscript", "aria-label": "Format text with a subscript" },
                    React.createElement("i", { className: "icon subscript" }),
                    React.createElement("span", { className: "text" }, "Subscript")),
                React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                        activeEditor.dispatchCommand(lexical_1.FORMAT_TEXT_COMMAND, 'superscript');
                    }, className: `item ${dropDownActiveClass(isSuperscript)}`, title: "Superscript", "aria-label": "Format text with a superscript" },
                    React.createElement("i", { className: "icon superscript" }),
                    React.createElement("span", { className: "text" }, "Superscript")),
                React.createElement(DropDown_1.DropDownItem, { onClick: clearFormatting, className: "item", title: "Clear text formatting", "aria-label": "Clear all text formatting" },
                    React.createElement("i", { className: "icon clear" }),
                    React.createElement("span", { className: "text" }, "Clear Formatting"))),
            canViewerSeeInsertDropdown && (React.createElement(React.Fragment, null,
                React.createElement(Divider, null),
                React.createElement(DropDown_1.default, { disabled: !isEditable, buttonClassName: "toolbar-item spaced", buttonLabel: "Insert", buttonAriaLabel: "Insert specialized editor node", buttonIconClassName: "icon plus" },
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            activeEditor.dispatchCommand(LexicalHorizontalRuleNode_1.INSERT_HORIZONTAL_RULE_COMMAND, undefined);
                        }, className: "item" },
                        React.createElement("i", { className: "icon horizontal-rule" }),
                        React.createElement("span", { className: "text" }, "Horizontal Rule")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            activeEditor.dispatchCommand(PageBreakPlugin_1.INSERT_PAGE_BREAK, undefined);
                        }, className: "item" },
                        React.createElement("i", { className: "icon page-break" }),
                        React.createElement("span", { className: "text" }, "Page Break")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            showModal('Insert Image', (onClose) => (React.createElement(ImagesPlugin_1.InsertImageDialog, { activeEditor: activeEditor, onClose: onClose })));
                        }, className: "item" },
                        React.createElement("i", { className: "icon image" }),
                        React.createElement("span", { className: "text" }, "Image")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            showModal('Insert Inline Image', (onClose) => (React.createElement(InlineImagePlugin_1.InsertInlineImageDialog, { activeEditor: activeEditor, onClose: onClose })));
                        }, className: "item" },
                        React.createElement("i", { className: "icon image" }),
                        React.createElement("span", { className: "text" }, "Inline Image")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => insertGifOnClick({
                            altText: 'Cat typing on a laptop',
                            // src: catTypingGif,
                            src: ''
                        }), className: "item" },
                        React.createElement("i", { className: "icon gif" }),
                        React.createElement("span", { className: "text" }, "GIF")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            showModal('Insert Poll', (onClose) => (React.createElement(PollPlugin_1.InsertPollDialog, { activeEditor: activeEditor, onClose: onClose })));
                        }, className: "item" },
                        React.createElement("i", { className: "icon poll" }),
                        React.createElement("span", { className: "text" }, "Poll")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            showModal('Insert Columns Layout', (onClose) => (React.createElement(InsertLayoutDialog_1.InsertLayoutDialog, { activeEditor: activeEditor, onClose: onClose })));
                        }, className: "item" },
                        React.createElement("i", { className: "icon columns" }),
                        React.createElement("span", { className: "text" }, "Columns Layout")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            showModal('Insert Equation', (onClose) => (React.createElement(EquationsPlugin_1.InsertEquationDialog, { activeEditor: activeEditor, onClose: onClose })));
                        }, className: "item" },
                        React.createElement("i", { className: "icon equation" }),
                        React.createElement("span", { className: "text" }, "Equation")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            editor.update(() => {
                                const root = (0, lexical_1.$getRoot)();
                                const stickyNode = (0, StickyNode_1.$createStickyNode)(0, 0);
                                root.append(stickyNode);
                            });
                        }, className: "item" },
                        React.createElement("i", { className: "icon sticky" }),
                        React.createElement("span", { className: "text" }, "Sticky Note")),
                    React.createElement(DropDown_1.DropDownItem, { onClick: () => {
                            editor.dispatchCommand(CollapsiblePlugin_1.INSERT_COLLAPSIBLE_COMMAND, undefined);
                        }, className: "item" },
                        React.createElement("i", { className: "icon caret-right" }),
                        React.createElement("span", { className: "text" }, "Collapsible container")),
                    AutoEmbedPlugin_1.EmbedConfigs.map((embedConfig) => (React.createElement(DropDown_1.DropDownItem, { key: embedConfig.type, onClick: () => {
                            activeEditor.dispatchCommand(LexicalAutoEmbedPlugin_1.INSERT_EMBED_COMMAND, embedConfig.type);
                        }, className: "item" },
                        embedConfig.icon,
                        React.createElement("span", { className: "text" }, embedConfig.contentName))))))))),
        React.createElement(Divider, null),
        React.createElement(ElementFormatDropdown, { disabled: !isEditable, value: elementFormat, editor: activeEditor, isRTL: isRTL }),
        modal));
};
exports.ToolbarPlugin = ToolbarPlugin;
