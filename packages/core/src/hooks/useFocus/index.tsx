import { useEffect, useState } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW, FOCUS_COMMAND } from 'lexical';

export const useFocus = () => {
  const [editor] = useLexicalComposerContext();
  const [hasFocus, setHasFocus] = useState(false);

  useEffect(() => {
    const unregisterBlur = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        setHasFocus(false);
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    const unregisterFocus = editor.registerCommand(
      FOCUS_COMMAND,
      () => {
        setHasFocus(true);
        return true;
      },
      COMMAND_PRIORITY_LOW,
    );

    return () => {
      unregisterBlur();
      unregisterFocus();
    };
  }, [editor]);

  return { hasFocus };
};
