import * as React from 'react';
import { ReactNode } from 'react';

import { joinClasses } from '../utils/joinClasses';

// import './Button.css';

export const Button = ({
  'data-test-id': dataTestId,
  children,
  className,
  onClick,
  disabled,
  small,
  title,
}: {
  'data-test-id'?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  onClick: () => void;
  small?: boolean;
  title?: string;
}): JSX.Element => (
  <button
    type="button"
    disabled={disabled}
    className={joinClasses('Button__root', disabled && 'Button__disabled', small && 'Button__small', className)}
    onClick={onClick}
    title={title}
    aria-label={title}
    {...(dataTestId && { 'data-test-id': dataTestId })}
  >
    {children}
  </button>
);
