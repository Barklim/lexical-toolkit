"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useElementFormat = void 0;
const lexical_1 = require("lexical");
const ELEMENT_FORMAT_OPTIONS = {
    center: {
        icon: "center-align",
        iconRTL: "right-align",
        name: "Center Align",
    },
    end: {
        icon: "right-align",
        iconRTL: "left-align",
        name: "End Align",
    },
    justify: {
        icon: "justify-align",
        iconRTL: "justify-align",
        name: "Justify Align",
    },
    left: {
        icon: "left-align",
        iconRTL: "left-align",
        name: "Left Align",
    },
    right: {
        icon: "right-align",
        iconRTL: "left-align",
        name: "Right Align",
    },
    start: {
        icon: "left-align",
        iconRTL: "right-align",
        name: "Start Align",
    },
};
const useElementFormat = (params) => {
    const { editor, value } = params;
    const formatOption = ELEMENT_FORMAT_OPTIONS[value || "left"];
    return {
        label: formatOption.name,
        leftAlign: {
            active: value === "left",
            title: "Left Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "left"),
        },
        centerAlign: {
            active: value === "center",
            title: "Center Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "center"),
        },
        rightAlign: {
            active: value === "right",
            title: "Right Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "right"),
        },
        justifyAlign: {
            active: value === "justify",
            title: "Justify Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "justify"),
        },
        startAlign: {
            active: value === "start",
            title: "Start Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "start"),
        },
        endAlign: {
            active: value === "end",
            title: "End Align",
            dispatch: () => editor.dispatchCommand(lexical_1.FORMAT_ELEMENT_COMMAND, "end"),
        },
        indent: {
            title: "Indent",
            dispatch: () => editor.dispatchCommand(lexical_1.INDENT_CONTENT_COMMAND, undefined),
        },
        outdent: {
            title: "Outdent",
            dispatch: () => editor.dispatchCommand(lexical_1.OUTDENT_CONTENT_COMMAND, undefined),
        },
    };
};
exports.useElementFormat = useElementFormat;
