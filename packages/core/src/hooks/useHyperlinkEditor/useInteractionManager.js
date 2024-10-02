"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInteractionManager = void 0;
const link_1 = require("@lexical/link");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
function useInteractionManager(params) {
    const { editor, isLink, anchorElem, setIsLink } = params;
    const [linkUrl, setLinkUrl] = (0, react_1.useState)("");
    const [linkRect, setLinkRect] = (0, react_1.useState)();
    const [lastSelection, setLastSelection] = (0, react_1.useState)(null);
    const updateLinkEditor = (0, react_1.useCallback)(() => {
        var _a, _b;
        const selection = (0, lexical_1.$getSelection)();
        if ((0, lexical_1.$isRangeSelection)(selection)) {
            const node = (0, getSelectedNode_1.getSelectedNode)(selection);
            const linkParent = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
            if (linkParent) {
                setLinkUrl(linkParent.getURL());
            }
            else if ((0, link_1.$isLinkNode)(node)) {
                setLinkUrl(node.getURL());
            }
            else {
                setLinkUrl("");
            }
        }
        const nativeSelection = window.getSelection();
        const activeElement = document.activeElement;
        const rootElement = editor.getRootElement();
        if (selection !== null &&
            nativeSelection !== null &&
            rootElement !== null &&
            rootElement.contains(nativeSelection.anchorNode) &&
            editor.isEditable()) {
            const domRect = (_b = (_a = nativeSelection.focusNode) === null || _a === void 0 ? void 0 : _a.parentElement) === null || _b === void 0 ? void 0 : _b.getBoundingClientRect();
            if (domRect) {
                setLinkRect(domRect);
            }
            setLastSelection(selection);
        }
        else if (!activeElement) {
            if (rootElement !== null) {
                setLinkRect(undefined);
            }
            setLastSelection(null);
            setLinkUrl("");
        }
        return true;
    }, [anchorElem, editor]);
    (0, react_1.useEffect)(() => {
        const scrollerElem = anchorElem.parentElement;
        const update = () => {
            editor.getEditorState().read(() => {
                updateLinkEditor();
            });
        };
        window.addEventListener("resize", update);
        if (scrollerElem) {
            scrollerElem.addEventListener("scroll", update);
        }
        return () => {
            window.removeEventListener("resize", update);
            if (scrollerElem) {
                scrollerElem.removeEventListener("scroll", update);
            }
        };
    }, [anchorElem.parentElement, editor, updateLinkEditor]);
    (0, react_1.useEffect)(() => {
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateLinkEditor();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, () => {
            updateLinkEditor();
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ESCAPE_COMMAND, () => {
            if (isLink) {
                setIsLink(false);
                return true;
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_HIGH));
    }, [editor, updateLinkEditor, setIsLink, isLink]);
    (0, react_1.useEffect)(() => {
        editor.getEditorState().read(() => {
            updateLinkEditor();
        });
    }, [editor, updateLinkEditor]);
    return {
        currentNodeIsLink: isLink,
        linkNodeRect: linkRect,
        linkUrl: linkUrl,
        dispatchLinkSubmission: ({ url }) => {
            if (lastSelection !== null) {
                editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, url);
            }
        },
        dispatchLinkRemoval: () => {
            editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, null);
        },
    };
}
exports.useInteractionManager = useInteractionManager;
