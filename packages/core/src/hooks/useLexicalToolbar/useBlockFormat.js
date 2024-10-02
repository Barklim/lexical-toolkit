"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBlockFormat = void 0;
const code_1 = require("@lexical/code");
const list_1 = require("@lexical/list");
const rich_text_1 = require("@lexical/rich-text");
const selection_1 = require("@lexical/selection");
const lexical_1 = require("lexical");
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
const useBlockFormat = (params) => {
    const { blockType, editor } = params;
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
        if (blockType !== "bullet") {
            editor.dispatchCommand(list_1.INSERT_UNORDERED_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatCheckList = () => {
        if (blockType !== "check") {
            editor.dispatchCommand(list_1.INSERT_CHECK_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatNumberedList = () => {
        if (blockType !== "number") {
            editor.dispatchCommand(list_1.INSERT_ORDERED_LIST_COMMAND, undefined);
        }
        else {
            editor.dispatchCommand(list_1.REMOVE_LIST_COMMAND, undefined);
        }
    };
    const formatQuote = () => {
        if (blockType !== "quote") {
            editor.update(() => {
                const selection = (0, lexical_1.$getSelection)();
                (0, selection_1.$setBlocksType)(selection, () => (0, rich_text_1.$createQuoteNode)());
            });
        }
    };
    const formatCode = () => {
        if (blockType !== "code") {
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
    return {
        label: blockTypeToBlockName[blockType],
        paragraph: {
            title: "Normal",
            active: blockType === "paragraph",
            dispatch: () => formatParagraph(),
        },
        h1: {
            title: "Heading 1",
            active: blockType === "h1",
            dispatch: () => formatHeading("h1"),
        },
        h2: {
            title: "Heading 2",
            active: blockType === "h2",
            dispatch: () => formatHeading("h2"),
        },
        h3: {
            title: "Heading 3",
            active: blockType === "h3",
            dispatch: () => formatHeading("h3"),
        },
        h4: {
            title: "Heading 4",
            active: blockType === "h4",
            dispatch: () => formatHeading("h4"),
        },
        h5: {
            title: "Heading 5",
            active: blockType === "h5",
            dispatch: () => formatHeading("h5"),
        },
        h6: {
            title: "Heading 6",
            active: blockType === "h6",
            dispatch: () => formatHeading("h6"),
        },
        bulletList: {
            title: "Bullet List",
            active: blockType === "bullet",
            dispatch: () => formatBulletList(),
        },
        checkList: {
            title: "Check List",
            active: blockType === "check",
            dispatch: () => formatCheckList(),
        },
        numberList: {
            title: "Numbered List",
            active: blockType === "number",
            dispatch: () => formatNumberedList(),
        },
        quote: {
            title: "Quote",
            active: blockType === "quote",
            dispatch: () => formatQuote(),
        },
        code: {
            title: "Code Block",
            active: blockType === "code",
            dispatch: () => formatCode(),
        },
    };
};
exports.useBlockFormat = useBlockFormat;
