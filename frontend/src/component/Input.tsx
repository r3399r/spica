import classNames from 'classnames';
import { InputHTMLAttributes } from 'react';

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: string;
};

const Input = ({ label, helper, error, disabled, ...props }: Props) => (
  <div className="pt-4">
    {label && (
      <div
        className={classNames('text-[14px] leading-normal text-navy-700 mb-[5px]', {
          'opacity-30': disabled,
        })}
      >
        {label}
      </div>
    )}
    <input
      className={classNames(
        'rounded bg-grey-200 outline-none p-2 h-[40px] w-full border-solid border-[1px] focus:border-solid focus:border-teal-500',
        {
          'border-tomato-500': !!error,
          'border-grey-200': !error,
          'text-grey-500 placeholder:text-grey-500': !!disabled,
          'text-navy-900 placeholder:text-navy-100': !disabled,
        },
      )}
      disabled={disabled}
      {...props}
    />
    {(error || helper) && (
      <div className="mt-[5px]">
        {error && <div className="text-tomato-500 text-[12px] leading-normal">{error}</div>}
        {helper && <div className="text-navy-300 text-[12px] leading-normal">{helper}</div>}
      </div>
    )}
  </div>
);

export default Input;
