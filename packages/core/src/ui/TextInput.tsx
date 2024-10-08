import * as React from 'react';
import { HTMLInputTypeAttribute } from 'react';

// import './Input.css';

type Props = Readonly<{
  'data-test-id'?: string;
  label: string;
  onChange: (val: string) => void;
  placeholder?: string;
  value: string;
  type?: HTMLInputTypeAttribute;
}>;

export const TextInput = ({
  label,
  value,
  onChange,
  placeholder = '',
  'data-test-id': dataTestId,
  type = 'text',
}: Props): JSX.Element => (
  <div className="Input__wrapper">
    <label className="Input__label">{label}</label>
    <input
      type={type}
      className="Input__input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
      }}
      data-test-id={dataTestId}
    />
  </div>
);
