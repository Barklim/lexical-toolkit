"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollapsiblePlugin = exports.TOGGLE_COLLAPSIBLE_COMMAND = exports.INSERT_COLLAPSIBLE_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const CollapsibleContainerNode_1 = require("./CollapsibleContainerNode");
const CollapsibleContentNode_1 = require("./CollapsibleContentNode");
const CollapsibleTitleNode_1 = require("./CollapsibleTitleNode");
// import './Collapsible.css';
exports.INSERT_COLLAPSIBLE_COMMAND = (0, lexical_1.createCommand)();
exports.TOGGLE_COLLAPSIBLE_COMMAND = (0, lexical_1.createCommand)();
const CollapsiblePlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([CollapsibleContainerNode_1.CollapsibleContainerNode, CollapsibleTitleNode_1.CollapsibleTitleNode, CollapsibleContentNode_1.CollapsibleContentNode])) {
            throw new Error('CollapsiblePlugin: CollapsibleContainerNode, CollapsibleTitleNode, or CollapsibleContentNode not registered on editor');
        }
        const $onEscapeUp = () => {
            var _a;
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection) && selection.isCollapsed() && selection.anchor.offset === 0) {
                const container = (0, utils_1.$findMatchingParent)(selection.anchor.getNode(), CollapsibleContainerNode_1.$isCollapsibleContainerNode);
                if ((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container)) {
                    const parent = container.getParent();
                    if (parent !== null &&
                        parent.getFirstChild() === container &&
                        selection.anchor.key === ((_a = container.getFirstDescendant()) === null || _a === void 0 ? void 0 : _a.getKey())) {
                        container.insertBefore((0, lexical_1.$createParagraphNode)());
                    }
                }
            }
            return false;
        };
        const $onEscapeDown = () => {
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection) && selection.isCollapsed()) {
                const container = (0, utils_1.$findMatchingParent)(selection.anchor.getNode(), CollapsibleContainerNode_1.$isCollapsibleContainerNode);
                if ((0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container)) {
                    const parent = container.getParent();
                    if (parent !== null && parent.getLastChild() === container) {
                        const titleParagraph = container.getFirstDescendant();
                        const contentParagraph = container.getLastDescendant();
                        if ((contentParagraph !== null &&
                            selection.anchor.key === contentParagraph.getKey() &&
                            selection.anchor.offset === contentParagraph.getTextContentSize()) ||
                            (titleParagraph !== null &&
                                selection.anchor.key === titleParagraph.getKey() &&
                                selection.anchor.offset === titleParagraph.getTextContentSize())) {
                            container.insertAfter((0, lexical_1.$createParagraphNode)());
                        }
                    }
                }
            }
            return false;
        };
        return (0, utils_1.mergeRegister)(
        // Structure enforcing transformers for each node type. In case nesting structure is not
        // "Container > Title + Content" it'll unwrap nodes and convert it back
        // to regular content.
        editor.registerNodeTransform(CollapsibleContentNode_1.CollapsibleContentNode, (node) => {
            const parent = node.getParent();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(parent)) {
                const children = node.getChildren();
                for (const child of children) {
                    node.insertBefore(child);
                }
                node.remove();
            }
        }), editor.registerNodeTransform(CollapsibleTitleNode_1.CollapsibleTitleNode, (node) => {
            const parent = node.getParent();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(parent)) {
                node.replace((0, lexical_1.$createParagraphNode)().append(...node.getChildren()));
                return;
            }
        }), editor.registerNodeTransform(CollapsibleContainerNode_1.CollapsibleContainerNode, (node) => {
            const children = node.getChildren();
            if (children.length !== 2 || !(0, CollapsibleTitleNode_1.$isCollapsibleTitleNode)(children[0]) || !(0, CollapsibleContentNode_1.$isCollapsibleContentNode)(children[1])) {
                for (const child of children) {
                    node.insertBefore(child);
                }
                node.remove();
            }
        }), 
        // This handles the case when container is collapsed and we delete its previous sibling
        // into it, it would cause collapsed content deleted (since it's display: none, and selection
        // swallows it when deletes single char). Instead we expand container, which is although
        // not perfect, but avoids bigger problem
        editor.registerCommand(lexical_1.DELETE_CHARACTER_COMMAND, () => {
            const selection = (0, lexical_1.$getSelection)();
            if (!(0, lexical_1.$isRangeSelection)(selection) || !selection.isCollapsed() || selection.anchor.offset !== 0) {
                return false;
            }
            const anchorNode = selection.anchor.getNode();
            const topLevelElement = anchorNode.getTopLevelElement();
            if (topLevelElement === null) {
                return false;
            }
            const container = topLevelElement.getPreviousSibling();
            if (!(0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container) || container.getOpen()) {
                return false;
            }
            container.setOpen(true);
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW), 
        // When collapsible is the last child pressing down/right arrow will insert paragraph
        // below it to allow adding more content. It's similar what $insertBlockNode
        // (mainly for decorators), except it'll always be possible to continue adding
        // new content even if trailing paragraph is accidentally deleted
        editor.registerCommand(lexical_1.KEY_ARROW_DOWN_COMMAND, $onEscapeDown, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_RIGHT_COMMAND, $onEscapeDown, lexical_1.COMMAND_PRIORITY_LOW), 
        // When collapsible is the first child pressing up/left arrow will insert paragraph
        // above it to allow adding more content. It's similar what $insertBlockNode
        // (mainly for decorators), except it'll always be possible to continue adding
        // new content even if leading paragraph is accidentally deleted
        editor.registerCommand(lexical_1.KEY_ARROW_UP_COMMAND, $onEscapeUp, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_ARROW_LEFT_COMMAND, $onEscapeUp, lexical_1.COMMAND_PRIORITY_LOW), 
        // Enter goes from Title to Content rather than a new line inside Title
        editor.registerCommand(lexical_1.INSERT_PARAGRAPH_COMMAND, () => {
            var _a;
            const selection = (0, lexical_1.$getSelection)();
            if ((0, lexical_1.$isRangeSelection)(selection)) {
                const titleNode = (0, utils_1.$findMatchingParent)(selection.anchor.getNode(), (node) => (0, CollapsibleTitleNode_1.$isCollapsibleTitleNode)(node));
                if ((0, CollapsibleTitleNode_1.$isCollapsibleTitleNode)(titleNode)) {
                    const container = titleNode.getParent();
                    if (container && (0, CollapsibleContainerNode_1.$isCollapsibleContainerNode)(container)) {
                        if (!container.getOpen()) {
                            container.toggleOpen();
                        }
                        (_a = titleNode.getNextSibling()) === null || _a === void 0 ? void 0 : _a.selectEnd();
                        return true;
                    }
                }
            }
            return false;
        }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(exports.INSERT_COLLAPSIBLE_COMMAND, () => {
            editor.update(() => {
                const title = (0, CollapsibleTitleNode_1.$createCollapsibleTitleNode)();
                const paragraph = (0, lexical_1.$createParagraphNode)();
                (0, utils_1.$insertNodeToNearestRoot)((0, CollapsibleContainerNode_1.$createCollapsibleContainerNode)(true).append(title.append(paragraph), (0, CollapsibleContentNode_1.$createCollapsibleContentNode)().append((0, lexical_1.$createParagraphNode)())));
                paragraph.select();
            });
            return true;
        }, lexical_1.COMMAND_PRIORITY_LOW));
    }, [editor]);
    return null;
};
exports.CollapsiblePlugin = CollapsiblePlugin;
