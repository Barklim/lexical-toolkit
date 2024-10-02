"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useLayoutEffectImpl = void 0;
const react_1 = require("react");
const canUseDOM_1 = require("./canUseDOM");
// This workaround is no longer necessary in React 19,
// but we currently support React >=17.x
// https://github.com/facebook/react/pull/26395
exports.useLayoutEffectImpl = canUseDOM_1.CAN_USE_DOM ? react_1.useLayoutEffect : react_1.useEffect;
