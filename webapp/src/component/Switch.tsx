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
      className={classNames('w-11 h-6 relative inline-block', {
        'cursor-not-allowed': disabled,
        'cursor-pointer': !disabled,
      })}
    >
      <span
        className={classNames('rounded-3xl h-full block w-full absolute', {
          'bg-teal-500': checked && !disabled,
          'bg-grey-500': !checked && !disabled,
          'bg-teal-300': checked && disabled,
          'bg-grey-200': !checked && disabled,
        })}
      />
      <span
        className={classNames(
          'block w-[18px] h-[18px] top-[3px] rounded-2xl bg-white relative transition-all',
          {
            'left-[23px]': checked,
            'left-[3px]': !checked,
          },
        )}
      />
      <input
        className="absolute left-0 top-0 z-0 m-0 h-full w-full cursor-[inherit] opacity-0"
        type="checkbox"
        onChange={handleChange}
        checked={checked}
        disabled={disabled}
      />
    </span>
  );
};

export default Switch;
