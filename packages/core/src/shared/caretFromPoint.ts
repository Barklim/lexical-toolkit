export const caretFromPoint = (
  x: number,
  y: number,
): null | {
  offset: number;
  node: Node;
} => {
  if (typeof document.caretRangeFromPoint !== 'undefined') {
    const range = document.caretRangeFromPoint(x, y);
    if (range === null) {
      return null;
    }
    return {
      node: range.startContainer,
      offset: range.startOffset,
    };
  } else if ((document as any).caretPositionFromPoint !== 'undefined') {
    const range = (document as any).caretPositionFromPoint(x, y);
    if (range === null) {
      return null;
    }
    return {
      node: range.offsetNode,
      offset: range.offset,
    };
  }
  // Gracefully handle IE
  return null;
};
