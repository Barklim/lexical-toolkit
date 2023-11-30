import type { EditorConfig, LexicalNode, SerializedTextNode } from "lexical";
import { TextNode } from "lexical";

export type SerializedKeywordNode = SerializedTextNode;

export class KeywordNode extends TextNode {
  static getType(): string {
    return "keyword";
  }

  static clone(node: KeywordNode): KeywordNode {
    return new KeywordNode(node.__text, node.__key);
  }

  static importJSON(serializedNode: SerializedKeywordNode): KeywordNode {
    const node = $createKeywordNode(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  exportJSON(): SerializedKeywordNode {
    return {
      ...super.exportJSON(),
      type: "keyword",
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);

    let keywordClass = config.theme?.keyword;
    if (!keywordClass) {
      keywordClass = "lexical-toolkit-keyword";
      console.warn(
        "Lexical Toolkit. KeywordNode: No keyword class found in theme, used 'lexical-toolkit-keyword' instead."
      );
    }

    dom.className = keywordClass;
    return dom;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  isTextEntity(): true {
    return true;
  }
}

export function $createKeywordNode(keyword: string): KeywordNode {
  return new KeywordNode(keyword);
}

export function $isKeywordNode(node: LexicalNode | null | undefined): boolean {
  return node instanceof KeywordNode;
}
