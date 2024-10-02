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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContextMenuPlugin = exports.ContextMenuOption = void 0;
const link_1 = require("@lexical/link");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const LexicalContextMenuPlugin_1 = require("@lexical/react/LexicalContextMenuPlugin");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const ReactDOM = __importStar(require("react-dom"));
function ContextMenuItem({ index, isSelected, onClick, onMouseEnter, option, }) {
    let className = 'item';
    if (isSelected) {
        className += ' selected';
    }
    return (React.createElement("li", { key: option.key, tabIndex: -1, className: className, ref: option.setRefElement, role: "option", "aria-selected": isSelected, id: `typeahead-item-${index}`, onMouseEnter: onMouseEnter, onClick: onClick },
        React.createElement("span", { className: "text" }, option.title)));
}
function ContextMenu({ options, selectedItemIndex, onOptionClick, onOptionMouseEnter, }) {
    return (React.createElement("div", { className: "typeahead-popover" },
        React.createElement("ul", null, options.map((option, i) => (React.createElement(ContextMenuItem, { index: i, isSelected: selectedItemIndex === i, onClick: () => onOptionClick(option, i), onMouseEnter: () => onOptionMouseEnter(i), key: option.key, option: option }))))));
}
class ContextMenuOption extends LexicalContextMenuPlugin_1.MenuOption {
    constructor(title, options) {
        super(title);
        this.title = title;
        this.onSelect = options.onSelect.bind(this);
    }
}
exports.ContextMenuOption = ContextMenuOption;
const ContextMenuPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const defaultOptions = (0, react_1.useMemo)(() => [
        new ContextMenuOption(`Copy`, {
            onSelect: (_node) => {
                editor.dispatchCommand(lexical_1.COPY_COMMAND, null);
            },
        }),
        new ContextMenuOption(`Cut`, {
            onSelect: (_node) => {
                editor.dispatchCommand(lexical_1.CUT_COMMAND, null);
            },
        }),
        new ContextMenuOption(`Paste`, {
            onSelect: (_node) => {
                navigator.clipboard.read().then(function (...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const data = new DataTransfer();
                        const items = yield navigator.clipboard.read();
                        const item = items[0];
                        const permission = yield navigator.permissions.query({
                            name: 'clipboard-read',
                        });
                        if (permission.state === 'denied') {
                            alert('Not allowed to paste from clipboard.');
                            return;
                        }
                        for (const type of item.types) {
                            const dataString = yield (yield item.getType(type)).text();
                            data.setData(type, dataString);
                        }
                        const event = new ClipboardEvent('paste', {
                            clipboardData: data,
                        });
                        editor.dispatchCommand(lexical_1.PASTE_COMMAND, event);
                    });
                });
            },
        }),
        new ContextMenuOption(`Paste as Plain Text`, {
            onSelect: (_node) => {
                navigator.clipboard.read().then(function (...args) {
                    return __awaiter(this, void 0, void 0, function* () {
                        const permission = yield navigator.permissions.query({
                            name: 'clipboard-read',
                        });
                        if (permission.state === 'denied') {
                            alert('Not allowed to paste from clipboard.');
                            return;
                        }
                        const data = new DataTransfer();
                        const items = yield navigator.clipboard.readText();
                        data.setData('text/plain', items);
                        const event = new ClipboardEvent('paste', {
                            clipboardData: data,
                        });
                        editor.dispatchCommand(lexical_1.PASTE_COMMAND, event);
                    });
                });
            },
        }),
        new ContextMenuOption(`Delete Node`, {
            onSelect: (_node) => {
                const selection = (0, lexical_1.$getSelection)();
                if ((0, lexical_1.$isRangeSelection)(selection)) {
                    const currentNode = selection.anchor.getNode();
                    const ancestorNodeWithRootAsParent = currentNode.getParents().at(-2);
                    ancestorNodeWithRootAsParent === null || ancestorNodeWithRootAsParent === void 0 ? void 0 : ancestorNodeWithRootAsParent.remove();
                }
            },
        }),
    ], [editor]);
    const [options, setOptions] = React.useState(defaultOptions);
    const onSelectOption = (0, react_1.useCallback)((selectedOption, targetNode, closeMenu) => {
        editor.update(() => {
            selectedOption.onSelect(targetNode);
            closeMenu();
        });
    }, [editor]);
    const onWillOpen = (event) => {
        let newOptions = defaultOptions;
        editor.update(() => {
            const node = (0, lexical_1.$getNearestNodeFromDOMNode)(event.target);
            if (node) {
                const parent = node.getParent();
                if ((0, link_1.$isLinkNode)(parent)) {
                    newOptions = [
                        new ContextMenuOption(`Remove Link`, {
                            onSelect: (_node) => {
                                editor.dispatchCommand(link_1.TOGGLE_LINK_COMMAND, null);
                            },
                        }),
                        ...defaultOptions,
                    ];
                }
            }
        });
        setOptions(newOptions);
    };
    return (React.createElement(LexicalContextMenuPlugin_1.LexicalContextMenuPlugin, { options: options, onSelectOption: onSelectOption, onWillOpen: onWillOpen, menuRenderFn: (anchorElementRef, { selectedIndex, options: _options, selectOptionAndCleanUp, setHighlightedIndex }, { setMenuRef }) => anchorElementRef.current
            ? ReactDOM.createPortal(React.createElement("div", { className: "typeahead-popover auto-embed-menu", style: {
                    marginLeft: anchorElementRef.current.style.width,
                    userSelect: 'none',
                    width: 200,
                }, ref: setMenuRef },
                React.createElement(ContextMenu, { options: options, selectedItemIndex: selectedIndex, onOptionClick: (option, index) => {
                        setHighlightedIndex(index);
                        selectOptionAndCleanUp(option);
                    }, onOptionMouseEnter: (index) => {
                        setHighlightedIndex(index);
                    } })), anchorElementRef.current)
            : null }));
};
exports.ContextMenuPlugin = ContextMenuPlugin;
