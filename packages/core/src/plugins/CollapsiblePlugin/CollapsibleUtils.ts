export function setDomHiddenUntilFound(dom: Element): void {
  (dom as HTMLElement).hidden = true; // 'until-found
}

export function domOnBeforeMatch(dom: Element, callback: () => void): void {
  (dom as any).onbeforematch = callback;
}
