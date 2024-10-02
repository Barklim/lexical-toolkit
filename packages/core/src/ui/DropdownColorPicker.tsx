import * as React from 'react';

import { ColorPicker } from './ColorPicker';
import DropDown from './DropDown';

type Props = {
  disabled?: boolean;
  buttonAriaLabel?: string;
  buttonClassName: string;
  buttonIconClassName?: string;
  buttonLabel?: string;
  title?: string;
  stopCloseOnClickSelf?: boolean;
  color: string;
  onChange?: (color: string, skipHistoryStack: boolean) => void;
};

export const DropdownColorPicker = ({
  disabled = false,
  stopCloseOnClickSelf = true,
  color,
  onChange,
  ...rest
}: Props) => (
  <DropDown {...rest} disabled={disabled} stopCloseOnClickSelf={stopCloseOnClickSelf}>
    <ColorPicker color={color} onChange={onChange} />
  </DropDown>
);
