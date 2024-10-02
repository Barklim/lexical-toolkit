"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlashMessage = void 0;
const FlashMessageContext_1 = require("../../context/FlashMessageContext");
const useFlashMessage = () => (0, FlashMessageContext_1.useFlashMessageContext)();
exports.useFlashMessage = useFlashMessage;
