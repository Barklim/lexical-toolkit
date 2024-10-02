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
exports.EquationsPlugin = exports.InsertEquationDialog = exports.INSERT_EQUATION_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const EquationNode_1 = require("../../nodes/EquationNode");
const KatexEquationAlterer_1 = require("../../ui/KatexEquationAlterer");
exports.INSERT_EQUATION_COMMAND = (0, lexical_1.createCommand)('INSERT_EQUATION_COMMAND');
function InsertEquationDialog({ activeEditor, onClose, }) {
    const onEquationConfirm = (0, react_1.useCallback)((equation, inline) => {
        activeEditor.dispatchCommand(exports.INSERT_EQUATION_COMMAND, { equation, inline });
        onClose();
    }, [activeEditor, onClose]);
    return React.createElement(KatexEquationAlterer_1.KatexEquationAlterer, { onConfirm: onEquationConfirm });
}
exports.InsertEquationDialog = InsertEquationDialog;
const EquationsPlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([EquationNode_1.EquationNode])) {
            throw new Error('EquationsPlugins: EquationsNode not registered on editor');
        }
        return editor.registerCommand(exports.INSERT_EQUATION_COMMAND, (payload) => {
            const { equation, inline } = payload;
            const equationNode = (0, EquationNode_1.$createEquationNode)(equation, inline);
            (0, lexical_1.$insertNodes)([equationNode]);
            if ((0, lexical_1.$isRootOrShadowRoot)(equationNode.getParentOrThrow())) {
                (0, utils_1.$wrapNodeInElement)(equationNode, lexical_1.$createParagraphNode).selectEnd();
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR);
    }, [editor]);
    return null;
};
exports.EquationsPlugin = EquationsPlugin;
