import { DraggableBlockPlugin_EXPERIMENTAL as DraggableBlock } from '@lexical/react/LexicalDraggableBlockPlugin';
import { useRef } from 'react';

// import './index.css';
import React from 'react';

const DRAGGABLE_BLOCK_MENU_CLASSNAME = 'draggable-block-menu';

function isOnMenu(element: HTMLElement): boolean {
  return !!element.closest(`.${DRAGGABLE_BLOCK_MENU_CLASSNAME}`);
}

export const DraggableBlockPlugin = ({ anchorElem = document.body }: { anchorElem?: HTMLElement }): JSX.Element => {
  const menuRef = useRef<HTMLDivElement>(null);
  const targetLineRef = useRef<HTMLDivElement>(null);

  return (
    <DraggableBlock
      anchorElem={anchorElem}
      menuRef={menuRef}
      targetLineRef={targetLineRef}
      menuComponent={
        <div ref={menuRef} className="icon draggable-block-menu">
          <div className="icon" />
        </div>
      }
      targetLineComponent={<div ref={targetLineRef} className="draggable-block-target-line" />}
      isOnMenu={isOnMenu}
    />
  );
};
