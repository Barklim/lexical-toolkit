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
exports.$isPollNode = exports.$createPollNode = exports.PollNode = exports.createPollOption = void 0;
const lexical_1 = require("lexical");
const React = __importStar(require("react"));
const react_1 = require("react");
// eslint-disable-next-line import/no-cycle
const PollComponent = React.lazy(() => Promise.resolve().then(() => __importStar(require('./PollComponent'))));
function createUID() {
    return Math.random()
        .toString(36)
        .replace(/[^a-z]+/g, '')
        .substr(0, 5);
}
function createPollOption(text = '') {
    return {
        text,
        uid: createUID(),
        votes: [],
    };
}
exports.createPollOption = createPollOption;
function cloneOption(option, text, votes) {
    return {
        text,
        uid: option.uid,
        votes: votes || Array.from(option.votes),
    };
}
function $convertPollElement(domNode) {
    const question = domNode.getAttribute('data-lexical-poll-question');
    const options = domNode.getAttribute('data-lexical-poll-options');
    if (question !== null && options !== null) {
        const node = $createPollNode(question, JSON.parse(options));
        return { node };
    }
    return null;
}
class PollNode extends lexical_1.DecoratorNode {
    static getType() {
        return 'poll';
    }
    static clone(node) {
        return new PollNode(node.__question, node.__options, node.__key);
    }
    static importJSON(serializedNode) {
        const node = $createPollNode(serializedNode.question, serializedNode.options);
        serializedNode.options.forEach(node.addOption);
        return node;
    }
    constructor(question, options, key) {
        super(key);
        this.__question = question;
        this.__options = options;
    }
    exportJSON() {
        return {
            options: this.__options,
            question: this.__question,
            type: 'poll',
            version: 1,
        };
    }
    addOption(option) {
        const self = this.getWritable();
        const options = Array.from(self.__options);
        options.push(option);
        self.__options = options;
    }
    deleteOption(option) {
        const self = this.getWritable();
        const options = Array.from(self.__options);
        const index = options.indexOf(option);
        options.splice(index, 1);
        self.__options = options;
    }
    setOptionText(option, text) {
        const self = this.getWritable();
        const clonedOption = cloneOption(option, text);
        const options = Array.from(self.__options);
        const index = options.indexOf(option);
        options[index] = clonedOption;
        self.__options = options;
    }
    toggleVote(option, clientID) {
        const self = this.getWritable();
        const votes = option.votes;
        const votesClone = Array.from(votes);
        const voteIndex = votes.indexOf(clientID);
        if (voteIndex === -1) {
            votesClone.push(clientID);
        }
        else {
            votesClone.splice(voteIndex, 1);
        }
        const clonedOption = cloneOption(option, option.text, votesClone);
        const options = Array.from(self.__options);
        const index = options.indexOf(option);
        options[index] = clonedOption;
        self.__options = options;
    }
    static importDOM() {
        return {
            span: (domNode) => {
                if (!domNode.hasAttribute('data-lexical-poll-question')) {
                    return null;
                }
                return {
                    conversion: $convertPollElement,
                    priority: 2,
                };
            },
        };
    }
    exportDOM() {
        const element = document.createElement('span');
        element.setAttribute('data-lexical-poll-question', this.__question);
        element.setAttribute('data-lexical-poll-options', JSON.stringify(this.__options));
        return { element };
    }
    createDOM() {
        const elem = document.createElement('span');
        elem.style.display = 'inline-block';
        return elem;
    }
    updateDOM() {
        return false;
    }
    decorate() {
        return (React.createElement(react_1.Suspense, { fallback: null },
            React.createElement(PollComponent, { question: this.__question, options: this.__options, nodeKey: this.__key })));
    }
}
exports.PollNode = PollNode;
function $createPollNode(question, options) {
    return new PollNode(question, options);
}
exports.$createPollNode = $createPollNode;
function $isPollNode(node) {
    return node instanceof PollNode;
}
exports.$isPollNode = $isPollNode;
