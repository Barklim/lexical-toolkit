"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useHyperlinkEditor = void 0;
const link_1 = require("@lexical/link");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const getSelectedNode_1 = require("../../utils/getSelectedNode");
const useInteractionManager_1 = require("./useInteractionManager");
function useHyperlinkEditor(params) {
    const { editor, anchorElem, canEditAutoLinks = true } = params;
    const [activeEditor, setActiveEditor] = (0, react_1.useState)(editor);
    const [isLink, setIsLink] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        function updateToolbar() {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const node = (0, getSelectedNode_1.getSelectedNode)(selection);
                const linkParent = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
                const autoLinkParent = (0, utils_1.$findMatchingParent)(node, link_1.$isAutoLinkNode);
                const parentIsLink = canEditAutoLinks
                    ? linkParent !== null || autoLinkParent !== null
                    : linkParent !== null && autoLinkParent === null;
                setIsLink(parentIsLink);
            }
        }
        return (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
            editorState.read(() => {
                updateToolbar();
            });
        }), editor.registerCommand(lexical_1.SELECTION_CHANGE_COMMAND, (_payload, newEditor) => {
            updateToolbar();
            setActiveEditor(newEditor);
            return false;
        }, lexical_1.COMMAND_PRIORITY_CRITICAL), editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const node = (0, getSelectedNode_1.getSelectedNode)(selection);
                const linkNode = (0, utils_1.$findMatchingParent)(node, link_1.$isLinkNode);
                if ((0, link_1.$isLinkNode)(linkNode) && (payload.metaKey || payload.ctrlKey)) {
                    window.open(linkNode.getURL(), "_blank");
                    return true;
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor]);
    return (0, useInteractionManager_1.useInteractionManager)({
        editor: activeEditor,
        isLink,
        anchorElem,
        setIsLink,
    });
}
exports.useHyperlinkEditor = useHyperlinkEditor;
