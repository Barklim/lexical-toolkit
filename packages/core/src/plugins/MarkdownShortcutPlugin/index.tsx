import { MarkdownShortcutPlugin } from '@lexical/react/LexicalMarkdownShortcutPlugin';
import * as React from 'react';

import { PLAYGROUND_TRANSFORMERS } from '../MarkdownTransformers';

export const MarkdownPlugin = (): JSX.Element => <MarkdownShortcutPlugin transformers={PLAYGROUND_TRANSFORMERS} />;
