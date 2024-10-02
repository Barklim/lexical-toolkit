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
exports.InsertLayoutDialog = void 0;
const React = __importStar(require("react"));
const react_1 = require("react");
const Button_1 = require("../../ui/Button");
const DropDown_1 = __importStar(require("../../ui/DropDown"));
const LayoutPlugin_1 = require("./LayoutPlugin");
const LAYOUTS = [
    { label: '2 columns (equal width)', value: '1fr 1fr' },
    { label: '2 columns (25% - 75%)', value: '1fr 3fr' },
    { label: '3 columns (equal width)', value: '1fr 1fr 1fr' },
    { label: '3 columns (25% - 50% - 25%)', value: '1fr 2fr 1fr' },
    { label: '4 columns (equal width)', value: '1fr 1fr 1fr 1fr' },
];
const InsertLayoutDialog = ({ activeEditor, onClose, }) => {
    var _a;
    const [layout, setLayout] = (0, react_1.useState)(LAYOUTS[0].value);
    const buttonLabel = (_a = LAYOUTS.find((item) => item.value === layout)) === null || _a === void 0 ? void 0 : _a.label;
    const onClick = () => {
        activeEditor.dispatchCommand(LayoutPlugin_1.INSERT_LAYOUT_COMMAND, layout);
        onClose();
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(DropDown_1.default, { buttonClassName: "toolbar-item dialog-dropdown", buttonLabel: buttonLabel }, LAYOUTS.map(({ label, value }) => (React.createElement(DropDown_1.DropDownItem, { key: value, className: "item", onClick: () => setLayout(value) },
            React.createElement("span", { className: "text" }, label))))),
        React.createElement(Button_1.Button, { onClick: onClick }, "Insert")));
};
exports.InsertLayoutDialog = InsertLayoutDialog;
