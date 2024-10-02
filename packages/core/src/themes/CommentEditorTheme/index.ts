import type { EditorThemeClasses } from 'lexical';

// import './CommentEditorTheme.css';

import { theme as baseTheme } from '../PlaygroundEditorTheme';

export const theme: EditorThemeClasses = {
  ...baseTheme,
  paragraph: 'CommentEditorTheme__paragraph',
};
