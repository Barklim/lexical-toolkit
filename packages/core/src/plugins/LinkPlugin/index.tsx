import { LinkPlugin as LexicalLinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import * as React from 'react';

import { validateUrl } from '../../utils/url';

export const LinkPlugin = (): JSX.Element => <LexicalLinkPlugin validateUrl={validateUrl} />;
