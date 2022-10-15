import classNames from 'classnames';
import { ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  appearance?: 'primary' | 'secondary' | 'default';
};

const Button = ({ appearance = 'primary', className, ...props }: Props) => (
  <button
    className={classNames('rounded-[10px] px-[30px] py-[10px] text-[14px] font-bold', className, {
      'bg-navy-700 text-white active:bg-navy-500 disabled:bg-navy-100 disabled:text-opacity-40':
        appearance === 'primary',
      'bg-grey-500 text-navy-900 active:bg-grey-300 disabled:text-opacity-30':
        appearance === 'secondary',
      'bg-teal-500 text-white active:bg-teal-400 disabled:bg-teal-300 disabled:text-opacity-40':
        appearance === 'default',
    })}
    {...props}
  />
);

export default Button;
