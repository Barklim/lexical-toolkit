import { $getRoot } from 'lexical';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useEffect } from 'react';
import { $generateNodesFromDOM } from '@lexical/html';

export type InsertHTMLPluginPropsType = {
  initialValues: any;
  isPlainText: boolean;
  html?: string;
};

export const InsertHTMLPlugin = ({ initialValues, isPlainText, html }: InsertHTMLPluginPropsType) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!initialValues) return;

    const preparedHTML = isPlainText ? `<div>${initialValues.subject}</div>` : html || '';

    const dom = new DOMParser().parseFromString(preparedHTML, 'text/html');

    editor.update(() => {
      const root = $getRoot();
      root.clear();
      root.append(...$generateNodesFromDOM(editor, dom));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues, isPlainText, editor]);

  return null;
};
