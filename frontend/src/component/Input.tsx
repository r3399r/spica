import classNames from 'classnames';
import { ChangeEvent, forwardRef, InputHTMLAttributes, useState } from 'react';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: boolean | string;
  regex?: RegExp;
  startsWith?: string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      helper,
      error,
      disabled,
      onChange,
      regex,
      defaultValue,
      className,
      startsWith,
      ...props
    },
    ref,
  ) => {
    const [value, setValue] = useState<string>((defaultValue as string) ?? '');
    const onInput = (v: ChangeEvent<HTMLInputElement>) => {
      const input = startsWith ? v.target.value.substring(startsWith.length) : v.target.value;
      if (regex !== undefined && regex.test(input) === false) return;
      setValue(input);
      onChange && onChange({ ...v, target: { ...v.target, value: input } });
    };

    return (
      <div>
        {label && (
          <div
            className={classNames('mb-[5px] text-[14px] leading-normal text-navy-700', {
              'opacity-30': disabled,
            })}
          >
            {label}
          </div>
        )}
        <input
          className={classNames(
            'h-[40px] w-full rounded border-[1px] border-solid bg-grey-200 p-2 outline-none focus:border-solid focus:border-teal-500',
            className,
            {
              'border-tomato-500': !!error,
              'border-grey-200': !error,
              'text-grey-500 placeholder:text-grey-500': !!disabled,
              'text-navy-900 placeholder:text-navy-100': !disabled,
            },
          )}
          ref={ref}
          disabled={disabled}
          autoComplete="off"
          value={`${startsWith ?? ''}${value}`}
          onChange={onInput}
          {...props}
        />
        {(typeof error === 'string' || helper) && (
          <div className="mt-[5px]">
            {typeof error === 'string' && (
              <div className="text-[12px] leading-normal text-tomato-500">{error}</div>
            )}
            {helper && <div className="text-[12px] leading-normal text-navy-300">{helper}</div>}
          </div>
        )}
      </div>
    );
  },
);

export default Input;
