import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import * as React from 'react';

// import './ContentEditable.css';

type Props = {
  className?: string;
  placeholderClassName?: string;
  placeholder: string;
  inputMode?: boolean;
};

export const LexicalContentEditable = ({
  className = '',
  placeholder,
  placeholderClassName = 'ContentEditable__placeholder',
  inputMode,
}: Props): JSX.Element => {
  const rootClass = `ContentEditable__root ${
    inputMode ? 'ContentEditable__root_inputMode' : 'ContentEditable__root_rte'
  } ${className}`.trim();
  const placeholderClass = `${
    inputMode ? 'ContentEditable__placeholder_inputMode' : 'ContentEditable__placeholder_rte'
  } ${placeholderClassName}`.trim();

  return (
    <ContentEditable
      className={rootClass}
      aria-placeholder={placeholder}
      placeholder={<div className={placeholderClass}>{placeholder}</div>}
    />
  );
};
