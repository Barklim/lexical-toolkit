"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useReport = void 0;
const react_1 = require("react");
const getElement = () => {
    let element = document.getElementById('report-container');
    if (element === null) {
        element = document.createElement('div');
        element.id = 'report-container';
        element.style.position = 'fixed';
        element.style.top = '50%';
        element.style.left = '50%';
        element.style.fontSize = '32px';
        element.style.transform = 'translate(-50%, -50px)';
        element.style.padding = '20px';
        element.style.background = 'rgba(240, 240, 240, 0.4)';
        element.style.borderRadius = '20px';
        if (document.body) {
            document.body.appendChild(element);
        }
    }
    return element;
};
const useReport = () => {
    const timer = (0, react_1.useRef)(null);
    const cleanup = (0, react_1.useCallback)(() => {
        if (timer.current !== null) {
            clearTimeout(timer.current);
            timer.current = null;
        }
        if (document.body) {
            document.body.removeChild(getElement());
        }
    }, []);
    (0, react_1.useEffect)(() => cleanup, [cleanup]);
    return (0, react_1.useCallback)((content) => {
        // eslint-disable-next-line no-console
        console.log(content);
        const element = getElement();
        if (timer.current !== null) {
            clearTimeout(timer.current);
        }
        element.innerHTML = content;
        timer.current = setTimeout(cleanup, 1000);
        return timer.current;
    }, [cleanup]);
};
exports.useReport = useReport;
