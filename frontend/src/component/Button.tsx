import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: 'primary' | 'secondary' | 'default' | 'error';
};

const Button = ({ appearance = 'primary', className, ...props }: Props) => (
  <button
    className={classNames(
      'rounded-[10px] px-[30px] py-[10px] text-[14px] leading-normal font-bold outline-none enabled:cursor-pointer',
      className,
      {
        'disabled:text-opacity-40 bg-navy-700 text-white active:bg-navy-500 disabled:bg-navy-100':
          appearance === 'primary',
        'disabled:text-opacity-30 bg-grey-500 text-navy-900 active:bg-grey-300':
          appearance === 'secondary',
        'disabled:text-opacity-70 bg-teal-500 text-white active:bg-teal-400 disabled:bg-teal-300':
          appearance === 'default',
        'disabled:text-opacity-70 bg-tomato-500 text-white active:bg-tomato-400 disabled:bg-tomato-300':
          appearance === 'error',
      },
    )}
    {...props}
  />
);

export default Button;
