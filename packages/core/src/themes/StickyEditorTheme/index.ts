import type { EditorThemeClasses } from 'lexical';

// import './StickyEditorTheme.css';

import { theme as baseTheme } from '../PlaygroundEditorTheme';

export const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'StickyEditorTheme__paragraph',
};
