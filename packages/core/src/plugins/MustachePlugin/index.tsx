/* eslint-disable import/no-extraneous-dependencies */
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { TextNode, LexicalEditor } from 'lexical';
import { useEffect } from 'react';

import { createMustacheNode, MustacheNode } from '../../nodes/MustacheNode';
import { TagsType } from '../../types';

function findAndTransformMustache(node: TextNode, tags: TagsType): null | TextNode {
  const text = node.getTextContent();

  for (const { code, name } of tags) {
    const index = text.indexOf(code);

    if (index !== -1) {
      let targetNode;

      if (index === 0) {
        [targetNode] = node.splitText(index + code.length);
      } else {
        [, targetNode] = node.splitText(index, index + code.length);
      }

      const mustacheNode = createMustacheNode(name);
      targetNode.replace(mustacheNode);
      return mustacheNode;
    }
  }

  return null;
}

const textNodeTransform = (node: TextNode, tags: TagsType): void => {
  let targetNode: TextNode | null = node;

  while (targetNode !== null) {
    if (!targetNode.isSimpleText()) {
      return;
    }

    targetNode = findAndTransformMustache(targetNode, tags);
  }
};

function useMustaches(editor: LexicalEditor, tags: TagsType): void {
  useEffect(() => {
    if (!editor.hasNodes([MustacheNode])) {
      throw new Error('MustachePlugin: MustacheNode not registered on editor');
    }

    return editor.registerNodeTransform(TextNode, (node) => textNodeTransform(node, tags));
  }, [editor, tags]);
}

export type MustachePluginPropsType = {
  tags: TagsType;
};

export const MustachePlugin = ({ tags }: MustachePluginPropsType) => {
  const [editor] = useLexicalComposerContext();
  useMustaches(editor, tags);
  return null;
};
