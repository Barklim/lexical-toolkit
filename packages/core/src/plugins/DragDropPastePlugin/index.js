"use strict";
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
exports.DragDropPaste = void 0;
const LexicalComposerContext_1 = require("@lexical/react/LexicalComposerContext");
const rich_text_1 = require("@lexical/rich-text");
const utils_1 = require("@lexical/utils");
const lexical_1 = require("lexical");
const react_1 = require("react");
const ImagesPlugin_1 = require("../ImagesPlugin");
const ACCEPTABLE_IMAGE_TYPES = ['image/', 'image/heic', 'image/heif', 'image/gif', 'image/webp'];
const DragDropPaste = () => {
    const [editor] = (0, LexicalComposerContext_1.useLexicalComposerContext)();
    (0, react_1.useEffect)(() => editor.registerCommand(rich_text_1.DRAG_DROP_PASTE, (files) => {
        (() => __awaiter(void 0, void 0, void 0, function* () {
            const filesResult = yield (0, utils_1.mediaFileReader)(files, [ACCEPTABLE_IMAGE_TYPES].flatMap((x) => x));
            for (const { file, result } of filesResult) {
                if ((0, utils_1.isMimeType)(file, ACCEPTABLE_IMAGE_TYPES)) {
                    editor.dispatchCommand(ImagesPlugin_1.INSERT_IMAGE_COMMAND, {
                        altText: file.name,
                        src: result,
                    });
                }
            }
        }))();
        return true;
    }, lexical_1.COMMAND_PRIORITY_LOW), [editor]);
    return null;
};
exports.DragDropPaste = DragDropPaste;
