"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.joinClasses = void 0;
const joinClasses = (...args) => args.filter(Boolean).join(' ');
exports.joinClasses = joinClasses;
