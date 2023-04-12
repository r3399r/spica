import { forwardRef } from 'react';
import Input, { Props as InputProps } from './Input';

export type Props = InputProps & {
  decimal: number;
  allowNegative?: boolean;
};

const NumberInput = forwardRef<HTMLInputElement, Props>(
  ({ decimal, allowNegative = false, ...props }, ref) => (
    <Input
      regex={
        decimal > 0
          ? new RegExp(`^${allowNegative ? '-?' : ''}[0-9]*\\.?[0-9]{0,${decimal}}$`)
          : new RegExp(`^${allowNegative ? '-?' : ''}[0-9]*$`)
      }
      ref={ref}
      inputMode="numeric"
      {...props}
    />
  ),
);

NumberInput.displayName = 'NumberInput';

export default NumberInput;
