import classNames from 'classnames';
import { forwardRef, InputHTMLAttributes } from 'react';

export type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  helper?: string;
  error?: boolean | string;
};

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, helper, error, disabled, ...props }, ref) => (
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
        ref={ref}
        disabled={disabled}
        autoComplete="off"
        {...props}
      />
      {(typeof error === 'string' || helper) && (
        <div className="mt-[5px]">
          {typeof error === 'string' && (
            <div className="text-tomato-500 text-[12px] leading-normal">{error}</div>
          )}
          {helper && <div className="text-navy-300 text-[12px] leading-normal">{helper}</div>}
        </div>
      )}
    </div>
  ),
);

export default Input;
