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
const LexicalCollaborationContext_1 = require("@lexical/react/LexicalCollaborationContext");
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const useLexicalNodeSelection_1 = require("@lexical/react/useLexicalNodeSelection");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const Button_1 = require("../../ui/Button");
const joinClasses_1 = require("../../utils/joinClasses");
// eslint-disable-next-line import/no-cycle
const index_1 = require("./index");
// import './PollNode.css';
function getTotalVotes(options) {
    return options.reduce((totalVotes, next) => totalVotes + next.votes.length, 0);
}
function PollOptionComponent({ option, index, options, totalVotes, withPollNode, }) {
    const { clientID } = (0, LexicalCollaborationContext_1.useCollaborationContext)();
    const checkboxRef = (0, react_1.useRef)(null);
    const votesArray = option.votes;
    const checkedIndex = votesArray.indexOf(clientID);
    const checked = checkedIndex !== -1;
    const votes = votesArray.length;
    const text = option.text;
    return (React.createElement("div", { className: "PollNode__optionContainer" },
        React.createElement("div", { className: (0, joinClasses_1.joinClasses)('PollNode__optionCheckboxWrapper', checked && 'PollNode__optionCheckboxChecked') },
            React.createElement("input", { ref: checkboxRef, className: "PollNode__optionCheckbox", type: "checkbox", onChange: (e) => {
                    withPollNode((node) => {
                        node.toggleVote(option, clientID);
                    });
                }, checked: checked })),
        React.createElement("div", { className: "PollNode__optionInputWrapper" },
            React.createElement("div", { className: "PollNode__optionInputVotes", style: { width: `${votes === 0 ? 0 : (votes / totalVotes) * 100}%` } }),
            React.createElement("span", { className: "PollNode__optionInputVotesCount" }, votes > 0 && (votes === 1 ? '1 vote' : `${votes} votes`)),
            React.createElement("input", { className: "PollNode__optionInput", type: "text", value: text, onChange: (e) => {
                    const target = e.target;
                    const value = target.value;
                    const selectionStart = target.selectionStart;
                    const selectionEnd = target.selectionEnd;
                    withPollNode((node) => {
                        node.setOptionText(option, value);
                    }, () => {
                        target.selectionStart = selectionStart;
                        target.selectionEnd = selectionEnd;
                    });
                }, placeholder: `Option ${index + 1}` })),
        React.createElement("button", { type: "button", disabled: options.length < 3, className: (0, joinClasses_1.joinClasses)('PollNode__optionDelete', options.length < 3 && 'PollNode__optionDeleteDisabled'), "aria-label": "Remove", onClick: () => {
                withPollNode((node) => {
                    node.deleteOption(option);
                });
            } })));
}
// eslint-disable-next-line import/no-default-export
function PollComponent({ question, options, nodeKey, }) {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    const totalVotes = (0, react_1.useMemo)(() => getTotalVotes(options), [options]);
    const [isSelected, setSelected, clearSelection] = (0, useLexicalNodeSelection_1.useLexicalNodeSelection)(nodeKey);
    const [selection, setSelection] = (0, react_1.useState)(null);
    const ref = (0, react_1.useRef)(null);
    const $onDelete = (0, react_1.useCallback)((payload) => {
        const deleteSelection = (0, lexical_1.$getSelection)();
        if (isSelected && (0, lexical_1.$isNodeSelection)(deleteSelection)) {
            const event = payload;
            event.preventDefault();
            editor.update(() => {
                deleteSelection.getNodes().forEach((node) => {
                    if ((0, index_1.$isPollNode)(node)) {
                        node.remove();
                    }
                });
            });
        }
        return false;
    }, [editor, isSelected]);
    (0, react_1.useEffect)(() => (0, utils_1.mergeRegister)(editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => (0, lexical_1.$getSelection)()));
    }), editor.registerCommand(lexical_1.CLICK_COMMAND, (payload) => {
        const event = payload;
        if (event.target === ref.current) {
            if (!event.shiftKey) {
                clearSelection();
            }
            setSelected(!isSelected);
            return true;
        }
        return false;
    }, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_DELETE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.KEY_BACKSPACE_COMMAND, $onDelete, lexical_1.COMMAND_PRIORITY_LOW)), [clearSelection, editor, isSelected, nodeKey, $onDelete, setSelected]);
    const withPollNode = (cb, onUpdate) => {
        editor.update(() => {
            const node = (0, lexical_1.$getNodeByKey)(nodeKey);
            if ((0, index_1.$isPollNode)(node)) {
                cb(node);
            }
        }, { onUpdate });
    };
    const addOption = () => {
        withPollNode((node) => {
            node.addOption((0, index_1.createPollOption)());
        });
    };
    const isFocused = (0, lexical_1.$isNodeSelection)(selection) && isSelected;
    return (React.createElement("div", { className: `PollNode__container ${isFocused ? 'focused' : ''}`, ref: ref },
        React.createElement("div", { className: "PollNode__inner" },
            React.createElement("h2", { className: "PollNode__heading" }, question),
            options.map((option, index) => {
                const key = option.uid;
                return (React.createElement(PollOptionComponent, { key: key, withPollNode: withPollNode, option: option, index: index, options: options, totalVotes: totalVotes }));
            }),
            React.createElement("div", { className: "PollNode__footer" },
                React.createElement(Button_1.Button, { onClick: addOption, small: true }, "Add Option")))));
}
exports.default = PollComponent;
