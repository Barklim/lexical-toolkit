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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModalTagSelector = void 0;
const react_1 = __importStar(require("react"));
const Modal_1 = __importDefault(require("react-bootstrap/lib/Modal"));
const functions_1 = require("../../functions");
const constant_1 = require("../../constant");
exports.ModalTagSelector = (0, react_1.forwardRef)(({ tags, limitTagCodes = [] }, ref) => {
    const [show, setShow] = (0, react_1.useState)(false);
    const [resolvePromise, setResolvePromise] = (0, react_1.useState)(null);
    const [rejectPromise, setRejectPromise] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => () => {
        setResolvePromise(null);
        setRejectPromise(null);
    }, []);
    (0, react_1.useImperativeHandle)(ref, () => ({
        open: () => {
            setShow(true);
            return new Promise((resolve, reject) => {
                setResolvePromise(() => resolve);
                setRejectPromise(() => reject);
            });
        },
    }));
    const ok = (0, react_1.useCallback)((tag) => {
        setShow(false);
        if (resolvePromise)
            resolvePromise(tag);
    }, [resolvePromise]);
    const cancel = (0, react_1.useCallback)(() => {
        setShow(false);
        if (rejectPromise)
            rejectPromise();
    }, [rejectPromise]);
    const renderTags = (0, react_1.useCallback)((tagGroup) => {
        var _a;
        const mappedLimitTagCodes = (_a = limitTagCodes === null || limitTagCodes === void 0 ? void 0 : limitTagCodes.map((item) => `{{ ${item} }}`)) !== null && _a !== void 0 ? _a : [];
        return (react_1.default.createElement("div", { className: "margin-bottom" },
            react_1.default.createElement("div", { className: "control-label" }, tagGroup.label),
            tags
                .filter((tag) => {
                let properPrefix;
                if (tagGroup.prefix) {
                    properPrefix = tag.code.startsWith((0, functions_1.filterMapper)(tagGroup.prefix));
                }
                else {
                    properPrefix = !tag.code.match(constant_1.allPrefixes);
                }
                return properPrefix && (!mappedLimitTagCodes.length || mappedLimitTagCodes.includes(tag.code));
            })
                .map((tag) => (react_1.default.createElement("div", { className: "small", key: tag.code },
                react_1.default.createElement("a", { onClick: () => ok(tag) }, tag.name.substring(3, tag.name.length - 3)))))));
    }, [tags, limitTagCodes, ok]);
    return (react_1.default.createElement(Modal_1.default, { show: show, onHide: cancel, bsSize: "large", backdrop: "static", className: "test" },
        react_1.default.createElement("div", null,
            react_1.default.createElement(Modal_1.default.Header, { closeButton: true },
                react_1.default.createElement(Modal_1.default.Title, null, "Library of email parameters")),
            react_1.default.createElement(Modal_1.default.Body, null,
                react_1.default.createElement("div", { className: "row" },
                    react_1.default.createElement("div", { className: "col-xs-3" },
                        renderTags(constant_1.tagGroups.hrAgent),
                        renderTags(constant_1.tagGroups.company),
                        renderTags(constant_1.tagGroups.other)),
                    react_1.default.createElement("div", { className: "col-xs-3" }, renderTags(constant_1.tagGroups.candidate)),
                    react_1.default.createElement("div", { className: "col-xs-3" }, renderTags(constant_1.tagGroups.contact)),
                    react_1.default.createElement("div", { className: "col-xs-3" }, renderTags(constant_1.tagGroups.job)))))));
});
