import {
  $applyNodeReplacement,
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  type Spread,
  TextNode,
} from 'lexical';

export type SerializedMustacheNode = Spread<
  {
    mustacheName: string;
  },
  SerializedTextNode
>;

const convertMustacheElement = (domNode: HTMLElement): DOMConversionOutput | null => {
  const textContent = domNode.textContent;

  if (textContent !== null) {
    const node = createMustacheNode(textContent);
    return {
      node,
    };
  }

  return null;
};

const mustacheStyle = 'background-color: rgb(204, 255, 204)';
export class MustacheNode extends TextNode {
  __mustache: string;

  static getType(): string {
    return 'mustache';
  }

  static clone(node: MustacheNode): MustacheNode {
    return new MustacheNode(node.__mustache, node.__text, node.__key);
  }
  static importJSON(serializedNode: SerializedMustacheNode): MustacheNode {
    const node = createMustacheNode(serializedNode.mustacheName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mustacheName: string, text?: string, key?: NodeKey) {
    super(text ?? mustacheName, key);
    this.__mustache = mustacheName;
  }

  exportJSON(): SerializedMustacheNode {
    return {
      ...super.exportJSON(),
      mustacheName: this.__mustache,
      type: 'mustache',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    dom.style.cssText = mustacheStyle;
    dom.className = 'mustache';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mustache', 'true');
    element.textContent = this.__text;
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mustache')) {
          return null;
        }
        return {
          conversion: convertMustacheElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }
}

export const createMustacheNode = (mustacheName: string): MustacheNode => {
  const mustacheNode = new MustacheNode(mustacheName);
  mustacheNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mustacheNode);
};

export const isMustacheNode = (node: LexicalNode | null | undefined): node is MustacheNode =>
  node instanceof MustacheNode;
