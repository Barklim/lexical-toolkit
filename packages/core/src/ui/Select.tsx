import * as React from 'react';

// import './Select.css';

type SelectIntrinsicProps = JSX.IntrinsicElements['select'];
interface SelectProps extends SelectIntrinsicProps {
  label: string;
}

export const Select = ({ children, label, className, ...other }: SelectProps): JSX.Element => (
  <div className="Input__wrapper">
    <label style={{ marginTop: '-1em' }} className="Input__label">
      {label}
    </label>
    <select {...other} className={className || 'select'}>
      {children}
    </select>
  </div>
);
