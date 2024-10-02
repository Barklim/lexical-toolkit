"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFlashMessageContext = exports.FlashMessageContext = void 0;
const react_1 = require("react");
const FlashMessage_1 = require("../ui/FlashMessage");
const react_2 = __importDefault(require("react"));
const Context = (0, react_1.createContext)(undefined);
const INITIAL_STATE = {};
const DEFAULT_DURATION = 1000;
const FlashMessageContext = ({ children }) => {
    const [props, setProps] = (0, react_1.useState)(INITIAL_STATE);
    const showFlashMessage = (0, react_1.useCallback)((message, duration) => setProps(message ? { duration, message } : INITIAL_STATE), []);
    (0, react_1.useEffect)(() => {
        var _a;
        if (props.message) {
            const timeoutId = setTimeout(() => setProps(INITIAL_STATE), (_a = props.duration) !== null && _a !== void 0 ? _a : DEFAULT_DURATION);
            return () => clearTimeout(timeoutId);
        }
    }, [props]);
    return (react_2.default.createElement(Context.Provider, { value: showFlashMessage },
        children,
        props.message && react_2.default.createElement(FlashMessage_1.FlashMessage, null, props.message)));
};
exports.FlashMessageContext = FlashMessageContext;
const useFlashMessageContext = () => {
    const ctx = (0, react_1.useContext)(Context);
    if (!ctx) {
        throw new Error('Missing FlashMessageContext');
    }
    return ctx;
};
exports.useFlashMessageContext = useFlashMessageContext;
