import classNames from 'classnames';
import { ChangeEvent, useState } from 'react';

type Props = {
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
};

const Switch = (props: Props) => {
  const { defaultChecked, disabled, onChange } = props;
  const [checked, setChecked] = useState<boolean>(defaultChecked ?? false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    if (onChange) onChange();
  };

  return (
    <span
      className={classNames('relative inline-block h-6 w-11', {
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,
      })}
    >
      <span
        className={classNames('absolute block h-full w-full rounded-3xl', {
          'bg-teal-500': checked && !disabled,
          'bg-grey-500': !checked && !disabled,
          'bg-teal-300': checked && disabled,
          'bg-grey-200': !checked && disabled,
        })}
      />
      <span
        className={classNames(
          'relative top-[3px] block h-[18px] w-[18px] rounded-2xl bg-white transition-all',
          {
            'left-[23px]': checked,
            'left-[3px]': !checked,
          },
        )}
      />
      <input
        className="absolute top-0 left-0 z-0 m-0 h-full w-full cursor-[inherit] opacity-0"
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
      />
    </span>
  );
};

export default Switch;
