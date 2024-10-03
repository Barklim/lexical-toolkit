import * as React from 'react';
// import {
//   LexicalComposer,
//   FlashMessageContext,
//   PlaygroundNodes,
//   SharedHistoryContext,
//   SharedAutocompleteContext,
//   SettingsContext,
//   useSettings,
//   DocsPlugin,
//   PasteLogPlugin,
//   TestRecorderPlugin,
//   TypingPerfPlugin,
// } from 'lexical-toolkit';

import { isDevPlayground } from '../appSettings';
// import { Editor as DefaultEditor } from './Editor'; // Переименуем текущий Editor в DefaultEditor
import { theme as PlaygroundEditorTheme } from '../themes/PlaygroundEditorTheme';
import { SettingsContext, useSettings } from '../context/SettingsContext';
import { PlaygroundNodes } from '../nodes/PlaygroundNodes';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { SharedHistoryContext } from '../context/SharedHistoryContext';
import { SharedAutocompleteContext } from '../context/SharedAutocompleteContext';
import { DocsPlugin } from '../plugins/DocsPlugin';
import { PasteLogPlugin } from '../plugins/PasteLogPlugin';
import { TestRecorderPlugin } from '../plugins/TestRecorderPlugin';
import { TypingPerfPlugin } from '../plugins/TypingPerfPlugin';
import { FlashMessageContext } from '../context/FlashMessageContext';
import { Editor } from './Editor';

// import './index.css';

interface AppProps {
  EditorComponent?: React.ComponentType<any>;
}

function App({ EditorComponent = Editor, ...props }: AppProps): JSX.Element {
  const {
    settings: { isCollab, emptyEditor, measureTypingPerf },
  } = useSettings();

  const initialConfig = {
    editorState: isCollab ? null : emptyEditor ? undefined : '123',
    namespace: 'Playground',
    nodes: [...PlaygroundNodes],
    onError: (error: Error) => {
      throw error;
    },
    theme: PlaygroundEditorTheme,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <SharedHistoryContext>
        <SharedAutocompleteContext>
          <div className="editor-shell RichEditor-root">
            {/* Используем переданный компонент редактора или дефолтный */}
            {EditorComponent && <EditorComponent {...props} /> } 
          </div>
          {isDevPlayground ? <DocsPlugin /> : null}
          {isDevPlayground ? <PasteLogPlugin /> : null}
          {isDevPlayground ? <TestRecorderPlugin /> : null}

          {measureTypingPerf ? <TypingPerfPlugin /> : null}
        </SharedAutocompleteContext>
      </SharedHistoryContext>
    </LexicalComposer>
  );
}

interface LexicalAppProps {
  editorComponent?: React.ComponentType<any>;
}

export const LexicalApp = ({ editorComponent, ...props }: LexicalAppProps): JSX.Element => (
  <SettingsContext>
    <FlashMessageContext>
      <App {...props} EditorComponent={editorComponent} />
    </FlashMessageContext>
  </SettingsContext>
);
