// import { Nodes } from './nodes/Nodes';
import { TagGroupType } from './types';

export const lexicalTheme = {
  ltr: 'ltr',
  rtl: 'rtl',
  placeholder: 'editor-placeholder',
  paragraph: 'editor-paragraph',
};

export const lexicalConfig = {
  namespace: 'lexicalConfig',
  //   nodes: [...Nodes],
  nodes: [],
  onError(error: Error) {
    throw error;
  },
  editable: true,
  theme: lexicalTheme,
};

export const lexicalEmojisDictionary: Map<string, [string, string]> = new Map([
  [':)', ['emoji happysmile', '🙂']],
  [':D', ['emoji veryhappysmile', '😀']],
  [':(', ['emoji unhappysmile', '🙁']],
  ['<3', ['emoji heart', '❤']],
]);

export const tagGroups: { [key: string]: TagGroupType } = {
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

const joinedPrefixes = Object.values(tagGroups)
  .filter((tagGroup): tagGroup is TagGroupType => !!tagGroup.prefix)
  .map(({ prefix }) => `{{ ${(prefix as any).replace('.', '\\.')}`)
  .join('|');

export const allPrefixes = new RegExp(`^(${joinedPrefixes})`);
