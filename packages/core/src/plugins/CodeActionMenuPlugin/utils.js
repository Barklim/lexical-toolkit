"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = void 0;
const lodash_es_1 = require("lodash-es");
const react_1 = require("react");
function useDebounce(fn, ms, maxWait) {
    const funcRef = (0, react_1.useRef)(null);
    funcRef.current = fn;
    return (0, react_1.useMemo)(() => (0, lodash_es_1.debounce)((...args) => {
        if (funcRef.current) {
            funcRef.current(...args);
        }
    }, ms, { maxWait }), [ms, maxWait]);
}
exports.useDebounce = useDebounce;
