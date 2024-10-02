/* eslint-disable import/no-extraneous-dependencies */
import React, { useRef, useEffect } from "react";
import { $getSelection, $setSelection } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

// import { noop } from 'shared/functions';

import { MustacheNode } from "../../nodes/MustacheNode";
import { useFocus } from "../../hooks/useFocus";
import { TagsType } from "../../types";

import { ModalTagSelector } from "./ModalTagsSelector";

const hintStart = "Enter {{ and start writing a parameter";

type MentionHintPropsType = {
  limitTagCodes?: any[];
  tags: TagsType;
};

export const MentionHint = ({ limitTagCodes, tags }: MentionHintPropsType) => {
  const modalTagSelector = useRef<any>(null);
  const [editor] = useLexicalComposerContext();
  const { hasFocus } = useFocus();

  useEffect(() => {
    if (hasFocus) {
      // modalTagSelector.current?.open().then((tag: any) => {}, noop);
      modalTagSelector.current?.open().then((tag: any) => {}, {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelect = (tag: any, external: any) => {
    editor.update(() => {
      const selection = $getSelection();
      if (selection) {
        const textNode = new MustacheNode(tag.name);
        selection.insertNodes([textNode]);
        $setSelection(selection);
      }
    });
  };

  return (
    <div className="small text-muted">
      <ModalTagSelector
        ref={modalTagSelector}
        tags={tags}
        limitTagCodes={limitTagCodes}
      />
      {hintStart}
      {hasFocus ? (
        <>
          , or&nbsp;
          <a
            onMouseDown={() => {
              modalTagSelector.current
                ?.open()
                .then((tag: any, external: any) => {
                  handleSelect(tag, external);
                  // }, noop);
                }, {});
            }}
          >
            select a parameter from the library
          </a>
        </>
      ) : null}
    </div>
  );
};
