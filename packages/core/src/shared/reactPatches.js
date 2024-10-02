"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startTransition = void 0;
const react_1 = __importDefault(require("react"));
// Webpack + React 17 fails to compile on the usage of `React.startTransition` or
// `React["startTransition"]` even if it's behind a feature detection of
// `"startTransition" in React`. Moving this to a constant avoids the issue :/
const START_TRANSITION = 'startTransition';
const startTransition = (callback) => {
    if (START_TRANSITION in react_1.default) {
        react_1.default[START_TRANSITION](callback);
    }
    else {
        callback();
    }
};
exports.startTransition = startTransition;
