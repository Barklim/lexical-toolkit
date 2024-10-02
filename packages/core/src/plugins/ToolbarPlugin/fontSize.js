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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontSize = void 0;
const selection_1 = require("@lexical/selection");
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
// import './fontSize.css';
const MIN_ALLOWED_FONT_SIZE = 8;
const MAX_ALLOWED_FONT_SIZE = 72;
const DEFAULT_FONT_SIZE = 15;
// eslint-disable-next-line no-shadow
var updateFontSizeType;
(function (updateFontSizeType) {
    updateFontSizeType[updateFontSizeType["increment"] = 1] = "increment";
    updateFontSizeType[updateFontSizeType["decrement"] = 2] = "decrement";
})(updateFontSizeType || (updateFontSizeType = {}));
const FontSize = ({ selectionFontSize, disabled, editor, }) => {
    const [inputValue, setInputValue] = React.useState(selectionFontSize);
    const [inputChangeFlag, setInputChangeFlag] = React.useState(false);
    /**
     * Calculates the new font size based on the update type.
     * @param currentFontSize - The current font size
     * @param updateType - The type of change, either increment or decrement
     * @returns the next font size
     */
    const calculateNextFontSize = (currentFontSize, updateType) => {
        if (!updateType) {
            return currentFontSize;
        }
        let updatedFontSize = currentFontSize;
        switch (updateType) {
            case updateFontSizeType.decrement:
                switch (true) {
                    case currentFontSize > MAX_ALLOWED_FONT_SIZE:
                        updatedFontSize = MAX_ALLOWED_FONT_SIZE;
                        break;
                    case currentFontSize >= 48:
                        updatedFontSize -= 12;
                        break;
                    case currentFontSize >= 24:
                        updatedFontSize -= 4;
                        break;
                    case currentFontSize >= 14:
                        updatedFontSize -= 2;
                        break;
                    case currentFontSize >= 9:
                        updatedFontSize -= 1;
                        break;
                    default:
                        updatedFontSize = MIN_ALLOWED_FONT_SIZE;
                        break;
                }
                break;
            case updateFontSizeType.increment:
                switch (true) {
                    case currentFontSize < MIN_ALLOWED_FONT_SIZE:
                        updatedFontSize = MIN_ALLOWED_FONT_SIZE;
                        break;
                    case currentFontSize < 12:
                        updatedFontSize += 1;
                        break;
                    case currentFontSize < 20:
                        updatedFontSize += 2;
                        break;
                    case currentFontSize < 36:
                        updatedFontSize += 4;
                        break;
                    case currentFontSize <= 60:
                        updatedFontSize += 12;
                        break;
                    default:
                        updatedFontSize = MAX_ALLOWED_FONT_SIZE;
                        break;
                }
                break;
            default:
                break;
        }
        return updatedFontSize;
    };
    /**
     * Patches the selection with the updated font size.
     */
    const updateFontSizeInSelection = React.useCallback((newFontSize, updateType) => {
        const getNextFontSize = (prevFontSize) => {
            let currentFontSize = prevFontSize !== null && prevFontSize !== void 0 ? prevFontSize : `${DEFAULT_FONT_SIZE}px`;
            currentFontSize = currentFontSize.slice(0, -2);
            const nextFontSize = calculateNextFontSize(Number(currentFontSize), updateType);
            return `${nextFontSize}px`;
        };
        editor.update(() => {
            if (editor.isEditable()) {
                const selection = (0, lexical_1.$getSelection)();
                if (selection !== null) {
                    (0, selection_1.$patchStyleText)(selection, {
                        'font-size': newFontSize || getNextFontSize,
                    });
                }
            }
        });
    }, [editor]);
    const handleKeyPress = (e) => {
        const inputValueNumber = Number(inputValue);
        if (['e', 'E', '+', '-'].includes(e.key) || isNaN(inputValueNumber)) {
            e.preventDefault();
            setInputValue('');
            return;
        }
        setInputChangeFlag(true);
        if (e.key === 'Enter' || e.key === 'Tab' || e.key === 'Escape') {
            e.preventDefault();
            updateFontSizeByInputValue(inputValueNumber);
        }
    };
    const handleInputBlur = () => {
        if (inputValue !== '' && inputChangeFlag) {
            const inputValueNumber = Number(inputValue);
            updateFontSizeByInputValue(inputValueNumber);
        }
    };
    const handleButtonClick = (updateType) => {
        if (inputValue !== '') {
            const nextFontSize = calculateNextFontSize(Number(inputValue), updateType);
            updateFontSizeInSelection(`${String(nextFontSize)}px`, null);
        }
        else {
            updateFontSizeInSelection(null, updateType);
        }
    };
    const updateFontSizeByInputValue = (inputValueNumber) => {
        let updatedFontSize = inputValueNumber;
        if (inputValueNumber > MAX_ALLOWED_FONT_SIZE) {
            updatedFontSize = MAX_ALLOWED_FONT_SIZE;
        }
        else if (inputValueNumber < MIN_ALLOWED_FONT_SIZE) {
            updatedFontSize = MIN_ALLOWED_FONT_SIZE;
        }
        setInputValue(String(updatedFontSize));
        updateFontSizeInSelection(`${String(updatedFontSize)}px`, null);
        setInputChangeFlag(false);
    };
    React.useEffect(() => {
        setInputValue(selectionFontSize);
    }, [selectionFontSize]);
    return (React.createElement(React.Fragment, null,
        React.createElement("button", { type: "button", disabled: disabled || (selectionFontSize !== '' && Number(inputValue) <= MIN_ALLOWED_FONT_SIZE), onClick: () => handleButtonClick(updateFontSizeType.decrement), className: "toolbar-item font-decrement" },
            React.createElement("i", { className: "format minus-icon" })),
        React.createElement("input", { type: "number", value: inputValue, disabled: disabled, className: "toolbar-item font-size-input", min: MIN_ALLOWED_FONT_SIZE, max: MAX_ALLOWED_FONT_SIZE, onChange: (e) => setInputValue(e.target.value), onKeyDown: handleKeyPress, onBlur: handleInputBlur }),
        React.createElement("button", { type: "button", disabled: disabled || (selectionFontSize !== '' && Number(inputValue) >= MAX_ALLOWED_FONT_SIZE), onClick: () => handleButtonClick(updateFontSizeType.increment), className: "toolbar-item font-increment" },
            React.createElement("i", { className: "format add-icon" }))));
};
exports.FontSize = FontSize;
