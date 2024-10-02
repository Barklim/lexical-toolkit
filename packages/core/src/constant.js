"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allPrefixes = exports.tagGroups = exports.lexicalEmojisDictionary = exports.lexicalConfig = exports.lexicalTheme = void 0;
exports.lexicalTheme = {
    ltr: 'ltr',
    rtl: 'rtl',
    placeholder: 'editor-placeholder',
    paragraph: 'editor-paragraph',
};
exports.lexicalConfig = {
    namespace: 'lexicalConfig',
    //   nodes: [...Nodes],
    nodes: [],
    onError(error) {
        throw error;
    },
    editable: true,
    theme: exports.lexicalTheme,
};
exports.lexicalEmojisDictionary = new Map([
    [':)', ['emoji happysmile', '🙂']],
    [':D', ['emoji veryhappysmile', '😀']],
    [':(', ['emoji unhappysmile', '🙁']],
    ['<3', ['emoji heart', '❤']],
]);
exports.tagGroups = {
    hrAgent: {
        label: 'HR Agent',
        prefix: 'hrAgent.',
    },
    company: {
        label: 'Company',
        prefix: 'company.',
    },
    candidate: {
        label: 'Candidate',
        prefix: 'candidate.',
    },
    contact: {
        label: 'Contact',
        prefix: 'contact.',
    },
    job: {
        label: 'Job',
        prefix: 'job.',
    },
    other: {
        label: 'Other',
    },
};
const joinedPrefixes = Object.values(exports.tagGroups)
    .filter((tagGroup) => !!tagGroup.prefix)
    .map(({ prefix }) => `{{ ${prefix.replace('.', '\\.')}`)
    .join('|');
exports.allPrefixes = new RegExp(`^(${joinedPrefixes})`);
