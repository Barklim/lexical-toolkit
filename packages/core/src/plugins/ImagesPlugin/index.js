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
exports.ImagesPlugin = exports.InsertImageDialog = exports.InsertImageUploadedDialogBody = exports.InsertImageUriDialogBody = exports.INSERT_IMAGE_COMMAND = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const React = __importStar(require("react"));
const canUseDOM_1 = require("../../shared/canUseDOM");
// import landscapeImage from '../../images/landscape.jpg';
// import yellowFlowerImage from '../../images/yellow-flower.jpg';
const ImageNode_1 = require("../../nodes/ImageNode");
const Button_1 = require("../../ui/Button");
const Dialog_1 = require("../../ui/Dialog");
const FileInput_1 = require("../../ui/FileInput");
const TextInput_1 = require("../../ui/TextInput");
const getDOMSelection = (targetWindow) => canUseDOM_1.CAN_USE_DOM ? (targetWindow || window).getSelection() : null;
exports.INSERT_IMAGE_COMMAND = (0, lexical_1.createCommand)('INSERT_IMAGE_COMMAND');
function InsertImageUriDialogBody({ onClick }) {
    const [src, setSrc] = (0, react_1.useState)('');
    const [altText, setAltText] = (0, react_1.useState)('');
    const isDisabled = src === '';
    return (React.createElement(React.Fragment, null,
        React.createElement(TextInput_1.TextInput, { label: "Image URL", placeholder: "i.e. https://source.unsplash.com/random", onChange: setSrc, value: src, "data-test-id": "image-modal-url-input" }),
        React.createElement(TextInput_1.TextInput, { label: "Alt Text", placeholder: "Random unsplash image", onChange: setAltText, value: altText, "data-test-id": "image-modal-alt-text-input" }),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-confirm-btn", disabled: isDisabled, onClick: () => onClick({ altText, src }) }, "Confirm"))));
}
exports.InsertImageUriDialogBody = InsertImageUriDialogBody;
function InsertImageUploadedDialogBody({ onClick }) {
    const [src, setSrc] = (0, react_1.useState)('');
    const [altText, setAltText] = (0, react_1.useState)('');
    const isDisabled = src === '';
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
    return (React.createElement(React.Fragment, null,
        React.createElement(FileInput_1.FileInput, { label: "Image Upload", onChange: loadImage, accept: "image/*", "data-test-id": "image-modal-file-upload" }),
        React.createElement(TextInput_1.TextInput, { label: "Alt Text", placeholder: "Descriptive alternative text", onChange: setAltText, value: altText, "data-test-id": "image-modal-alt-text-input" }),
        React.createElement(Dialog_1.DialogActions, null,
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-file-upload-btn", disabled: isDisabled, onClick: () => onClick({ altText, src }) }, "Confirm"))));
}
exports.InsertImageUploadedDialogBody = InsertImageUploadedDialogBody;
function InsertImageDialog({ activeEditor, onClose, }) {
    const [mode, setMode] = (0, react_1.useState)(null);
    const hasModifier = (0, react_1.useRef)(false);
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
    const onClick = (payload) => {
        activeEditor.dispatchCommand(exports.INSERT_IMAGE_COMMAND, payload);
        onClose();
    };
    return (React.createElement(React.Fragment, null,
        !mode && (React.createElement(Dialog_1.DialogButtonsList, null,
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-option-sample", onClick: () => onClick(hasModifier.current
                    ? {
                        altText: 'Daylight fir trees forest glacier green high ice landscape',
                        src: '',
                    }
                    : {
                        altText: 'Yellow flower in tilt shift lens',
                        src: '',
                    }) }, "Sample"),
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-option-url", onClick: () => setMode('url') }, "URL"),
            React.createElement(Button_1.Button, { "data-test-id": "image-modal-option-file", onClick: () => setMode('file') }, "File"))),
        mode === 'url' && React.createElement(InsertImageUriDialogBody, { onClick: onClick }),
        mode === 'file' && React.createElement(InsertImageUploadedDialogBody, { onClick: onClick })));
}
exports.InsertImageDialog = InsertImageDialog;
const ImagesPlugin = ({ captionsEnabled }) => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => {
        if (!editor.hasNodes([ImageNode_1.ImageNode])) {
            throw new Error('ImagesPlugin: ImageNode not registered on editor');
        }
        return (0, utils_1.mergeRegister)(editor.registerCommand(exports.INSERT_IMAGE_COMMAND, (payload) => {
            const imageNode = (0, ImageNode_1.$createImageNode)(payload);
            (0, lexical_1.$insertNodes)([imageNode]);
            if ((0, lexical_1.$isRootOrShadowRoot)(imageNode.getParentOrThrow())) {
                (0, utils_1.$wrapNodeInElement)(imageNode, lexical_1.$createParagraphNode).selectEnd();
            }
            return true;
        }, lexical_1.COMMAND_PRIORITY_EDITOR), editor.registerCommand(lexical_1.DRAGSTART_COMMAND, (event) => $onDragStart(event), lexical_1.COMMAND_PRIORITY_HIGH), editor.registerCommand(lexical_1.DRAGOVER_COMMAND, (event) => $onDragover(event), lexical_1.COMMAND_PRIORITY_LOW), editor.registerCommand(lexical_1.DROP_COMMAND, (event) => $onDrop(event, editor), lexical_1.COMMAND_PRIORITY_HIGH));
    }, [captionsEnabled, editor]);
    return null;
};
exports.ImagesPlugin = ImagesPlugin;
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
            maxWidth: node.__maxWidth,
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
        editor.dispatchCommand(exports.INSERT_IMAGE_COMMAND, data);
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
    return (0, ImageNode_1.$isImageNode)(node) ? node : null;
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
        throw Error(`Cannot get the selection when dragging`);
    }
    return range;
}
