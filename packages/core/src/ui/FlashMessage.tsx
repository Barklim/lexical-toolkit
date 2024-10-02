import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

// import './FlashMessage.css';
import React from 'react';

export interface FlashMessageProps {
  children: ReactNode;
}

export const FlashMessage = ({ children }: FlashMessageProps): JSX.Element =>
  createPortal(
    <div className="FlashMessage__overlay" role="dialog">
      <p className="FlashMessage__alert" role="alert">
        {children}
      </p>
    </div>,
    document.body,
  );
