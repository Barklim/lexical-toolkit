"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invariant = void 0;
// invariant(condition, message) will refine types based on "condition", and
// if "condition" is false will throw an error. This function is special-cased
// in flow itself, so we can't name it anything else.
const invariant = (cond, message, ...args) => {
    if (cond) {
        return;
    }
    throw new Error(`Internal Lexical error: invariant() is meant to be replaced at compile ` +
        `time. There is no runtime version. Error: ${message}`);
};
exports.invariant = invariant;
