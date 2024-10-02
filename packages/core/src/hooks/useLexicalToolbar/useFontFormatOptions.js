"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFontFormatOptions = void 0;
const selection_1 = require("@lexical/selection");
const lexical_1 = require("lexical");
const react_1 = require("react");
const FONT_FAMILY_OPTIONS = [
    ["Arial", "Arial"],
    ["Courier New", "Courier New"],
    ["Georgia", "Georgia"],
    ["Times New Roman", "Times New Roman"],
    ["Trebuchet MS", "Trebuchet MS"],
    ["Verdana", "Verdana"],
];
const FONT_SIZE_OPTIONS = [
    ["10px", "10px"],
    ["11px", "11px"],
    ["12px", "12px"],
    ["13px", "13px"],
    ["14px", "14px"],
    ["15px", "15px"],
    ["16px", "16px"],
    ["17px", "17px"],
    ["18px", "18px"],
    ["19px", "19px"],
    ["20px", "20px"],
];
const useFontFormatOptions = (params) => {
    const { editor, value, style } = params;
    const handleClick = (0, react_1.useCallback)((option) => {
        editor.update(() => {
            const selection = (0, lexical_1.$getSelection)();
            if (selection !== null) {
                (0, selection_1.$patchStyleText)(selection, {
                    [style]: option,
                });
            }
        });
    }, [editor, style]);
    return (style === "font-family" ? FONT_FAMILY_OPTIONS : FONT_SIZE_OPTIONS).map(([option, text]) => {
        return {
            title: text,
            value: option,
            active: value === option,
            dispatch: () => handleClick(option),
        };
    });
};
exports.useFontFormatOptions = useFontFormatOptions;
