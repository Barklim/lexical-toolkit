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
exports.InlineImagePlugin = exports.InsertInlineImageDialog = exports.INSERT_INLINE_IMAGE_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
const canUseDOM_1 = require("../../shared/canUseDOM");
const InlineImageNode_1 = require("../../nodes/InlineImageNode/InlineImageNode");
const Button_1 = require("../../ui/Button");
const Dialog_1 = require("../../ui/Dialog");
const FileInput_1 = require("../../ui/FileInput");
const Select_1 = require("../../ui/Select");
const TextInput_1 = require("../../ui/TextInput");
const getDOMSelection = (targetWindow) => canUseDOM_1.CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
exports.INSERT_INLINE_IMAGE_COMMAND = (0, lexical_1.createCommand)('INSERT_INLINE_IMAGE_COMMAND');
function InsertInlineImageDialog({ activeEditor, onClose, }) {
    const hasModifier = (0, react_1.useRef)(false);
    const [src, setSrc] = (0, react_1.useState)('');
    const [altText, setAltText] = (0, react_1.useState)('');
    const [showCaption, setShowCaption] = (0, react_1.useState)(false);
    const [position, setPosition] = (0, react_1.useState)('left');
    const isDisabled = src === '';
    const handleShowCaptionChange = (e) => {
        setShowCaption(e.target.checked);
    };
    const handlePositionChange = (e) => {
        setPosition(e.target.value);
    };
    const loadImage = (files) => {
        const reader = new FileReader();
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setSrc(reader.result);
            }
            return '';
        };
        if (files !== null) {
            reader.readAsDataURL(files[0]);
        }
    };
    (0, react_1.useEffect)(() => {
        hasModifier.current = false;
        const handler = (e) => {
            hasModifier.current = e.altKey;
        };
        document.addEventListener('keydown', handler);
        return () => {
            document.removeEventListener('keydown', handler);
        };
    }, [activeEditor]);
    const handleOnClick = () => {
        const payload = { altText, position, showCaption, src };
        activeEditor.dispatchCommand(exports.INSERT_INLINE_IMAGE_COMMAND, payload);
        onClose();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { style: { marginBottom: '1em' } },
            React.createElement(FileInput_1.FileInput, { label: "Image Upload", onChange: loadImage, accept: "image/*", "data-test-id": "image-modal-file-upload" })),
        React.createElement("div", { style: { marginBottom: '1em' } },
            React.createElement(TextInput_1.TextInput, { label: "Alt Text", placeholder: "Descriptive alternative text", onChange: setAltText, value: altText, "data-test-id": "image-modal-alt-text-input" })),
        React.createElement(Select_1.Select, { style: { marginBottom: '1em', width: '290px' }, label: "Position", name: "position", id: "position-select", onChange: handlePositionChange },
            React.createElement("option", { value: "left" }, "Left"),
            React.createElement("option", { value: "right" }, "Right"),
            React.createElement("option", { value: "full" }, "Full Width")),
        React.createElement("div", { className: "Input__wrapper" },
            React.createElement("input", { id: "caption", className: "InlineImageNode_Checkbox", type: "checkbox", checked: showCaption, onChange: handleShowCaptionChange }),
            React.createElement("label", { htmlFor: "caption" }, "Show Caption")),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-file-upload-btn", disabled: isDisabled, onClick: () => handleOnClick() }, "Confirm"))));
}
exports.InsertInlineImageDialog = InsertInlineImageDialog;
const InlineImagePlugin = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([InlineImageNode_1.InlineImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(exports.INSERT_INLINE_IMAGE_COMMAND, (payload) => {
            const imageNode = (0, InlineImageNode_1.$createInlineImageNode)(payload);
            (0, lexical_1.$insertNodes)([imageNode]);
            if ((0, lexical_1.$isRootOrShadowRoot)(imageNode.getParentOrThrow())) {
                (0, utils_1.$wrapNodeInElement)(imageNode, lexical_1.$createParagraphNode).selectEnd();
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => $onDragStart(event), lexical_1.COMMAND_PRIORITY_HIGH), editor.registerCommand(lexical_1.DRAGOVER_COMMAND, (event) => $onDragover(event), lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DROP_COMMAND, (event) => $onDrop(event, editor), lexical_1.COMMAND_PRIORITY_HIGH));
    }, [editor]);
    return null;
};
exports.InlineImagePlugin = InlineImagePlugin;
const TRANSPARENT_IMAGE = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;
function $onDragStart(event) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const dataTransfer = event.dataTransfer;
    if (!dataTransfer) {
        return false;
    }
    dataTransfer.setData('text/plain', '_');
    dataTransfer.setDragImage(img, 0, 0);
    dataTransfer.setData('application/x-lexical-drag', JSON.stringify({
        data: {
            altText: node.__altText,
            caption: node.__caption,
            height: node.__height,
            key: node.getKey(),
            showCaption: node.__showCaption,
            src: node.__src,
            width: node.__width,
        },
        type: 'image',
    }));
    return true;
}
function $onDragover(event) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    if (!canDropImage(event)) {
        event.preventDefault();
    }
    return true;
}
function $onDrop(event, editor) {
    const node = $getImageNodeInSelection();
    if (!node) {
        return false;
    }
    const data = getDragImageData(event);
    if (!data) {
        return false;
    }
    event.preventDefault();
    if (canDropImage(event)) {
        const range = getDragSelection(event);
        node.remove();
        const rangeSelection = (0, lexical_1.$createRangeSelection)();
        if (range !== null && range !== undefined) {
            rangeSelection.applyDOMRange(range);
        }
        (0, lexical_1.$setSelection)(rangeSelection);
        editor.dispatchCommand(exports.INSERT_INLINE_IMAGE_COMMAND, data);
    }
    return true;
}
function $getImageNodeInSelection() {
    const selection = (0, lexical_1.$getSelection)();
    if (!(0, lexical_1.$isNodeSelection)(selection)) {
        return null;
    }
    const nodes = selection.getNodes();
    const node = nodes[0];
    return (0, InlineImageNode_1.$isInlineImageNode)(node) ? node : null;
}
function getDragImageData(event) {
    var _a;
    const dragData = (_a = event.dataTransfer) === null || _a === void 0 ? void 0 : _a.getData('application/x-lexical-drag');
    if (!dragData) {
        return null;
    }
    const { type, data } = JSON.parse(dragData);
    if (type !== 'image') {
        return null;
    }
    return data;
}
function canDropImage(event) {
    const target = event.target;
    return !!(target &&
        target instanceof HTMLElement &&
        !target.closest('code, span.editor-image') &&
        target.parentElement &&
        target.parentElement.closest('div.ContentEditable__root'));
}
function getDragSelection(event) {
    let range;
    const target = event.target;
    const targetWindow = target == null
        ? null
        : target.nodeType === 9
            ? target.defaultView
            : target.ownerDocument.defaultView;
    const domSelection = getDOMSelection(targetWindow);
    if (document.caretRangeFromPoint) {
        range = document.caretRangeFromPoint(event.clientX, event.clientY);
    }
    else if (event.rangeParent && domSelection !== null) {
        domSelection.collapse(event.rangeParent, event.rangeOffset || 0);
        range = domSelection.getRangeAt(0);
    }
    else {
        throw Error('Cannot get the selection when dragging');
    }
    return range;
}
