import classNames from 'classnames';
import { forwardRef, TextareaHTMLAttributes } from 'react';

export type Props = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  helper?: string;
  error?: boolean | string;
};

const Textarea = forwardRef<HTMLTextAreaElement, Props>(
  ({ label, helper, error, disabled, ...props }, ref) => (
    <div>
      {label && (
        <div
          className={classNames('text-[14px] leading-normal text-navy-700 mb-[5px]', {
            'opacity-30': disabled,
          })}
        >
          {label}
        </div>
      )}
      <textarea
        className={classNames(
          'rounded bg-grey-200 outline-none p-2 h-16 w-full border-solid border-[1px] focus:border-solid focus:border-teal-500 leading-normal',
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
            <div className="text-[12px] leading-normal text-tomato-500">{error}</div>
          )}
          {helper && <div className="text-[12px] leading-normal text-navy-300">{helper}</div>}
        </div>
      )}
    </div>
  ),
);

export default Textarea;
